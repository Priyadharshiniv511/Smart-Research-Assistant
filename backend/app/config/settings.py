from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    TAVILY_API_KEY: str = ""
    # Gemini API Key will be passed from the frontend request, but we can have it here dynamically
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
