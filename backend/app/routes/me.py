from fastapi import APIRouter, Depends
from app.deps.auth import get_current_user
from app.services.firestore import FirestoreService

router = APIRouter(prefix="/api", tags=["me"])
db = FirestoreService()

@router.get("/me/summary")
def me_summary(user = Depends(get_current_user)):
    # shape matches frontend MeSummary
    uref = db.db.collection("users").document(user["uid"]).get()
    data = uref.to_dict() or {}
    return {
        "uid": user["uid"],
        "username": data.get("name") or user.get("name"),
        "points": data.get("points", 0),
        "photoURL": data.get("photo_url") or user.get("picture"),
        # rank can be computed client-side from /api/leaderboard
    }

@router.post("/me/update")
def me_update(payload: dict, user = Depends(get_current_user)):
    # update display name only for now
    name = (payload.get("username") or "").strip()
    ref = db.db.collection("users").document(user["uid"])
    ref.set({"name": name}, merge=True)
    return {"ok": True}
