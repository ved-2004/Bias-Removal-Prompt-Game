from pydantic import BaseModel
from typing import List, Literal

Mode = Literal["gpt4-gender", "llama3-sexual", "gemini-age"]

class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class SampleRequest(BaseModel):
    mode: Mode

class SampleResponse(BaseModel):
    sentence: str

# NEW: one-turn API
class TurnRequest(BaseModel):
    mode: Mode
    original: str
    instruction: str
    messages: List[ChatMessage] = []

class TurnResponse(BaseModel):
    reply: str
    score: float
    original_score: float
    delta: float
    threshold: float
    passed: bool
    points_awarded: int
    history_item: dict
