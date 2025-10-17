from transformers import AutoTokenizer, AutoModelForSequenceClassification, TextClassificationPipeline
from typing import Optional

class BiasService:
    """Model returns probability in [0,1]. We'll scale to [0,100] in callers."""
    def __init__(self, model_name: Optional[str] = None):
        from app.core.config import settings
        self._model_name = model_name or settings.BIAS_MODEL_NAME
        self._pipe: Optional[TextClassificationPipeline] = None

    def _ensure(self) -> None:
        if self._pipe is None:
            model = AutoModelForSequenceClassification.from_pretrained(self._model_name)
            tok = AutoTokenizer.from_pretrained(self._model_name)
            self._pipe = TextClassificationPipeline(model=model, tokenizer=tok, return_all_scores=True)

    def score01(self, text: str) -> float:
        """Return probability in [0,1]."""
        self._ensure()
        out = self._pipe(text)[0]  # list of {label, score}
        val = None
        for o in out:
            if "toxic" in o["label"].lower():
                val = float(o["score"]); break
        if val is None:
            val = float(max(out, key=lambda x: x["score"])["score"])
        # clamp + round
        if val < 0: val = 0.0
        if val > 1: val = 1.0
        return round(val, 4)

    def score100(self, text: str) -> float:
        """Return absolute score in [0,100]."""
        return round(self.score01(text) * 100.0, 2)

    # keep helpers
    def type_from_mode(self, mode: str) -> str:
        if mode.startswith("gpt4"): return "Gender"
        if "llama3" in mode: return "Sexual"
        return "Age"

    def explain(self, text: str, score100: float, bias_type: str) -> str:
        sev = "high" if score100 >= 70 else "medium" if score100 >= 40 else "low"
        return f"This shows {sev} {bias_type.lower()} bias risk (score {score100}/100). Use inclusive language."
