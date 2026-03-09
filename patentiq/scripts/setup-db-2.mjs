import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

// Load variables from .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            process.env[match[1]] = match[2].trim();
        }
    });
}

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'patentiq',
});

async function main() {
    const client = await pool.connect();
    try {
        console.log('Connected to DB. Creating tables...');

        await client.query(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        key VARCHAR(255) PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 1,
        expires_at TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS workflow_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255),
        workflow_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        start_time TIMESTAMP NOT NULL DEFAULT NOW(),
        end_time TIMESTAMP,
        error_message TEXT
      );

      CREATE TABLE IF NOT EXISTS api_llm_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        workflow_log_id UUID REFERENCES workflow_logs(id) ON DELETE SET NULL,
        service VARCHAR(50) NOT NULL,
        endpoint VARCHAR(255),
        request_params JSONB,
        response_status INTEGER,
        token_usage INTEGER,
        error_message TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_rate_limits_expires_at ON rate_limits(expires_at);
      CREATE INDEX IF NOT EXISTS idx_workflow_logs_user_id ON workflow_logs(user_id);
    `);

        console.log('Tables created successfully!');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        client.release();
        pool.end();
    }
}

main();
