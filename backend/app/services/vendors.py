import os
from typing import List, Dict
from app.schemas.chat import ChatMessage

def bias_from_mode(mode: str) -> str:
    if mode.startswith("gpt4"):
        return "Gender"
    if "llama3" in mode:
        return "Sexual Orientation"
    return "Age"

SAMPLE_PROMPT = """You generate a short, kid-safe example sentence (1–2 lines) that clearly exhibits {bias} bias.
Constraints:
- Audience: K–12. Avoid profanity, slurs, or explicit content.
- Keep vocabulary simple and age-appropriate (grade 4–7).
- Make the bias detectable for teaching, but not hateful or offensive.
- Output only the sentence, no quotes, no prefixes, no explanations."""

CONSTRAINED_PROMPT = """You are a careful, kid-friendly editor.
Task: Apply the user's instruction to the ORIGINAL sentence with the minimum necessary edits.
Rules:
- Preserve the original factual meaning and intent.
- Keep named entities, roles, and specifics intact unless the instruction requires changing them.
- Keep style and length similar (±15% words).
- Avoid adding new claims, facts, or extra details not in the original.
- Do not generalize away or rewrite from scratch.
- Output only the revised sentence, no quotes, no extra text.

ORIGINAL:
{original}

INSTRUCTION:
{instruction}
"""

SYSTEM_SAFETY = (
    "Safety: Keep content appropriate for K–12. Avoid slurs, profanity, and explicit content."
)

class ChatService:
    """
    All modes routed through OpenRouter → Claude 3.5 Sonnet (no fallbacks).
    Env required:
      - OPENROUTER_API_KEY
    Optional:
      - OPENROUTER_SITE_URL
      - OPENROUTER_APP_NAME
    """
    def __init__(self):
        self.openrouter_key = os.getenv("OPENROUTER_API_KEY", "")
        if not self.openrouter_key:
            raise RuntimeError("OPENROUTER_API_KEY is required (no fallbacks).")
        self._or_site = os.getenv("OPENROUTER_SITE_URL", "")
        self._or_app = os.getenv("OPENROUTER_APP_NAME", "AI Bias Trainer")

    # ---------- Public API ----------

    def generate(self, mode: str, messages: List[ChatMessage]) -> str:
        msgs = [{"role": m.role, "content": m.content} for m in messages]
        msgs.insert(0, {
            "role": "system",
            "content": f"{SYSTEM_SAFETY} You help kids rewrite biased sentences with minimal edits."
        })
        return self._openrouter_chat(msgs, temperature=0.3)

    def generate_sample(self, mode: str) -> str:
        bias = bias_from_mode(mode)
        system = f"{SYSTEM_SAFETY}\n\n" + SAMPLE_PROMPT.format(bias=bias)
        messages = [
            {"role": "system", "content": system},
            {"role": "user", "content": "Generate exactly one example sentence now."},
        ]
        out = self._openrouter_chat(messages, temperature=0.3)
        self._assert_valid_singleline(out, label="sampleSentence")
        return out

    def generate_constrained(self, mode: str, original: str, instruction: str, messages: List[ChatMessage]) -> str:
        system = f"{SYSTEM_SAFETY}\n\n" + CONSTRAINED_PROMPT.format(
            original=original.strip(),
            instruction=instruction.strip()
        )
        base_msgs = [{"role": "system", "content": system}]
        for m in messages:
            base_msgs.append({"role": m.role, "content": m.content})
        base_msgs.append({"role": "user", "content": "Return only the revised sentence."})
        out = self._openrouter_chat(base_msgs, temperature=0.2)
        self._assert_valid_singleline(out, label="chatConstrained")
        return out

    # ---------- OpenRouter provider ----------

    def _openrouter_chat(self, messages: List[dict], model: str = "anthropic/claude-3.5-sonnet", temperature: float = 0.2) -> str:
        import requests
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openrouter_key}",
            "Content-Type": "application/json",
        }
        if self._or_site:
            headers["HTTP-Referer"] = self._or_site
        if self._or_app:
            headers["X-Title"] = self._or_app

        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": 256,
        }
        r = requests.post(url, headers=headers, json=payload, timeout=60)
        try:
            r.raise_for_status()
        except Exception as e:
            # surface provider errors directly; no fallback
            raise RuntimeError(f"OpenRouter HTTP error: {r.status_code} {r.text[:400]}") from e

        data = r.json()
        try:
            text = (data["choices"][0]["message"]["content"] or "").strip()
        except Exception as e:
            raise RuntimeError(f"OpenRouter response parse error: {data}") from e

        if not text:
            raise RuntimeError("OpenRouter returned empty content.")
        return text

    # ---------- Output validation ----------

    @staticmethod
    def _assert_valid_singleline(text: str, label: str) -> None:
        t = (text or "").strip()
        if len(t) < 4:
            raise ValueError(f"{label}: response too short")
        # Must be a single sentence or single line; avoid multi-paragraph/explanations
        if t.count("\n") > 1:
            raise ValueError(f"{label}: response contains multiple lines")