import {
    ConnectorInterface,
    PatentData,
    PatentDataSchema,
    SearchOptions,
} from './types';

// ──────────────────────────────────────────────
// Abstract Base Connector
// Shared utilities: validation, logging, etc.
// ──────────────────────────────────────────────

export abstract class BaseConnector implements ConnectorInterface {
    abstract name: string;
    abstract sourceType: 'SQL' | 'API' | 'CSV';

    abstract search(query: string, options?: SearchOptions): Promise<PatentData[]>;
    abstract getById(id: string): Promise<PatentData | null>;
    abstract ping(): Promise<boolean>;

    // ── Data Normalization ──────────────────────
    // Validates raw data against PatentDataSchema.
    // This is the "bug firewall" — bad shapes get caught here.
    protected normalize(raw: Record<string, any>): PatentData {
        const result = PatentDataSchema.safeParse(raw);

        if (!result.success) {
            const issues = result.error.issues
                .map((i) => `${i.path.join('.')}: ${i.message}`)
                .join(', ');
            this.log('NORMALIZATION_ERROR', { raw, issues });
            throw new Error(
                `[${this.name}] Data failed normalization — ${issues}`
            );
        }

        return result.data;
    }

    // Batch normalize — filters out bad rows instead of crashing
    protected normalizeBatch(rows: Record<string, any>[]): PatentData[] {
        const results: PatentData[] = [];

        for (const row of rows) {
            const parsed = PatentDataSchema.safeParse(row);
            if (parsed.success) {
                results.push(parsed.data);
            } else {
                const issues = parsed.error.issues
                    .map((i) => `${i.path.join('.')}: ${i.message}`)
                    .join(', ');
                this.log('SKIPPED_ROW', { row, issues });
            }
        }

        return results;
    }

    // ── Logging ─────────────────────────────────
    protected log(action: string, meta?: any) {
        console.log(`[Connector][${this.name}] ${action}`, meta ?? '');
    }
}
