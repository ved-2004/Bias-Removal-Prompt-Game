import { auth } from "@/lib/firebase"

const RAW_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  ""

if (!RAW_BASE) {
  // Fail early so you immediately see the root cause
  throw new Error(
    "Missing NEXT_PUBLIC_API_BASE (or NEXT_PUBLIC_API_BASE_URL). " +
      "Create frontend/.env.local with NEXT_PUBLIC_API_BASE=http://127.0.0.1:8080"
  )
}

const API_BASE = RAW_BASE.replace(/\/+$/, "")

function join(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE}${p}`
}

async function withAuth(init?: RequestInit): Promise<RequestInit> {
  const user = auth.currentUser
  const token = user ? await user.getIdToken(false) : null
  return {
    ...(init || {}),
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const url = join(path)
  const init = await withAuth({ method: "GET" })
  try {
    const res = await fetch(url, init)
    if (!res.ok) {
      const text = await safeText(res)
      throw new Error(`${res.status} ${res.statusText} — ${text}`)
    }
    return res.json() as Promise<T>
  } catch (err: any) {
    // DOMException from CORS / DNS / refused sockets often prints as {}
    console.error("apiGet network error", { url, base: API_BASE, err })
    throw new Error(
      `Network error calling ${url}. Check: ` +
        `1) backend running, 2) CORS, 3) API base in .env.local`
    )
  }
}

export async function apiPost<T = any>(path: string, body: unknown): Promise<T> {
  const url = join(path)
  const init = await withAuth({ method: "POST", body: JSON.stringify(body ?? {}) })
  try {
    const res = await fetch(url, init)
    if (!res.ok) {
      const text = await safeText(res)
      throw new Error(`${res.status} ${res.statusText} — ${text}`)
    }
    return res.json() as Promise<T>
  } catch (err: any) {
    console.error("apiPost network error", { url, base: API_BASE, err })
    throw new Error(
      `Network error calling ${url}. Check: ` +
        `1) backend running, 2) CORS, 3) API base in .env.local`
    )
  }
}

async function safeText(res: Response) {
  try {
    return await res.text()
  } catch {
    return ""
  }
}

/* ===== Chat helpers ===== */
export type Mode = "gpt4-gender" | "llama3-sexual" | "gemini-age"
type BiasKey = "gender" | "sexual-orientation" | "age"

const BIAS_TO_MODE: Record<BiasKey, Mode> = {
  gender: "gpt4-gender",
  "sexual-orientation": "llama3-sexual",
  age: "gemini-age",
}

export async function fetchSampleSentence(
  modeOrBias: Mode | BiasKey
): Promise<{ sentence: string }> {
  const mode: Mode =
    (["gpt4-gender", "llama3-sexual", "gemini-age"] as Mode[]).includes(
      modeOrBias as Mode
    )
      ? (modeOrBias as Mode)
      : BIAS_TO_MODE[modeOrBias as BiasKey]

  // Try POST first (canonical)
  try {
    return await apiPost<{ sentence: string }>("/api/sampleSentence", { mode })
  } catch {
    // Fallback to GET (if you exposed it)
    return await apiGet<{ sentence: string }>(`/api/sampleSentence?mode=${encodeURIComponent(mode)}`)
  }
}

export type TurnResponse = {
  reply: string
  score: number
  original_score: number
  delta: number
  threshold: number
  passed: boolean
  points_awarded: number
  history_item?: any
}

export async function doTurn(params: {
  mode: Mode
  original: string
  instruction: string
  messages?: Array<{ role: "system" | "user" | "assistant"; content: string }>
}): Promise<TurnResponse> {
  return apiPost<TurnResponse>("/api/turn", {
    messages: [],
    ...params,
  })
}
