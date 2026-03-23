import base64
import hashlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

from cryptography.fernet import Fernet

AUDIT_LOG_PATH = Path("security_audit.log")


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def log_encryption_event(event: str, details: Optional[Dict[str, Any]] = None) -> None:
    payload = {
        "timestamp_utc": _utc_now_iso(),
        "event": event,
        "details": details or {},
    }
    AUDIT_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with AUDIT_LOG_PATH.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload) + "\n")


def _ensure_key_material(key_material: Optional[str]) -> bytes:
    if key_material:
        return key_material.encode("utf-8")

    env_key = os.getenv("DATA_ENCRYPTION_KEY", "")
    if env_key:
        return env_key.encode("utf-8")

    key_file = Path(".keys/data_encryption.key")
    if key_file.exists():
        return key_file.read_bytes().strip()

    key_file.parent.mkdir(parents=True, exist_ok=True)
    generated = Fernet.generate_key()
    key_file.write_bytes(generated)
    log_encryption_event("key_generated", {"key_file": str(key_file)})
    return generated


def get_fernet(key_material: Optional[str] = None) -> Fernet:
    key = _ensure_key_material(key_material)
    return Fernet(key)


def encrypt_json_payload(payload: Dict[str, Any], key_material: Optional[str] = None) -> bytes:
    fernet = get_fernet(key_material)
    raw = json.dumps(payload, ensure_ascii=True).encode("utf-8")
    encrypted = fernet.encrypt(raw)
    log_encryption_event("data_encrypted", {"size_bytes": len(raw)})
    return encrypted


def decrypt_json_payload(encrypted_payload: bytes, key_material: Optional[str] = None) -> Dict[str, Any]:
    fernet = get_fernet(key_material)
    raw = fernet.decrypt(encrypted_payload)
    return json.loads(raw.decode("utf-8"))


def write_encrypted_json(path: Path, payload: Dict[str, Any], key_material: Optional[str] = None) -> Path:
    encrypted = encrypt_json_payload(payload, key_material)

    output_path = path
    if output_path.suffix != ".enc":
        output_path = output_path.with_suffix(output_path.suffix + ".enc")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(encrypted)
    log_encryption_event("encrypted_file_written", {"path": str(output_path)})
    return output_path


def write_encrypted_cache(cache_key: str, payload: Dict[str, Any], key_material: Optional[str] = None) -> Path:
    digest = hashlib.sha256(cache_key.encode("utf-8")).hexdigest()
    cache_path = Path(".secure_cache") / f"{digest}.enc"
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    cache_path.write_bytes(encrypt_json_payload(payload, key_material))
    log_encryption_event("encrypted_cache_written", {"cache_path": str(cache_path)})
    return cache_path


def read_encrypted_cache(cache_key: str, key_material: Optional[str] = None) -> Optional[Dict[str, Any]]:
    digest = hashlib.sha256(cache_key.encode("utf-8")).hexdigest()
    cache_path = Path(".secure_cache") / f"{digest}.enc"
    if not cache_path.exists():
        return None

    payload = decrypt_json_payload(cache_path.read_bytes(), key_material)
    log_encryption_event("encrypted_cache_read", {"cache_path": str(cache_path)})
    return payload


def validate_transport_security(
    openai_base_url: str,
    uspto_base_url: str,
    db_sslmode: str,
    min_tls: str = "TLS1.2",
) -> Dict[str, Any]:
    issues = []

    if not openai_base_url.lower().startswith("https://"):
        issues.append("OpenAI base URL must use HTTPS.")

    if not uspto_base_url.lower().startswith("https://"):
        issues.append("USPTO base URL must use HTTPS.")

    allowed_sslmodes = {"require", "verify-ca", "verify-full"}
    if db_sslmode not in allowed_sslmodes:
        issues.append(f"DB sslmode should be one of {sorted(allowed_sslmodes)}.")

    if min_tls not in {"TLS1.2", "TLS1.3"}:
        issues.append("Minimum TLS should be TLS1.2 or TLS1.3.")

    status = "pass" if not issues else "fail"
    result = {
        "status": status,
        "issues": issues,
        "openai_base_url": openai_base_url,
        "uspto_base_url": uspto_base_url,
        "db_sslmode": db_sslmode,
        "min_tls": min_tls,
    }

    log_encryption_event("transport_encryption_check", result)
    return result
