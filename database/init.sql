-- PatentIQ AI Database Schema
-- Complete schema initialization for all tables and indexes

-- Enable pgvector extension for similarity search
CREATE EXTENSION IF NOT EXISTS vector;

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

-- Patents table to store the documents and their embeddings
CREATE TABLE IF NOT EXISTS patents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workflow Logs table for tracking export and analysis operations
CREATE TABLE IF NOT EXISTS workflow_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    workflow_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'started',
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- API and LLM call logs for tracking external service calls
CREATE TABLE IF NOT EXISTS api_llm_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_log_id UUID REFERENCES workflow_logs(id) ON DELETE SET NULL,
    service TEXT NOT NULL,
    endpoint TEXT,
    request_params JSONB,
    response_status INT,
    token_usage INT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rate limiting table for throttling requests
CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    count INT NOT NULL DEFAULT 1,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_patent_queries_user_id ON patent_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_patents_embedding ON patents USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_user_id ON workflow_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_created_at ON workflow_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_llm_logs_workflow_log_id ON api_llm_logs(workflow_log_id);
CREATE INDEX IF NOT EXISTS idx_api_llm_logs_service ON api_llm_logs(service);
CREATE INDEX IF NOT EXISTS idx_rate_limits_expires_at ON rate_limits(expires_at);
