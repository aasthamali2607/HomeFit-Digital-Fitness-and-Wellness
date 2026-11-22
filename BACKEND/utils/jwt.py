import os
from datetime import datetime, timedelta, timezone
import jwt


def _secret():
    secret = os.getenv("JWT_SECRET")
    if not secret:
        raise RuntimeError("JWT_SECRET is not set")
    return secret


def _expiry():
    value = os.getenv("JWT_EXPIRES_IN", "7d")
    if value.endswith("d"):
        return timedelta(days=int(value[:-1]))
    if value.endswith("h"):
        return timedelta(hours=int(value[:-1]))
    return timedelta(days=7)


def sign_token(payload):
    now = datetime.now(timezone.utc)
    data = dict(payload)
    data.update({"iat": now, "exp": now + _expiry()})
    return jwt.encode(data, _secret(), algorithm="HS256")


def verify_token(token):
    return jwt.decode(token, _secret(), algorithms=["HS256"])
