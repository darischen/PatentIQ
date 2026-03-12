import { BaseConnector } from './base';
import { PatentData, SearchOptions } from './types';
import { db } from '../db';

// ──────────────────────────────────────────────
// SQL Connector — PostgreSQL / MySQL
// Reads patent data from a relational database.
// ──────────────────────────────────────────────

export class SqlConnector extends BaseConnector {
    name = 'SQL-PatentsDB';
    sourceType = 'SQL' as const;

    async search(query: string, options?: SearchOptions): Promise<PatentData[]> {
        const limit = options?.limit ?? 20;
        const offset = options?.offset ?? 0;

        this.log('SEARCH', { query, limit, offset });

        const sql = `
      SELECT
        application_number,
        title,
        abstract,
        claims,
        uniqueness_score,
        filing_date_dt,
        cpc_normalized
      FROM patents
      WHERE
        title    ILIKE $1 OR
        abstract ILIKE $2
      ORDER BY filing_date_dt DESC
      LIMIT $3 OFFSET $4;
    `;

        const pattern = `%${query}%`;
        const result = await db.query(sql, [pattern, pattern, limit, offset]);

        // Map each DB row → standardized PatentData
        const mapped = result.rows.map((row: any) => ({
            patent_id: row.application_number,
            title: row.title,
            abstract: row.abstract,
            claims: row.claims ?? undefined,
            uniqueness_score: row.uniqueness_score ?? null,
            filing_date: row.filing_date_dt?.toISOString?.() ?? undefined,
            cpc_codes: row.cpc_normalized
                ? row.cpc_normalized.split(';').map((s: string) => s.trim())
                : [],
            source: 'SQL' as const,
        }));

        return this.normalizeBatch(mapped);
    }

    async getById(id: string): Promise<PatentData | null> {
        this.log('GET_BY_ID', { id });

        const sql = `
      SELECT
        application_number, title, abstract, claims,
        uniqueness_score, filing_date_dt, cpc_normalized
      FROM patents
      WHERE application_number = $1
      LIMIT 1;
    `;

        const result = await db.query(sql, [id]);
        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return this.normalize({
            patent_id: row.application_number,
            title: row.title,
            abstract: row.abstract,
            claims: row.claims ?? undefined,
            uniqueness_score: row.uniqueness_score ?? null,
            filing_date: row.filing_date_dt?.toISOString?.() ?? undefined,
            cpc_codes: row.cpc_normalized
                ? row.cpc_normalized.split(';').map((s: string) => s.trim())
                : [],
            source: 'SQL' as const,
        });
    }

    async ping(): Promise<boolean> {
        try {
            await db.query('SELECT 1');
            this.log('PING', 'OK');
            return true;
        } catch (err) {
            this.log('PING', 'FAILED');
            return false;
        }
    }
}
