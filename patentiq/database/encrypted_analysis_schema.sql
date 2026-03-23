-- Migration: Add encrypted analysis storage
-- Run this to store encrypted analysis results in the database

CREATE TABLE IF NOT EXISTS encrypted_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    user_id VARCHAR(256),

    -- Encrypted data (base64 string)
    encrypted_data TEXT NOT NULL,

    -- Metadata for easy lookup
    invention_title VARCHAR(500),
    analysis_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- For audit trail
    encryption_key_version INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX idx_encrypted_analysis_project ON encrypted_analysis(project_id);
CREATE INDEX idx_encrypted_analysis_timestamp ON encrypted_analysis(analysis_timestamp DESC);

-- Audit log for encryption operations
CREATE TABLE IF NOT EXISTS encryption_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100), -- 'encrypt', 'decrypt', 'key_generated'
    resource_type VARCHAR(100), -- 'analysis_result', 'export_data'
    resource_id UUID,
    user_id VARCHAR(256),
    status VARCHAR(50), -- 'success', 'failed'
    details JSONB,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_timestamp ON encryption_audit_log(event_timestamp DESC);
CREATE INDEX idx_audit_log_resource ON encryption_audit_log(resource_id);
