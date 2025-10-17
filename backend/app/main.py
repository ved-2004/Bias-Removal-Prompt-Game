from fastapi import FastAPI, Depends, HTTPException
from app.deps.auth import get_current_user
from app.services.bias import BiasService
from app.services.vendors import ChatService
from app.services.firestore import FirestoreService
from app.schemas.chat import SampleRequest, SampleResponse, TurnRequest, TurnResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes.leaderboard import router as leaderboard_router
from app.routes.me import router as me_router
from app.core.config import settings

app = FastAPI(title="AI Bias Trainer Backend", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOW_ORIGINS,
    allow_origin_regex=settings.CORS_ALLOW_ORIGINS_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],    
    allow_headers=["Authorization", "Content-Type", "Accept"],
    expose_headers=["*"],
)

bias_service = BiasService()
chat_service = ChatService() 
db = FirestoreService()

@app.post("/api/sampleSentence", response_model=SampleResponse)
def sample_sentence(req: SampleRequest, user=Depends(get_current_user)):
    sentence = chat_service.generate_sample(req.mode)
    return SampleResponse(sentence=sentence)

@app.post("/api/turn", response_model=TurnResponse)
def turn(req: TurnRequest, user=Depends(get_current_user)):
    rewrite = chat_service.generate_constrained(req.mode, req.original, req.instruction, req.messages)
    result = db.handle_submission(
        uid=user["uid"],
        display_name=user.get("name"),
        photo_url=user.get("picture"),
        mode=req.mode,
        original=req.original,
        rewrite=rewrite,
        scorer=bias_service,
    )
    passed = result.points_awarded > 0  # single source of truth
    return TurnResponse(
        reply=rewrite,
        score=result.rewrite_score,             # 0..100
        original_score=result.original_score,   # 0..100
        delta=result.delta,
        threshold=result.threshold,
        passed=passed,
        points_awarded=result.points_awarded,
        history_item=result.history_item.model_dump(),
    )

app.include_router(leaderboard_router)
app.include_router(me_router)