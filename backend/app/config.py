"""
Application settings loaded from environment variables.
All values can be overridden via a .env file in the backend directory.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyUrl
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ────────────────────────────────────────────────────
    app_name: str = "Academic.kz"
    app_env: str = "development"
    debug: bool = True

    # ── Security ───────────────────────────────────────────────
    secret_key: str = "insecure-dev-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080  # 7 days

    # ── Database ───────────────────────────────────────────────
    database_url: str = (
        "postgresql+asyncpg://postgres:password@localhost:5432/academic_kz"
    )
    sync_database_url: str = (
        "postgresql+psycopg2://postgres:password@localhost:5432/academic_kz"
    )

    # ── CORS ───────────────────────────────────────────────────
    allowed_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # ── Pagination ─────────────────────────────────────────────
    default_page_size: int = 20
    max_page_size: int = 100


settings = Settings()
