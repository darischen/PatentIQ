<<<<<<< HEAD
import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'patentiq',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

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
=======
import postgres from 'postgres';

// Grab the connection string we just added to .env.local
const connectionString = process.env.DATABASE_URL!;

// Create a reusable connection to the database
export const sql = postgres(connectionString);
>>>>>>> ranking_generation_recommendation
