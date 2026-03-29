import fernet from 'fernet';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Encryption operations using Fernet symmetric encryption
 * Handles encrypt/decrypt with simple async/await interface
 */

export interface EncryptResult {
  success: boolean;
  encrypted?: string;
  error?: string;
}

export interface DecryptResult {
  success: boolean;
  payload?: any;
  error?: string;
}

export interface TransportValidationResult {
  success: boolean;
  validation?: {
    status: 'pass' | 'fail';
    issues: string[];
    openai_base_url: string;
    uspto_base_url: string;
    db_sslmode: string;
    min_tls: string;
  };
  error?: string;
}

const AUDIT_LOG_PATH = '.security_audit.log';

/**
 * Get or generate encryption key (base64-encoded Fernet key)
 */
function getKeyMaterial(keyMaterial?: string): string {
  if (keyMaterial) {
    return keyMaterial;
  }

  const envKey = process.env.DATA_ENCRYPTION_KEY;
  if (envKey) {
    return envKey;
  }

  const keyDir = path.join(process.cwd(), '.keys');
  const keyFile = path.join(keyDir, 'data_encryption.key');

  if (fs.existsSync(keyFile)) {
    return fs.readFileSync(keyFile, 'utf-8').trim();
  }

  if (!fs.existsSync(keyDir)) {
    fs.mkdirSync(keyDir, { recursive: true });
  }

  // Generate a new Fernet key using crypto for randomness
  // Fernet keys are 32 bytes (256 bits) base64-encoded
  const crypto = require('crypto');
  const generated = crypto.randomBytes(32).toString('base64');
  fs.writeFileSync(keyFile, generated);
  logEncryptionEvent('key_generated', { key_file: keyFile });

  return generated;
}

/**
 * Log encryption events for audit trail
 */
function logEncryptionEvent(event: string, details?: Record<string, any>): void {
  const payload = {
    timestamp_utc: new Date().toISOString(),
    event,
    details: details || {},
  };

  try {
    const dir = path.dirname(AUDIT_LOG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.appendFileSync(AUDIT_LOG_PATH, JSON.stringify(payload) + '\n');
  } catch (e) {
    console.error('[Encryption] Failed to write audit log:', e);
  }
}

/**
 * Encrypt any JSON-serializable data
 * @param payload Data to encrypt
 * @param keyMaterial Optional encryption key (uses env var or file if not provided)
 * @returns Fernet-encoded encrypted data
 */
export async function encryptData(payload: any, keyMaterial?: string): Promise<EncryptResult> {
  try {
    const key = getKeyMaterial(keyMaterial);
    const secret = new fernet.Secret(key);
    const raw = JSON.stringify(payload);

    const token = new fernet.Token({
      secret: secret,
    });
    const encrypted = token.encode(raw);

    logEncryptionEvent('data_encrypted', { size_bytes: raw.length });
    console.log('[Encryption] Data encrypted successfully');

    return { success: true, encrypted };
  } catch (error) {
    console.error('[Encryption] Encrypt error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Decrypt previously encrypted data
 * @param encrypted Fernet-encoded encrypted data
 * @param keyMaterial Optional encryption key (uses env var or file if not provided)
 * @returns Decrypted payload
 */
export async function decryptData(encrypted: string, keyMaterial?: string): Promise<DecryptResult> {
  try {
    const key = getKeyMaterial(keyMaterial);
    const secret = new fernet.Secret(key);

    const token = new fernet.Token({
      secret: secret,
      token: encrypted,
    });
    const raw = token.decode();
    const payload = JSON.parse(raw);

    logEncryptionEvent('data_decrypted', {});
    console.log('[Encryption] Data decrypted successfully');

    return { success: true, payload };
  } catch (error) {
    console.error('[Encryption] Decrypt error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Validate transport security (HTTPS/TLS)
 * @returns Validation result with pass/fail status and issues
 */
export async function validateTransportSecurity(
  openaiBaseUrl: string = 'https://api.openai.com',
  ustpoBaseUrl: string = 'https://developer.uspto.gov',
  dbSslmode: string = 'require',
  minTls: string = 'TLS1.2'
): Promise<TransportValidationResult> {
  try {
    const issues: string[] = [];

    if (!openaiBaseUrl.toLowerCase().startsWith('https://')) {
      issues.push('OpenAI base URL must use HTTPS.');
    }

    if (!ustpoBaseUrl.toLowerCase().startsWith('https://')) {
      issues.push('USPTO base URL must use HTTPS.');
    }

    const allowedSslmodes = new Set(['require', 'verify-ca', 'verify-full']);
    if (!allowedSslmodes.has(dbSslmode)) {
      issues.push(`DB sslmode should be one of ${Array.from(allowedSslmodes).sort().join(', ')}.`);
    }

    const allowedTls = new Set(['TLS1.2', 'TLS1.3']);
    if (!allowedTls.has(minTls)) {
      issues.push('Minimum TLS should be TLS1.2 or TLS1.3.');
    }

    const status = issues.length === 0 ? 'pass' : 'fail';
    const validation = {
      status: status as 'pass' | 'fail',
      issues,
      openai_base_url: openaiBaseUrl,
      uspto_base_url: ustpoBaseUrl,
      db_sslmode: dbSslmode,
      min_tls: minTls,
    };

    logEncryptionEvent('transport_encryption_check', validation);
    console.log('[Encryption] Transport validation complete');

    return {
      success: status === 'pass',
      validation,
    };
  } catch (error) {
    console.error('[Encryption] Validation error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Helper: Check if data is encrypted (base64 check)
 */
export function isEncrypted(data: string): boolean {
  try {
    Buffer.from(data, 'base64').toString('base64') === data;
    return data.length > 0 && /^[A-Za-z0-9+/=]+$/.test(data);
  } catch {
    return false;
  }
}
