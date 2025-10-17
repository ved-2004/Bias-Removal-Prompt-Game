import os
from functools import lru_cache
from typing import List

class Settings:
    PORT: int = int(os.getenv("PORT", "8080"))
    ENV: str = os.getenv("ENV", "dev")
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "")
    FIREBASE_CREDENTIALS_FILE: str = os.getenv("FIREBASE_CREDENTIALS_FILE", "serviceAccount.json")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    TOGETHER_API_KEY: str = os.getenv("TOGETHER_API_KEY", "")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    HF_CACHE: str = os.getenv("HF_HOME", os.path.expanduser("~/.cache/huggingface"))
    BIAS_MODEL_NAME: str = os.getenv("BIAS_MODEL_NAME", "unitary/toxic-bert")
    BIAS_WIN_THRESHOLD: float = float(os.getenv("BIAS_WIN_THRESHOLD", "15.0"))  # points on 0-100 scale
    CORS_ALLOW_ORIGINS: List[str] = os.getenv("CORS_ALLOW_ORIGINS", "*").split(",")

settings = Settings()
