import postgres from 'postgres';

// Grab the connection string we just added to .env.local
const connectionString = process.env.DATABASE_URL!;

// Create a reusable connection to the database
export const sql = postgres(connectionString);