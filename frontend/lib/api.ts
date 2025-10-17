// frontend/lib/api.ts
import { auth } from "@/lib/firebase";

// Allow empty base (use relative '/api/*' which the rewrite will proxy)
const RAW_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

// Trim trailing slashes; may be "" (relative)
const API_BASE = RAW_BASE.replace(/\/+$/, "");

function join(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  // If API_BASE is empty, return relative path (e.g., "/api/...")
  return API_BASE ? `${API_BASE}${p}` : p;
}

async function withAuth(init?: RequestInit): Promise<RequestInit> {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken(false) : null;
  return {
    ...(init || {}),
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const url = join(path);
  const init = await withAuth({ method: "GET" });
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      const text = await safeText(res);
      throw new Error(`${res.status} ${res.statusText} — ${text}`);
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error("apiGet network error", { url, base: API_BASE, err });
    throw new Error(
      `Network error calling ${url}. Check: 1) backend running, 2) rewrite, 3) auth header`
    );
  }
}

export async function apiPost<T = unknown>(
  path: string,
  body: unknown
): Promise<T> {
  const url = join(path);
  const init = await withAuth({
    method: "POST",
    body: JSON.stringify(body ?? {}),
  });
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      const text = await safeText(res);
      throw new Error(`${res.status} ${res.statusText} — ${text}`);
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error("apiPost network error", { url, base: API_BASE, err });
    throw new Error(
      `Network error calling ${url}. Check: 1) backend running, 2) rewrite, 3) auth header`
    );
  }
}

/* ===== App-specific helpers (unchanged usage) ===== */

export type Mode = "gpt4-gender" | "llama3-sexual" | "gemini-age";
type BiasKey = "gender" | "sexual-orientation" | "age";

const BIAS_TO_MODE: Record<BiasKey, Mode> = {
  gender: "gpt4-gender",
  "sexual-orientation": "llama3-sexual",
  age: "gemini-age",
};

export async function fetchSampleSentence(
  modeOrBias: Mode | BiasKey
): Promise<{ sentence: string }> {
  const mode: Mode =
    (["gpt4-gender", "llama3-sexual", "gemini-age"] as Mode[]).includes(
      modeOrBias as Mode
    )
      ? (modeOrBias as Mode)
      : BIAS_TO_MODE[modeOrBias as BiasKey];

  // Keep calling "/api/..." — rewrite will handle the proxy
  try {
    return await apiPost<{ sentence: string }>("/api/sampleSentence", { mode });
  } catch {
    return await apiGet<{ sentence: string }>(
      `/api/sampleSentence?mode=${encodeURIComponent(mode)}`
    );
  }
}

export type TurnResponse = {
  reply: string;
  score: number;
  original_score: number;
  delta: number;
  threshold: number;
  passed: boolean;
  points_awarded: number;
  history_item?: any;
};

export async function doTurn(params: {
  mode: Mode;
  original: string;
  instruction: string;
  messages?: Array<{ role: "system" | "user" | "assistant"; content: string }>;
}): Promise<TurnResponse> {
  return apiPost<TurnResponse>("/api/turn", {
    messages: [],
    ...params,
  });
}
