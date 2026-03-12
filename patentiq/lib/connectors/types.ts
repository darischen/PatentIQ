import { z } from 'zod';

// ──────────────────────────────────────────────
// Standardized Patent Data — the "Ideal Response"
// Every connector must output data in this shape.
// ──────────────────────────────────────────────

export const PatentDataSchema = z.object({
    patent_id: z.string(),
    title: z.string(),
    abstract: z.string(),
    claims: z.string().optional(),
    uniqueness_score: z.number().nullable().default(null),
    filing_date: z.string().optional(),
    cpc_codes: z.array(z.string()).default([]),
    source: z.enum(['SQL', 'API', 'CSV']),
    metadata: z.record(z.any()).optional(),
});

export type PatentData = z.infer<typeof PatentDataSchema>;

// ──────────────────────────────────────────────
// Connector Interface — the "Contract"
// Every data-source connector must implement this.
// ──────────────────────────────────────────────

export interface ConnectorConfig {
    [key: string]: any;
}

export interface ConnectorInterface {
    /** Human-readable name, e.g. "PostgreSQL Patents DB" */
    name: string;

    /** Which kind of source this connector talks to */
    sourceType: 'SQL' | 'API' | 'CSV';

    /** Search patents by a text query */
    search(query: string, options?: SearchOptions): Promise<PatentData[]>;

    /** Fetch a single patent by ID */
    getById(id: string): Promise<PatentData | null>;

    /** Quick health-check — can we reach the source? */
    ping(): Promise<boolean>;
}

export interface SearchOptions {
    limit?: number;
    offset?: number;
}
