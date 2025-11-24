from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl

class QrSessionUrl(BaseSettings):
    # pydantic-settings v2 스타일 설정
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    FRONTEND_BASE_URL: AnyHttpUrl = "http://13.221.60.6:3000"


settings = QrSessionUrl()