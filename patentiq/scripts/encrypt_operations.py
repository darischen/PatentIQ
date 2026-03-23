#!/usr/bin/env python3
"""
Encryption operations wrapper for Node.js
Handles encrypt/decrypt operations via stdin/stdout with JSON
"""

import sys
import json
import base64
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from security import encrypt_json_payload, decrypt_json_payload, write_encrypted_cache, read_encrypted_cache, validate_transport_security


def main():
    try:
        # Read JSON input from stdin
        input_data = json.load(sys.stdin)

        operation = input_data.get('operation')

        if operation == 'encrypt':
            # Encrypt a JSON payload
            payload = input_data.get('payload', {})
            key_material = input_data.get('key_material')

            encrypted_bytes = encrypt_json_payload(payload, key_material)
            # Convert bytes to base64 for JSON transmission
            encrypted_b64 = base64.b64encode(encrypted_bytes).decode('utf-8')

            print(json.dumps({
                'success': True,
                'encrypted': encrypted_b64,
                'operation': 'encrypt'
            }))

        elif operation == 'decrypt':
            # Decrypt a payload
            encrypted_b64 = input_data.get('encrypted', '')
            key_material = input_data.get('key_material')

            encrypted_bytes = base64.b64decode(encrypted_b64)
            decrypted = decrypt_json_payload(encrypted_bytes, key_material)

            print(json.dumps({
                'success': True,
                'payload': decrypted,
                'operation': 'decrypt'
            }))

        elif operation == 'validate_transport':
            # Validate transport security
            openai_url = input_data.get('openai_base_url', 'https://api.openai.com')
            uspto_url = input_data.get('uspto_base_url', 'https://developer.uspto.gov')
            db_sslmode = input_data.get('db_sslmode', 'require')
            min_tls = input_data.get('min_tls', 'TLS1.2')

            result = validate_transport_security(openai_url, uspto_url, db_sslmode, min_tls)

            print(json.dumps({
                'success': result['status'] == 'pass',
                'validation': result,
                'operation': 'validate_transport'
            }))

        else:
            print(json.dumps({
                'success': False,
                'error': f'Unknown operation: {operation}'
            }))
            sys.exit(1)

    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)


if __name__ == '__main__':
    main()
