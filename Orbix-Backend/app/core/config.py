from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Orbix API"
    app_version: str = "0.1.0"
    app_env: str = "development"
    app_debug: bool = True

    request_timeout_seconds: float = 10.0

    solar_system_api_base_url: str = Field(...)
    solar_system_api_token: str = Field(...)

    jpl_horizons_api_base_url: str = Field(...)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
