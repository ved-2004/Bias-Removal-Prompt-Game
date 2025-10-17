from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime, timezone

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
        snap = ref.get()
        if not snap.exists:
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

    def get_user(self, uid: str) -> Dict[str, Any]:
        return self.db.collection("users").document(uid).get().to_dict()

    def update_points(self, uid: str, delta_points: int) -> int:
        ref = self.db.collection("users").document(uid)
        self.db.run_transaction(lambda tx: self._inc_points_tx(tx, ref, delta_points))
        return self.get_user(uid)["points"]

    @staticmethod
    def _inc_points_tx(tx, ref, delta):
        snap = tx.get(ref)
        current = (snap.to_dict() or {}).get("points", 0)
        tx.set(ref, {"points": current + delta, "updatedAt": now_iso()}, merge=True)

    def get_user_history(self, uid: str, limit: int = 20) -> List[HistoryItem]:
        q = (self.db.collection("histories").document(uid).collection("items")
             .order_by("created_at", direction="DESCENDING").limit(limit))
        docs = q.stream()
        items: List[HistoryItem] = []
        for d in docs:
            data = d.to_dict()
            items.append(HistoryItem(id=d.id, **data))
        return items

    def get_leaderboard(self, limit: int = 50) -> List[LeaderboardEntry]:
        q = self.db.collection("users").order_by("points", direction="DESCENDING").limit(limit).stream()
        return [LeaderboardEntry(uid=d.id, name=(d.to_dict() or {}).get("name"),
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
        original_score = scorer.score(original)
        rewrite_score = scorer.score(rewrite)
        delta = round(original_score - rewrite_score, 2)
        threshold = float(settings.BIAS_WIN_THRESHOLD)
        win = delta >= threshold
        points_awarded = 10 if win else 0

        # persist
        user_hist_ref = self.db.collection("histories").document(uid).collection("items").document()
        item = {
            "mode": mode,
            "bias_type": scorer.type_from_mode(mode),
            "original": original,
            "rewrite": rewrite,
            "original_score": original_score,
            "rewrite_score": rewrite_score,
            "delta": delta,
            "points_awarded": points_awarded,
            "created_at": now_iso(),
        }
        user_hist_ref.set(item, merge=True)

        # ensure user exists + add points
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
            history_item=HistoryItem(id=user_hist_ref.id, **item),
        )
