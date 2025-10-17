from transformers import AutoTokenizer, AutoModelForSequenceClassification, TextClassificationPipeline

class BiasService:
    """Scores bias using a BERT toxicity classifier; higher = more biased."""
    def __init__(self, model_name: str = None):
        from app.core.config import settings
        name = model_name or settings.BIAS_MODEL_NAME
        # Why: load lazily on first use to speed cold start
        self._model_name = name
        self._pipeline = None

    def _ensure(self):
        if self._pipeline is None:
            model = AutoModelForSequenceClassification.from_pretrained(self._model_name)
            tokenizer = AutoTokenizer.from_pretrained(self._model_name)
            self._pipeline = TextClassificationPipeline(model=model, tokenizer=tokenizer, framework="pt", return_all_scores=True)

    def score(self, text: str) -> float:
        """Return 0–100 bias score."""
        self._ensure()
        outputs = self._pipeline(text)[0]
        # Heuristic: take score of the 'toxic' (or highest toxic-like) label
        toxic_labels = [o for o in outputs if o["label"].lower() in ("toxic", "toxic_positive", "LABEL_1".lower())]
        value = max([o["score"] for o in toxic_labels], default=outputs[-1]["score"])
        return round(float(value) * 100.0, 2)

    def type_from_mode(self, mode: str) -> str:
        if mode.startswith("gpt4"):
            return "Gender"
        if "llama3" in mode:
            return "Sexual"
        return "Age"

    def explain(self, text: str, score: float, bias_type: str) -> str:
        # Keep short; frontend is for kids
        severity = "high" if score >= 70 else "medium" if score >= 40 else "low"
        return f"This sentence shows {severity} {bias_type.lower()} bias risk (score {score}/100). Try using neutral, inclusive language."
