CREATE DATABASE patents;

\c patents

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS patents (
    id SERIAL PRIMARY KEY,
    title TEXT,
    abstract TEXT,
    claims TEXT,
    cpc TEXT,
    filing_date DATE,
    normalized_text TEXT,
    embedding VECTOR(1536)
);

CREATE INDEX IF NOT EXISTS idx_patent_emb
ON patents USING ivfflat (embedding vector_cosine_ops);
