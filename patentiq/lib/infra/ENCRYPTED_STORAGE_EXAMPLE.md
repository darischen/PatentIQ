# Encrypted Storage Example

How to store and retrieve encrypted analysis results from the database.

## 1. Store Encrypted Analysis

In `app/api/chat/analyze/route.ts` or any API route:

```typescript
import { db } from '@/lib/database/db';
import { encryptData } from '@/lib/infra/encryption';

// After generating analysisResult
const { success, encrypted } = await encryptData(analysisResult);

if (success) {
  // Store encrypted data in database
  const query = `
    INSERT INTO encrypted_analysis
    (project_id, user_id, encrypted_data, invention_title)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `;

  const result = await db.query(query, [
    projectId,
    userId,
    encrypted,
    analysisResult.topRiskFeature || 'Unknown',
  ]);

  console.log('[Analysis API] Encrypted analysis stored with ID:', result.rows[0].id);

  // Return to client
  return NextResponse.json({
    analysisId: result.rows[0].id,
    analysis: analysisResult,
    _encrypted: true,
  });
}
```

## 2. Retrieve and Decrypt Analysis

Fetch stored encrypted analysis:

```typescript
import { db } from '@/lib/database/db';
import { decryptData } from '@/lib/infra/encryption';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const analysisId = searchParams.get('id');

  if (!analysisId) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  try {
    // 1. Fetch encrypted data from database
    const query = `
      SELECT encrypted_data, analysis_timestamp
      FROM encrypted_analysis
      WHERE id = $1;
    `;

    const result = await db.query(query, [analysisId]);

    if (!result.rows.length) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    const { encrypted_data, analysis_timestamp } = result.rows[0];

    // 2. Decrypt the data
    console.log('[Retrieve API] Decrypting analysis...');
    const { success, payload } = await decryptData(encrypted_data);

    if (!success) {
      console.error('[Retrieve API] Decryption failed');
      return NextResponse.json(
        { error: 'Failed to decrypt analysis' },
        { status: 500 }
      );
    }

    // 3. Return decrypted analysis
    return NextResponse.json({
      id: analysisId,
      analysis: payload,
      retrievedAt: new Date().toISOString(),
      originalTimestamp: analysis_timestamp,
    });
  } catch (error) {
    console.error('[Retrieve API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analysis' },
      { status: 500 }
    );
  }
}
```

## 3. Query Encrypted Analyses

Find encrypted analyses for a project:

```typescript
async function getProjectAnalyses(projectId: string) {
  const query = `
    SELECT
      id,
      invention_title,
      analysis_timestamp,
      created_at
    FROM encrypted_analysis
    WHERE project_id = $1
    ORDER BY analysis_timestamp DESC
    LIMIT 10;
  `;

  const result = await db.query(query, [projectId]);
  return result.rows;
}
```

## 4. Export Encrypted Analysis

In `app/api/export-json/route.ts`:

```typescript
import { encryptData } from '@/lib/infra/encryption';

async function handleExport(record: any, identifier: string) {
  // Encrypt before export
  const { success, encrypted } = await encryptData(record);

  if (success) {
    // Option A: Return encrypted + plaintext (for both storage and download)
    const exportContent = {
      encrypted: encrypted,        // Store this in database
      plaintext: record,           // User downloads this
      exportedAt: new Date(),
    };

    return new NextResponse(JSON.stringify(exportContent, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="analysis-${identifier}.json"`,
        'X-Encrypted': 'true',
      },
    });
  }

  // Fallback: unencrypted
  return new NextResponse(JSON.stringify(record, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="analysis-${identifier}.json"`,
    },
  });
}
```

## 5. Database Structure

```sql
-- Table: encrypted_analysis
┌─────────────────────────────────┐
│ id (UUID)                       │ Primary Key
├─────────────────────────────────┤
│ project_id (UUID)               │ Foreign Key → projects
│ user_id (VARCHAR)               │
│ encrypted_data (TEXT)           │ Base64-encoded encrypted payload
│ invention_title (VARCHAR)       │ For display in UI
│ analysis_timestamp (TIMESTAMP)  │
│ encryption_key_version (INT)    │ For key rotation
│ created_at (TIMESTAMP)          │
│ updated_at (TIMESTAMP)          │
└─────────────────────────────────┘
```

## 6. Audit Trail

Every encryption operation is logged:

```sql
-- Table: encryption_audit_log
INSERT INTO encryption_audit_log
(event_type, resource_type, resource_id, user_id, status, details)
VALUES ('encrypt', 'analysis_result', $1, $2, 'success', $3);

-- Query audit trail
SELECT * FROM encryption_audit_log
WHERE resource_id = $1
ORDER BY event_timestamp DESC;
```

## 7. Complete Flow Example

```
User submits analysis
    ↓
[API] Generate analysisResult
    ↓
[API] encryptData(analysisResult)
    ↓
[DB] INSERT INTO encrypted_analysis (encrypted_data)
    ↓
Return { analysisId, analysis }
    ↓
User requests: GET /api/analysis?id=analysisId
    ↓
[API] SELECT encrypted_data FROM encrypted_analysis
    ↓
[API] decryptData(encrypted_data)
    ↓
Return decrypted analysis
```

## Key Takeaways

✅ **Encryption layer**: All sensitive data encrypted before storage
✅ **Transparent to frontend**: Client gets plaintext, backend stores encrypted
✅ **Audit trail**: Every operation logged for compliance
✅ **Easy retrieval**: Just decrypt when needed
✅ **Backup-safe**: Encrypted backups can't be read without keys

## Running the Migration

```bash
# Add the encryption tables to your database
psql -U postgres -d patentiq -f database/encrypted_analysis_schema.sql
```
