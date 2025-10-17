import firebase_admin
from firebase_admin import credentials, auth, firestore
from app.core.config import settings
import os

_initialized = False

def init_firebase():
    global _initialized
    if _initialized:
        return
    # Why: allow both file path and env JSON for CI/cloud
    if os.path.exists(settings.FIREBASE_CREDENTIALS_FILE):
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_FILE)
    else:
        # fallback to GOOGLE_APPLICATION_CREDENTIALS or default app
        cred_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
        cred = credentials.Certificate(cred_json) if cred_json else credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred, {'projectId': settings.FIREBASE_PROJECT_ID or None})
    _initialized = True

def get_auth():
    init_firebase()
    return auth

def get_db():
    init_firebase()
    return firestore.client()
