import { z } from 'zod';

// 1. The Database Schema Rules (Acceptance Criteria: Field existence & Operator compatibility)
const SCHEMA_RULES = {
  title:  { type: 'string', ops: ['=', '!=', 'LIKE', 'IN'] },
  salary: { type: 'number', ops: ['=', '!=', '>', '<', 'IN'] },
  status: { type: 'string', ops: ['=', '!=', 'IN'] },
};

const FieldEnum = z.enum(['title', 'salary', 'status']);
const OperatorEnum = z.enum(['=', '!=', '>', '<', 'IN', 'LIKE']);

// 2. The Condition Inspector
const ConditionSchema = z.object({
  field: z.string(),
  operator: OperatorEnum,
  value: z.any(),
}).superRefine((data, ctx) => {
  const rule = SCHEMA_RULES[data.field as keyof typeof SCHEMA_RULES];
  
  // Checks if the field actually exists in our database
  if (!rule) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Invalid field: '${data.field}'` });
    return;
  }
  // Checks if the math operator makes sense for this data type
  if (!rule.ops.includes(data.operator)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Operator '${data.operator}' not allowed for field '${data.field}'` });
  }
  // Checks if the value is the correct data type (e.g., no text in a number field)
  if (data.operator !== 'IN' && typeof data.value !== rule.type) {
     ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Value for '${data.field}' must be a ${rule.type}` });
  }
});

// 3. Recursive Logic (Acceptance Criteria: Supports AND / OR grouping)
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

// 4. The Final Output (Acceptance Criteria: Select fields & Structured object output)
export const QueryBuilderSchema = z.object({
  select: z.array(FieldEnum).min(1),
  where: LogicalGroupSchema.optional(),
});

// The main service function you will call from your API routes
export function buildSafeQuery(incomingJson: unknown) {
  return QueryBuilderSchema.parse(incomingJson);
}