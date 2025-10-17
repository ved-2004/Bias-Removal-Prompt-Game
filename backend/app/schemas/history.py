from pydantic import BaseModel
from typing import Literal, Optional, List
from .chat import Mode

class AnalyzeRequest(BaseModel):
    mode: Mode
    text: str

class AnalyzeResponse(BaseModel):
    bias_type: Literal["Gender", "Sexual", "Age"]
    score: float  # 0-100
    explanation: str

class RewriteRequest(BaseModel):
    mode: Mode
    original: str
    rewrite: str

class HistoryItem(BaseModel):
    id: str
    mode: Mode
    bias_type: str
    original: str
    rewrite: str
    original_score: float
    rewrite_score: float
    delta: float
    points_awarded: int
    created_at: str

class RewriteResponse(BaseModel):
    success: bool
    bias_type: str
    original_score: float
    rewrite_score: float
    delta: float
    threshold: float
    points_awarded: int
    history_item: HistoryItem
