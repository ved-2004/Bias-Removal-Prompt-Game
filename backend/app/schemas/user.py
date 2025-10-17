from pydantic import BaseModel
from typing import Optional

class UserPublic(BaseModel):
    uid: str
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None
    points: int = 0
    streak: int = 0
