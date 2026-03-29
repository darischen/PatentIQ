import { Pool, PoolConfig } from 'pg';
import { parse } from 'pg-connection-string';

let poolConfig: PoolConfig;

if (process.env.DATABASE_URL) {
  // Parse Supabase or other DATABASE_URL format
  const parsedConfig = parse(process.env.DATABASE_URL);
  poolConfig = {
    host: parsedConfig.host || 'localhost',
    port: parsedConfig.port ? parseInt(parsedConfig.port.toString()) : 5432,
    user: parsedConfig.user || 'postgres',
    password: parsedConfig.password || 'postgres',
    database: parsedConfig.database || 'patentiq',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  };
} else {
  // Fallback to individual environment variables for development
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'patentiq',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
}

// Singleton pool instance
let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(poolConfig);
} else {
  // In development, use a global variable so the pool isn't recreated on every hot reload
  if (!(global as any).pgPool) {
    (global as any).pgPool = new Pool(poolConfig);
  }
  pool = (global as any).pgPool;
}

// Catch idle client errors & connection errors so they don't crash the Node.js process
pool.on('error', (err, client) => {
  console.error('[DB Pool] Unexpected error on idle client (ignoring to prevent crash):', err.message);
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool,
};
