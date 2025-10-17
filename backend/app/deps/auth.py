from fastapi import Header, HTTPException, status
from typing import Optional, Dict, Any
from app.core.firebase import get_auth

def get_current_user(authorization: Optional[str] = Header(default=None)) -> Dict[str, Any]:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1].strip()
    try:
        decoded = get_auth().verify_id_token(token, check_revoked=True)
        return {
            "uid": decoded["uid"],
            "email": decoded.get("email"),
            "name": decoded.get("name") or decoded.get("firebase", {}).get("sign_in_provider"),
            "picture": decoded.get("picture"),
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}")
