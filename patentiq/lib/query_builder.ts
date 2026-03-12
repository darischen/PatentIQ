import { z } from 'zod';
import { sql } from './db';
import OpenAI from 'openai';

// 1. Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 2. Updated Database Schema Rules for Patents
const SCHEMA_RULES = {
  id: { type: 'string', ops: ['=', '!=', 'IN'] },
  title: { type: 'string', ops: ['=', '!=', 'LIKE', 'IN'] },
  abstract: { type: 'string', ops: ['LIKE'] },
};

const FieldEnum = z.enum(['id', 'title', 'abstract']);
const OperatorEnum = z.enum(['=', '!=', '>', '<', 'IN', 'LIKE']);

// 3. Recursive Logic for AND / OR grouping
const ConditionSchema = z.object({
  field: z.string(),
  operator: OperatorEnum,
  value: z.any(),
}).superRefine((data, ctx) => {
  const rule = SCHEMA_RULES[data.field as keyof typeof SCHEMA_RULES];
  if (!rule) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Invalid field: '${data.field}'` });
    return;
  }
  if (!rule.ops.includes(data.operator)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Operator '${data.operator}' not allowed for field '${data.field}'` });
  }
});

type LogicalGroup = {
  logic: 'AND' | 'OR';
  conditions: (z.infer<typeof ConditionSchema> | LogicalGroup)[];
};

const LogicalGroupSchema: z.ZodType<LogicalGroup> = z.lazy(() =>
  z.object({
    logic: z.enum(['AND', 'OR']),
    conditions: z.array(z.union([ConditionSchema, LogicalGroupSchema])).min(1),
  })
);

export const QueryBuilderSchema = z.object({
  select: z.array(FieldEnum).min(1),
  where: LogicalGroupSchema.optional(),
});

export function buildSafeQuery(data: any) {
  return QueryBuilderSchema.parse(data);
}

// 4. Data Interfaces
export interface PatentResult {
  id: string;
  title: string;
  abstract: string;
  similarity_score: number;
}

/**
 * HELPER: Converts the recursive JSON logic into a partial SQL string
 */
function buildSqlWhere(group: LogicalGroup): string {
  const parts = group.conditions.map((cond) => {
    if ('logic' in cond) {
      return `(${buildSqlWhere(cond)})`;
    }
    // Simple sanitization for operators
    const val = typeof cond.value === 'string' ? `'${cond.value.replace(/'/g, "''")}'` : cond.value;
    if (cond.operator === 'LIKE') return `${cond.field} ILIKE '%${cond.value}%'`;
    return `${cond.field} ${cond.operator} ${val}`;
  });
  return parts.join(` ${group.logic} `);
}

/**
 * MAIN SERVICE: Ranks patents and applies dynamic filters
 */
export async function rankPatents(
  queryText: string,
  topK: number = 5,
  structuredFilters?: any
): Promise<PatentResult[]> {
  try {
    // 1. Get Vector Embedding
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: queryText,
    });
    const queryVector = embeddingResponse.data[0].embedding;
    const vectorString = `[${queryVector.join(',')}]`;

    // 2. Parse Structured Filters if provided
    let whereClause = '';
    if (structuredFilters) {
      const validated = LogicalGroupSchema.parse(structuredFilters);
      whereClause = `WHERE ${buildSqlWhere(validated)}`;
    }

    // 3. Combined Query: Vector Similarity + Dynamic Filters
    const results = await sql<PatentResult[]>`
      SELECT 
        id, 
        title, 
        abstract, 
        1 - (embedding <=> ${vectorString}::vector) AS similarity_score
      FROM patents
      ${whereClause ? sql.unsafe(whereClause) : sql``}
      ORDER BY embedding <=> ${vectorString}::vector
      LIMIT ${topK};
    `;

    return results;
  } catch (error) {
    console.error("Error in rankPatents:", error);
    throw new Error("Failed to rank patents with dynamic filters");
  }
}