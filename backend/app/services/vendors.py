import os
from typing import List
from app.schemas.chat import ChatMessage

# ---- Bias type mapping
def bias_from_mode(mode: str) -> str:
    if mode.startswith("gpt4"):
        return "Gender"
    if "llama3" in mode:
        return "Sexual"
    return "Age"

# ---- System prompts

SAMPLE_PROMPT = """You generate a short, kid-safe example sentence (1–2 lines) that clearly exhibits {bias} bias.
Constraints:
- Audience: K–12. Avoid profanity, slurs, or explicit content.
- Keep vocabulary simple and age-appropriate (grade 4–7).
- Make the bias detectable for teaching, but not hateful or offensive.
- Output only the sentence, no quotes, no prefixes, no explanations."""

CONSTRAINED_PROMPT = """You are a careful, kid-friendly editor.
Task: Apply the user's instruction to the ORIGINAL sentence with the **minimum** necessary edits.
Rules:
- Preserve the original factual meaning and intent.
- Keep named entities, roles, and specifics intact unless the instruction requires changing them.
- Keep style and length similar (±15% words).
- Avoid adding new claims, facts, or extra details not in the original.
- Do not generalize away or rewrite from scratch.
- Output **only** the revised sentence, no quotes, no extra text.

ORIGINAL:
{original}

INSTRUCTION:
{instruction}
"""

SYSTEM_SAFETY = (
    "Safety: Keep content appropriate for K–12. Avoid slurs, profanity, and explicit content."
)

class ChatService:
    """Vendor-agnostic generator with OpenAI (GPT-4), OpenRouter (Claude Sonnet), and Gemini."""
    def __init__(self):
        self.openai_key = os.getenv("OPENAI_API_KEY", "")
        self.google_key = os.getenv("GOOGLE_API_KEY", "")
        self.openrouter_key = os.getenv("OPENROUTER_API_KEY", "")
        self._or_site = os.getenv("OPENROUTER_SITE_URL", "")
        self._or_app  = os.getenv("OPENROUTER_APP_NAME", "AI Bias Trainer")

    # ---------- Public API used by routes ----------

    def generate_sample(self, mode: str) -> str:
        bias = bias_from_mode(mode)
        system = f"{SYSTEM_SAFETY}\n\n" + SAMPLE_PROMPT.format(bias=bias)
        messages = [{"role": "system", "content": system}, {"role": "user", "content": "Please provide one example."}]
        if mode.startswith("gpt4"):
            return self._openai_chat(messages)
        if "llama3" in mode:
            return self._openrouter_chat(messages, model="anthropic/claude-3.5-sonnet")
        return self._gemini_prompt(system, "Please provide one example.")

    def generate_constrained(self, mode: str, original: str, instruction: str, messages: List[ChatMessage]) -> str:
        system = f"{SYSTEM_SAFETY}\n\n" + CONSTRAINED_PROMPT.format(original=original.strip(), instruction=instruction.strip())
        base_msgs = [{"role": "system", "content": system}]
        # Optional prior chat context (kept minimal)
        for m in messages:
            base_msgs.append({"role": m.role, "content": m.content})
        # Final nudge to enforce output format
        base_msgs.append({"role": "user", "content": "Return only the revised sentence."})

        if mode.startswith("gpt4"):
            return self._openai_chat(base_msgs)
        if "llama3" in mode:
            return self._openrouter_chat(base_msgs, model="anthropic/claude-3.5-sonnet")
        return self._gemini_prompt(system, "Return only the revised sentence.")

    # ---------- Providers ----------

    def _openai_chat(self, messages: List[dict]) -> str:
        if not self.openai_key:
            return self._mock_reply(messages)
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.openai_key)
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.3,
                max_tokens=256,
            )
            return (resp.choices[0].message.content or "").strip() or self._mock_reply(messages)
        except Exception:
            return self._mock_reply(messages)

    def _openrouter_chat(self, messages: List[dict], model: str) -> str:
        if not self.openrouter_key:
            return self._mock_reply(messages)
        try:
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
                "temperature": 0.2,      # slightly tighter for constrained editing
                "max_tokens": 256,
            }
            r = requests.post(url, headers=headers, json=payload, timeout=60)
            r.raise_for_status()
            data = r.json()
            return (data["choices"][0]["message"]["content"] or "").strip() or self._mock_reply(messages)
        except Exception:
            return self._mock_reply(messages)

    def _gemini_prompt(self, system: str, user: str) -> str:
        if not self.google_key:
            return self._mock_reply([{"role": "user", "content": user}])
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.google_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"{system}\n\nUSER:\n{user}"
            resp = model.generate_content(prompt)
            text = getattr(resp, "text", "") or ""
            return text.strip() or self._mock_reply([{"role": "user", "content": user}])
        except Exception:
            return self._mock_reply([{"role": "user", "content": user}])

    def _mock_reply(self, messages: List[dict]) -> str:
        # Fallback ensures demo continuity
        # Try to echo last user content with a minimal, safe edit
        last = ""
        for m in reversed(messages):
            if m.get("role") == "user":
                last = m.get("content", "")
                break
        if last:
            return last.replace(" are ", " can be ").replace(" is ", " may be ")
        return "Let's keep it fair for everyone."
