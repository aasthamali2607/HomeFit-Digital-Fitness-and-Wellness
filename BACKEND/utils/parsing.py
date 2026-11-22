import math
import re
from datetime import date

from utils.api_error import ApiError

_DATE_PREFIX = re.compile(r"^\d{4}-\d{2}-\d{2}")


def parse_date(value, message="A valid date is required"):
    """Return a `datetime.date` from 'YYYY-MM-DD' (an ISO timestamp is accepted too).

    For an ISO timestamp the calendar date *as written by the client* is used
    (first 10 characters); it is never shifted by a server time zone.
    """
    text = str(value if value is not None else "").strip()
    if not _DATE_PREFIX.match(text):
        raise ApiError(400, message)
    try:
        return date.fromisoformat(text[:10])
    except ValueError:
        raise ApiError(400, message)


def parse_number(value, message):
    """Accept ints, floats and numeric strings ('12', '12.6'). Reject bool/NaN/inf/garbage."""
    if isinstance(value, bool) or value is None:
        raise ApiError(400, message)
    try:
        number = float(value)
    except (TypeError, ValueError):
        raise ApiError(400, message)
    if not math.isfinite(number):
        raise ApiError(400, message)
    return number


def round_half_up(number):
    return int(math.floor(number + 0.5))


def parse_bool(value, default=True):
    if value is None:
        return default
    if isinstance(value, str):
        return value.strip().lower() not in ("false", "0", "no", "")
    return bool(value)
