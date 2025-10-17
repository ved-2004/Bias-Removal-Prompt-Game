from pydantic import BaseModel
from typing import List, Literal, Dict, Any

Mode = Literal["gpt4-gender", "llama3-sexual", "gemini-age"]

class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    mode: Mode
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    reply: str

class SampleRequest(BaseModel):
    mode: Mode

class SampleResponse(BaseModel):
    sentence: str

class ConstrainedChatRequest(BaseModel):
    mode: Mode
    original: str         # sentence generated earlier
    instruction: str      # user’s instruction
    messages: List[ChatMessage] = []  