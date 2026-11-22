import os
from contextlib import contextmanager

import mysql.connector
from mysql.connector import pooling
from mysql.connector.constants import ClientFlag
from dotenv import load_dotenv
load_dotenv(override=True)
_pool = None


def get_pool():
    global _pool

    if _pool is None:
        _pool = pooling.MySQLConnectionPool(
            pool_name="homefit_pool",
            pool_size=10,
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", "3306")),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "homefit_db"),
            autocommit=False,
            # Report MATCHED rows (like the Node mysql2 driver did) so an UPDATE that
            # changes nothing is not mistaken for "row not found".
            client_flags=[ClientFlag.FOUND_ROWS],
        )

    return _pool


@contextmanager
def connection():
    conn = get_pool().get_connection()

    try:
        yield conn
    finally:
        conn.close()


@contextmanager
def cursor(dictionary=True):
    with connection() as conn:
        cur = conn.cursor(dictionary=dictionary)

        try:
            yield conn, cur
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            cur.close()


def ensure_schema():
    """Idempotent, backward-compatible migration: add workout_logs.duration_sec.

    Existing rows/columns are untouched; the new column is NULL for old rows.
    """
    with connection() as conn:
        cur = conn.cursor()
        try:
            cur.execute(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS "
                "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'workout_logs' "
                "AND COLUMN_NAME = 'duration_sec'"
            )
            if cur.fetchone()[0] == 0:
                cur.execute("ALTER TABLE workout_logs ADD COLUMN duration_sec INT NULL AFTER duration_min")
            conn.commit()
        finally:
            cur.close()
