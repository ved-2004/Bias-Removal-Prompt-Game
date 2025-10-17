from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import uvicorn

from app.core.config import settings
from app.deps.auth import get_current_user
from app.schemas.user import UserPublic
from app.schemas.chat import (
    ChatRequest, ChatResponse,
    SampleRequest, SampleResponse,
    ConstrainedChatRequest
)
from app.schemas.history import AnalyzeRequest, RewriteRequest, AnalyzeResponse, RewriteResponse, HistoryItem
from app.schemas.leaderboard import LeaderboardEntry
from app.services.bias import BiasService
from app.services.vendors import ChatService
from app.services.firestore import FirestoreService

app = FastAPI(title="AI Bias Trainer Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bias_service = BiasService()
chat_service = ChatService()
db = FirestoreService()

@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}

@app.get("/api/me", response_model=UserPublic)
def me(user=Depends(get_current_user)):
    db.ensure_user_document(user)
    return user

@app.get("/api/history", response_model=List[HistoryItem])
def history(limit: int = 20, user=Depends(get_current_user)):
    return db.get_user_history(user["uid"], limit=limit)

@app.get("/api/leaderboard", response_model=List[LeaderboardEntry])
def leaderboard(limit: int = 50):
    return db.get_leaderboard(limit=limit)

@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest, user=Depends(get_current_user)):
    try:
        content = chat_service.generate(req.mode, req.messages)
        return ChatResponse(reply=content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyzeBias", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest, user=Depends(get_current_user)):
    score = bias_service.score(req.text)
    bias_type = bias_service.type_from_mode(req.mode)
    explanation = bias_service.explain(req.text, score, bias_type)
    return AnalyzeResponse(bias_type=bias_type, score=score, explanation=explanation)

@app.post("/api/rewriteSentence", response_model=RewriteResponse)
def rewrite(req: RewriteRequest, user=Depends(get_current_user)):
    result = db.handle_submission(
        uid=user["uid"],
        display_name=user.get("name"),
        photo_url=user.get("picture"),
        mode=req.mode,
        original=req.original,
        rewrite=req.rewrite,
        scorer=bias_service,
    )
    return result

@app.post("/api/sampleSentence", response_model=SampleResponse)
def sample_sentence(req: SampleRequest, user=Depends(get_current_user)):
    sentence = chat_service.generate_sample(req.mode)
    return SampleResponse(sentence=sentence)

@app.post("/api/chatConstrained", response_model=ChatResponse)
def chat_constrained(req: ConstrainedChatRequest, user=Depends(get_current_user)):
    reply = chat_service.generate_constrained(
        mode=req.mode,
        original=req.original,
        instruction=req.instruction,
        messages=req.messages,
    )
    return ChatResponse(reply=reply)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=int(settings.PORT), reload=True)
