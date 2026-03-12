// ──────────────────────────────────────────────
// Connector Layer — Barrel Export
// Import everything from here.
// ──────────────────────────────────────────────

export { PatentDataSchema, type PatentData, type ConnectorInterface, type SearchOptions } from './types';
export { BaseConnector } from './base';
export { SqlConnector } from './sql';
export { ApiConnector } from './api';
export { CsvConnector } from './csv';
