import { BaseConnector } from './base';
import { PatentData, ConnectorConfig, SearchOptions } from './types';

// ──────────────────────────────────────────────
// API Connector — External REST APIs
// Fetches patent data from services like the
// USPTO PatentsView API, EPO, or Google Patents.
// ──────────────────────────────────────────────

interface ApiConnectorConfig extends ConnectorConfig {
    baseUrl: string;          // e.g. "https://api.patentsview.org/patents/query"
    apiKey?: string;          // Optional API key
    headers?: Record<string, string>;
}

export class ApiConnector extends BaseConnector {
    name = 'API-USPTO';
    sourceType = 'API' as const;

    private baseUrl: string;
    private apiKey?: string;
    private headers: Record<string, string>;

    constructor(config: ApiConnectorConfig) {
        super();
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
        this.headers = {
            'Content-Type': 'application/json',
            ...(config.apiKey ? { 'X-Api-Key': config.apiKey } : {}),
            ...(config.headers ?? {}),
        };
    }

    async search(query: string, options?: SearchOptions): Promise<PatentData[]> {
        const limit = options?.limit ?? 20;
        const offset = options?.offset ?? 0;

        this.log('SEARCH', { query, limit, offset });

        const url = new URL(this.baseUrl);
        url.searchParams.set('q', query);
        url.searchParams.set('rows', String(limit));
        url.searchParams.set('start', String(offset));

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: this.headers,
        });

        if (!response.ok) {
            this.log('SEARCH_ERROR', { status: response.status });
            throw new Error(`API responded with ${response.status}`);
        }

        const json = await response.json();

        // The mapping below is an example for the USPTO PatentsView API.
        // Adjust field names based on the actual API response structure.
        const items: any[] = json.patents ?? json.results ?? json.data ?? [];

        const mapped = items.map((item: any) => ({
            patent_id: item.patent_number ?? item.application_number ?? item.id,
            title: item.patent_title ?? item.title ?? '',
            abstract: item.patent_abstract ?? item.abstract ?? '',
            claims: item.claims?.[0]?.claim_text ?? undefined,
            uniqueness_score: item.uniqueness_score ?? null,
            filing_date: item.patent_date ?? item.filing_date ?? undefined,
            cpc_codes: item.cpcs?.map((c: any) => c.cpc_group_id) ?? [],
            source: 'API' as const,
            metadata: { raw_id: item.patent_number ?? item.id },
        }));

        return this.normalizeBatch(mapped);
    }

    async getById(id: string): Promise<PatentData | null> {
        this.log('GET_BY_ID', { id });

        const url = `${this.baseUrl}/${id}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: this.headers,
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`API responded with ${response.status}`);
        }

        const item = await response.json();

        return this.normalize({
            patent_id: item.patent_number ?? item.application_number ?? item.id,
            title: item.patent_title ?? item.title ?? '',
            abstract: item.patent_abstract ?? item.abstract ?? '',
            claims: item.claims?.[0]?.claim_text ?? undefined,
            uniqueness_score: item.uniqueness_score ?? null,
            filing_date: item.patent_date ?? item.filing_date ?? undefined,
            cpc_codes: item.cpcs?.map((c: any) => c.cpc_group_id) ?? [],
            source: 'API' as const,
        });
    }

    async ping(): Promise<boolean> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'HEAD',
                headers: this.headers,
            });
            const ok = response.ok || response.status === 405; // some APIs don't support HEAD
            this.log('PING', ok ? 'OK' : 'FAILED');
            return ok;
        } catch {
            this.log('PING', 'FAILED');
            return false;
        }
    }
}
