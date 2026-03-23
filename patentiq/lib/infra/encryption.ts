import { spawn } from 'child_process';
import { join } from 'path';

/**
 * Encryption operations using Python security module
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

/**
 * Execute Python encryption operation and return result
 */
async function executeEncryptionOp(operation: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = join(process.cwd(), 'scripts', 'encrypt_operations.py');
    const python = spawn('python', [scriptPath]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error('[Encryption] Python error:', errorOutput);
        reject(new Error(errorOutput || `Python exited with code ${code}`));
        return;
      }

      try {
        resolve(JSON.parse(output));
      } catch (e) {
        console.error('[Encryption] JSON parse error:', output);
        reject(e);
      }
    });

    // Send input via stdin
    python.stdin.write(JSON.stringify({ operation, ...data }));
    python.stdin.end();
  });
}

/**
 * Encrypt any JSON-serializable data
 * @param payload Data to encrypt
 * @param keyMaterial Optional encryption key (uses env var or file if not provided)
 * @returns Base64-encoded encrypted data
 */
export async function encryptData(payload: any, keyMaterial?: string): Promise<EncryptResult> {
  try {
    const result = await executeEncryptionOp('encrypt', {
      payload,
      key_material: keyMaterial,
    });

    if (!result.success) {
      console.error('[Encryption] Encrypt failed:', result.error);
      return { success: false, error: result.error };
    }

    console.log('[Encryption] Data encrypted successfully');
    return { success: true, encrypted: result.encrypted };
  } catch (error) {
    console.error('[Encryption] Encrypt error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Decrypt previously encrypted data
 * @param encrypted Base64-encoded encrypted data
 * @param keyMaterial Optional encryption key (uses env var or file if not provided)
 * @returns Decrypted payload
 */
export async function decryptData(encrypted: string, keyMaterial?: string): Promise<DecryptResult> {
  try {
    const result = await executeEncryptionOp('decrypt', {
      encrypted,
      key_material: keyMaterial,
    });

    if (!result.success) {
      console.error('[Encryption] Decrypt failed:', result.error);
      return { success: false, error: result.error };
    }

    console.log('[Encryption] Data decrypted successfully');
    return { success: true, payload: result.payload };
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
    const result = await executeEncryptionOp('validate_transport', {
      openai_base_url: openaiBaseUrl,
      uspto_base_url: ustpoBaseUrl,
      db_sslmode: dbSslmode,
      min_tls: minTls,
    });

    if (!result.success) {
      console.error('[Encryption] Validation failed:', result.error);
      return { success: false, error: result.error };
    }

    console.log('[Encryption] Transport validation complete');
    return {
      success: result.success,
      validation: result.validation,
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
