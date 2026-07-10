"""
Application configuration, loaded from environment variables (and a
local .env file during development). Centralizing this here means no
other module ever reads os.environ directly.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed, validated application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # --- Application ---------------------------------------------------
    APP_NAME: str = "Career OS AI Service"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # --- Server ----------------------------------------------------------
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # --- CORS ------------------------------------------------------------
    # Comma-separated list of origins allowed to call this service
    # (e.g. the Node backend and/or the frontend dev server).
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:5000"

    # --- Gemini AI ---------------------------------------------------------
    # Required for Milestone 2 (Resume Analysis). Left unset in other
    # environments (e.g. Phase 1 tests) simply disables that feature with
    # a clean 503, rather than crashing the whole service on startup.
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-2.5-flash"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — env vars are only read once per process."""
    return Settings()


settings = get_settings()
