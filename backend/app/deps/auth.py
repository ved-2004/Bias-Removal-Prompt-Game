from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth

_bearer = HTTPBearer(auto_error=False)

def get_current_user(request: Request, creds: HTTPAuthorizationCredentials = Depends(_bearer)):
    # let CORS preflight pass
    if request.method == "OPTIONS":
        return None
    if not creds or not creds.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    try:
        return firebase_auth.verify_id_token(creds.credentials)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")