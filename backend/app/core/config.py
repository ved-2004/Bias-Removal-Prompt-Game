from dotenv import load_dotenv
load_dotenv()

import os
from typing import List

class Settings:
    PORT: int = int(os.getenv("PORT", "8080"))
    ENV: str = os.getenv("ENV", "dev")

    # Firebase
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "")
    FIREBASE_CREDENTIALS_FILE: str = os.getenv("FIREBASE_CREDENTIALS_FILE", "serviceAccount.json")

    # Providers (you’re using OpenRouter/Claude for all)
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_SITE_URL: str = os.getenv("OPENROUTER_SITE_URL", "")
    OPENROUTER_APP_NAME: str = os.getenv("OPENROUTER_APP_NAME", "AI Bias Trainer")

    # -------- ABSOLUTE scoring only (hard enforced) --------
    BIAS_MODEL_NAME: str = os.getenv("BIAS_MODEL_NAME", "unitary/toxic-bert")
    BIAS_ABSOLUTE_THRESHOLD: float = float(os.getenv("BIAS_ABSOLUTE_THRESHOLD", "15.0"))  # 0–100
    BIAS_PASS_MODE: str = "absolute"  # locked

    # CORS
    CORS_ALLOW_ORIGINS: List[str] = os.getenv("CORS_ALLOW_ORIGINS", "*").split(",")
    CORS_ALLOW_ORIGINS_REGEX: List[str] = os.getenv("CORS_ALLOW_ORIGIN_REGEX", None)

settings = Settings()