import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { BaseConnector } from './base';
import { PatentData, ConnectorConfig, SearchOptions } from './types';

// ──────────────────────────────────────────────
// CSV Connector
// Reads patent data from a local CSV file.
// Maps columns from patents_clean.csv to PatentData.
// ──────────────────────────────────────────────

interface CsvConnectorConfig extends ConnectorConfig {
    filePath: string; // absolute or relative path to the CSV
}

export class CsvConnector extends BaseConnector {
    name = 'CSV-PatentsClean';
    sourceType = 'CSV' as const;

    private filePath: string;
    private data: PatentData[] | null = null; // lazy-loaded cache

    constructor(config: CsvConnectorConfig) {
        super();
        this.filePath = config.filePath;
    }

    // ── Load & parse CSV into memory (once) ─────
    private loadData(): PatentData[] {
        if (this.data) return this.data;

        this.log('LOADING_CSV', { filePath: this.filePath });

        const resolved = path.resolve(this.filePath);

        if (!fs.existsSync(resolved)) {
            throw new Error(`CSV file not found: ${resolved}`);
        }

        const raw = fs.readFileSync(resolved, 'utf-8');

        const records: any[] = parse(raw, {
            columns: true,   // first row = headers
            skip_empty_lines: true,
            trim: true,
        });

        this.log('PARSED_ROWS', { count: records.length });

        // Map CSV columns → standardized PatentData
        const mapped = records.map((row) => ({
            patent_id: row.application_number ?? row.patent_id ?? '',
            title: row.title ?? '',
            abstract: row.abstract ?? '',
            claims: row.claims ?? undefined,
            uniqueness_score: row.uniqueness_score
                ? parseFloat(row.uniqueness_score)
                : null,
            filing_date: row.filling_date_dt ?? row.filing_date ?? undefined,
            cpc_codes: row.cpc_normalized
                ? row.cpc_normalized
                    .split(';')
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                : [],
            source: 'CSV' as const,
            metadata: {
                filing_ordinal: row.filing_ordinal ?? undefined,
            },
        }));

        this.data = this.normalizeBatch(mapped);
        this.log('LOADED', { validPatents: this.data.length });

        return this.data;
    }

    async search(query: string, options?: SearchOptions): Promise<PatentData[]> {
        const limit = options?.limit ?? 20;
        const offset = options?.offset ?? 0;
        const q = query.toLowerCase();

        this.log('SEARCH', { query, limit, offset });

        const all = this.loadData();

        const matches = all.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.abstract.toLowerCase().includes(q)
        );

        return matches.slice(offset, offset + limit);
    }

    async getById(id: string): Promise<PatentData | null> {
        this.log('GET_BY_ID', { id });
        const all = this.loadData();
        return all.find((p) => p.patent_id === id) ?? null;
    }

    async ping(): Promise<boolean> {
        try {
            const resolved = path.resolve(this.filePath);
            const exists = fs.existsSync(resolved);
            this.log('PING', exists ? 'OK' : 'FILE_NOT_FOUND');
            return exists;
        } catch {
            this.log('PING', 'FAILED');
            return false;
        }
    }
}
