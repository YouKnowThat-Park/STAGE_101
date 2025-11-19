from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl

class QrSessionUrl(BaseSettings):
    FRONTEND_BASE_URL: AnyHttpUrl = "http://localhost:3000"

    class Config:
        env_file = ".env"

settings = QrSessionUrl()