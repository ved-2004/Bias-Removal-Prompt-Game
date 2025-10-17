from fastapi import APIRouter, Depends
from .auth import require_user 
from google.cloud import firestore

db = firestore.Client()
router = APIRouter(prefix="/api", tags=["leaderboard"])

@router.get("/leaderboard")
def get_leaderboard():
    # Example schema: collection "scores", docs: {uid, points, displayName, updatedAt}
    q = db.collection("scores").order_by("points", direction=firestore.Query.DESCENDING).limit(50)
    res = [doc.to_dict() | {"id": doc.id} for doc in q.stream()]
    return {"items": res}

@router.get("/history")
def get_history(uid: str = Depends(require_user)):
    # Example schema: "history/{uid}/turns": docs saved on each /api/turn
    q = db.collection("history").document(uid).collection("turns").order_by("created_at", direction=firestore.Query.DESCENDING).limit(50)
    res = [doc.to_dict() | {"id": doc.id} for doc in q.stream()]
    return {"items": res}
