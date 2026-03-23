# Encryption Module Usage

Simple drop-in encryption using Python's proven `cryptography` library.

## Setup

1. **Install Python dependency:**
   ```bash
   pip install cryptography
   ```

2. **Set encryption key (optional):**
   ```bash
   # Option A: Environment variable (production)
   export DATA_ENCRYPTION_KEY="your-key-here"

   # Option B: Auto-generate and store in .keys/ (development)
   # Just call encrypt for the first time, key auto-generates
   ```

## Usage Examples

### Encrypt Data

```typescript
import { encryptData } from '@/lib/infra/encryption';

// In your API route
const analysisResult = { noveltyScore: 75, features: [...] };

const { success, encrypted } = await encryptData(analysisResult);

if (success) {
  // Store encrypted data in database
  await db.query('INSERT INTO encrypted_analysis VALUES ($1)', [encrypted]);
}
```

### Decrypt Data

```typescript
import { decryptData } from '@/lib/infra/encryption';

// Retrieve from database
const encryptedData = await db.query('SELECT data FROM encrypted_analysis');
const { success, payload } = await decryptData(encryptedData[0].data);

if (success) {
  // Use decrypted data
  const analysisResult = payload;
}
```

### Validate Transport Security

```typescript
import { validateTransportSecurity } from '@/lib/infra/encryption';

// In your startup/middleware
const validation = await validateTransportSecurity();

if (!validation.success) {
  console.warn('[Security] Issues detected:', validation.validation?.issues);
  // In production: throw error or alert
}
```

## What Gets Encrypted

**Suggested:**
- ✅ Analysis results (similar patents, recommendations, overlaps)
- ✅ User queries (invention descriptions)
- ✅ Sensitive findings (risk assessments)

**Optional:**
- Chat history
- User preferences
- Export data

## Key Management

### Development
- Auto-generates key on first use
- Stored in `.keys/data_encryption.key`
- Add to `.gitignore`

### Production
- Set `DATA_ENCRYPTION_KEY` environment variable
- Key should be 44 characters (Fernet format)
- Keep secure in your secrets manager

## Audit Logging

All encryption operations logged to `security_audit.log`:
```json
{
  "timestamp_utc": "2026-03-22T15:30:45.123456+00:00",
  "event": "data_encrypted",
  "details": { "size_bytes": 2048 }
}
```

## Return Values

### encryptData()
```typescript
{
  success: true,
  encrypted: "gAAAAABm..." // base64-encoded
}
```

### decryptData()
```typescript
{
  success: true,
  payload: { /* original data */ }
}
```

### validateTransportSecurity()
```typescript
{
  success: true,
  validation: {
    status: "pass",
    issues: [],
    openai_base_url: "https://...",
    db_sslmode: "require",
    min_tls: "TLS1.2"
  }
}
```

## That's It!

Just call `encryptData()` and `decryptData()` wherever you need encryption. Python handles the rest.
