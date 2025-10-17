from pydantic import BaseModel
from typing import Optional

class LeaderboardEntry(BaseModel):
    uid: str
    name: Optional[str] = None
    photo_url: Optional[str] = None
    points: int
