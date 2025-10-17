from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime, timezone
from google.cloud.firestore_v1 import Increment

from app.core.firebase import get_db
from app.core.config import settings
from app.schemas.history import HistoryItem, RewriteResponse
from app.schemas.leaderboard import LeaderboardEntry
from app.services.bias import BiasService

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

@dataclass
class FirestoreService:
    def __post_init__(self):
        self.db = get_db()

    def ensure_user_document(self, user: Dict[str, Any]) -> None:
        ref = self.db.collection("users").document(user["uid"])
        if not ref.get().exists:
            ref.set({
                "uid": user["uid"],
                "email": user.get("email"),
                "name": user.get("name"),
                "photo_url": user.get("picture"),
                "points": 0,
                "streak": 0,
                "createdAt": now_iso(),
                "updatedAt": now_iso(),
            }, merge=True)

    def update_points(self, uid: str, delta_points: int) -> int:
        ref = self.db.collection("users").document(uid)
        ref.set({"points": Increment(int(delta_points)), "updatedAt": now_iso()}, merge=True)
        return (ref.get().to_dict() or {}).get("points", 0)

    def get_user_history(self, uid: str, limit: int = 20) -> List[HistoryItem]:
        q = (self.db.collection("histories").document(uid).collection("items")
             .order_by("created_at", direction="DESCENDING").limit(limit))
        return [HistoryItem(id=d.id, **d.to_dict()) for d in q.stream()]

    def get_leaderboard(self, limit: int = 50) -> List[LeaderboardEntry]:
        q = self.db.collection("users").order_by("points", direction="DESCENDING").limit(limit).stream()
        return [LeaderboardEntry(uid=d.id,
                                 name=(d.to_dict() or {}).get("name"),
                                 photo_url=(d.to_dict() or {}).get("photo_url"),
                                 points=(d.to_dict() or {}).get("points", 0))
                for d in q]

    def handle_submission(
        self,
        uid: str,
        display_name: str,
        photo_url: str,
        mode: str,
        original: str,
        rewrite: str,
        scorer: BiasService,
    ) -> RewriteResponse:
        """
        ABSOLUTE ONLY:
          - Get 0..1 from model
          - Scale to 0..100 exactly once
          - Pass when rewrite_score_100 <= ABSOLUTE_THRESHOLD
        """
        original_p = scorer.score01(original)          # 0..1
        rewrite_p  = scorer.score01(rewrite)           # 0..1
        original_score = round(original_p * 100.0, 2)  # 0..100
        rewrite_score  = round(rewrite_p * 100.0, 2)   # 0..100
        delta = round(original_score - rewrite_score, 2)

        threshold = float(settings.BIAS_ABSOLUTE_THRESHOLD)
        passed = rewrite_score <= threshold
        points_awarded = 10 if passed else 0

        # persist history
        hist_ref = self.db.collection("histories").document(uid).collection("items").document()
        item = {
            "mode": mode,
            "bias_type": scorer.type_from_mode(mode),
            "original": original,
            "rewrite": rewrite,
            "original_score": original_score,  # 0..100
            "rewrite_score": rewrite_score,    # 0..100
            "delta": delta,
            "points_awarded": points_awarded,
            "created_at": now_iso(),
            "pass_mode": "absolute",
            "threshold": threshold,
            "passed": passed,
        }
        hist_ref.set(item, merge=True)

        # ensure user + award points
        self.ensure_user_document({"uid": uid, "name": display_name, "picture": photo_url})
        if points_awarded:
            self.update_points(uid, points_awarded)

        return RewriteResponse(
            success=True,
            bias_type=item["bias_type"],
            original_score=original_score,
            rewrite_score=rewrite_score,
            delta=delta,
            threshold=threshold,
            points_awarded=points_awarded,
            history_item=HistoryItem(id=hist_ref.id, **item),
        )
