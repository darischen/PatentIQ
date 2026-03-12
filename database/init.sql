-- Initial Schema for PatentIQ AI

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Patent Queries table
CREATE TABLE IF NOT EXISTS patent_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    analysis_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Draft Suggestions table
CREATE TABLE IF NOT EXISTS draft_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID REFERENCES patent_queries(id) ON DELETE CASCADE,
    suggestion_text TEXT NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_patent_queries_user_id ON patent_queries(user_id);

-- 1. Enable pgvector extension for similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Patents table to store the documents and their embeddings
CREATE TABLE IF NOT EXISTS patents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create an index for faster vector searches
CREATE INDEX IF NOT EXISTS idx_patents_embedding ON patents USING hnsw (embedding vector_cosine_ops);
