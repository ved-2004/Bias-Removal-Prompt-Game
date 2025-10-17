"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { fetchSampleSentence, doTurn, type Mode } from "@/lib/api"

type Message = {
  id: string
  role: "ai" | "user"
  content: string
  biasScore?: number
}

type BiasType = "gender" | "sexual-orientation" | "age"

const BIAS_TO_MODE: Record<BiasType, Mode> = {
  "gender": "gpt4-gender",
  "sexual-orientation": "llama3-sexual",
  "age": "gemini-age",
}

export function ChatTrainer() {
  // UI state
  const [selectedBias, setSelectedBias] = useState<BiasType | null>(null) // start with NO selection
  const [messages, setMessages] = useState<Message[]>([])                 // no pre-rendered messages
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // challenge state
  const [currentSentence, setCurrentSentence] = useState<string>("")
  const [latestScore, setLatestScore] = useState<number | null>(null)
  const [finished, setFinished] = useState<{ points: number } | null>(null)

  // right-rail history (client only)
  const [history, setHistory] = useState<Array<{ sentence: string; newScore: number; at: string }>>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  // When user picks a bias type, fetch the first sentence from backend
  async function startSession(bias: BiasType) {
    if (isProcessing) return
    setSelectedBias(bias)
    setMessages([])
    setCurrentSentence("")
    setLatestScore(null)
    setFinished(null)
    setError(null)

    try {
      const q = encodeURIComponent(bias)
      const { sentence } = await fetchSampleSentence(bias)
      setCurrentSentence(sentence)

      // prime the chat with one assistant message containing the sentence
      if (sentence) {
        setMessages([
          {
            id: crypto.randomUUID(),
            role: "ai",
            content:
              `Here's a sentence that might have some bias:\n\n"${sentence}"\n\n` +
              `Pick a minimal change and tell me how to rewrite it to be fairer.`,
          },
        ])
      }
    } catch (e: any) {
      setError(e?.message || "Failed to fetch a sample sentence.")
    }
  }

  const canSubmit = useMemo(
    () => !!selectedBias && !!currentSentence && input.trim().length > 0 && !isProcessing,
    [selectedBias, currentSentence, input, isProcessing]
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !selectedBias) return

    setIsProcessing(true)
    setError(null)

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: input }
    setMessages((prev) => [...prev, userMsg])
    const rewriteInstruction = input
    setInput("")

    try {
      // Backend should evaluate and return new score and an assistant reply.
      // Expected shape (flexible): { reply, score, passed, pointsAwarded, history_item? }
      const res = await doTurn({
        mode: BIAS_TO_MODE[selectedBias],
        original: currentSentence,
        instruction: rewriteInstruction,
        messages: [], 
      })

      const reply: string =
        res?.reply ??
        "Thanks! I evaluated your instruction and applied a fairer rewrite."
      const score: number = typeof res?.score === "number" ? res.score*100 : 0
      const passed: boolean = !!res?.passed
      const points: number = typeof res?.points_awarded === "number" ? res.points_awarded : 0

      // assistant message + score bubble
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        content: reply,
        biasScore: score ?? undefined,
      }
      setMessages((prev) => [...prev, aiMsg])
      if (typeof score === "number") setLatestScore(score)

      // local history (and broadcast if other panels listen)
      if (typeof score === "number") {
        const h = { sentence: currentSentence, newScore: score, at: new Date().toISOString() }
        setHistory((prev) => [h, ...prev.slice(0, 19)])
        window.dispatchEvent(
          new CustomEvent("bias-history-add", {
            detail: {
              original: currentSentence,
              bias_type: toTitle(selectedBias),
              original_score: undefined,
              rewrite_score: score,
              created_at: h.at,
            },
          }),
        )
      }

      if (passed) {
        setFinished({ points })
      }
    } catch (e: any) {
      setError(e?.message || "Request failed.")
    } finally {
      setIsProcessing(false)
    }
  }

  function resetAll() {
    setSelectedBias(null) // back to “choose a bias type”
    setMessages([])
    setCurrentSentence("")
    setLatestScore(null)
    setFinished(null)
    setError(null)
    setInput("")
  }

  return (
    <div className="flex relative overflow-hidden">
      {/* Main Chat Column */}
      <div className="flex-1 flex flex-col min-h-[calc(100vh-80px)]">
        {/* Bias Type Selector — nothing selected by default */}
        <div className="px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">Bias Type:</span>
            <div className="flex gap-2 bg-muted/50 p-1.5 rounded-full">
              {(
                [
                  { value: "gender", label: "Gender" },
                  { value: "sexual-orientation", label: "Sexual Orientation" },
                  { value: "age", label: "Age" },
                ] as const
              ).map((b) => (
                <button
                  key={b.value}
                  onClick={() => startSession(b.value)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-bold transition-all",
                    selectedBias === b.value
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/80",
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-4" id="chat-area">
            {!selectedBias && messages.length === 0 && (
              <Card className="p-6 text-sm text-muted-foreground">
                Choose a bias type above to start a session.
              </Card>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-5 py-4 shadow",
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-card border text-card-foreground",
                  )}
                >
                  <p className="text-sm whitespace-pre-line">{m.content}</p>
                  {typeof m.biasScore === "number" && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-700">New Bias Score</span>
                        <span className="text-sm font-bold text-emerald-700">{m.biasScore}%</span>
                      </div>
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full"
                          style={{ width: `${m.biasScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border bg-surface/80 backdrop-blur-sm px-6 py-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tell the AI how to minimally rewrite the sentence to remove bias…"
                  rows={3}
                  disabled={!selectedBias || isProcessing || !currentSentence}
                />
              </div>
              <Button type="submit" size="lg" disabled={!canSubmit}>
                {isProcessing ? "Working…" : "Send & Rescore"}
              </Button>
            </div>
          </form>
          {error && <div className="max-w-4xl mx-auto mt-2 text-sm text-red-600">{error}</div>}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 border-l border-border bg-background overflow-y-auto p-4 space-y-4">
        <Card className="p-5">
          <h3 className="text-sm font-bold mb-3">Current Challenge</h3>
          {!selectedBias ? (
            <div className="text-sm text-muted-foreground">Pick a bias type to begin.</div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-semibold">Sentence</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {currentSentence || "—"}
                </p>
              </div>
              {typeof latestScore === "number" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700">Bias Score</span>
                    <span className="text-sm font-bold">{latestScore}%</span>
                  </div>
                  <Progress value={latestScore} className="h-2" />
                </div>
              )}
              {selectedBias && (
                <div className="inline-block px-3 py-1.5 rounded-full bg-muted text-xs font-bold">
                  {toTitle(selectedBias)} Bias
                </div>
              )}
            </div>
          )}
        </Card>

        <div>
          <h3 className="text-sm font-bold mb-3 px-1">Past Performance</h3>
          <div className="space-y-2">
            {history.length === 0 ? (
              <Card className="p-4 border-dashed">
                <p className="text-xs text-muted-foreground text-center">
                  No history yet. Start training!
                </p>
              </Card>
            ) : (
              history.map((h, idx) => (
                <Card key={idx} className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-xs text-foreground line-clamp-2 flex-1">{h.sentence}</p>
                    <div className="text-xs font-bold shrink-0 px-2 py-1 rounded-full bg-muted">
                      {h.newScore}%
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(h.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Finished modal */}
      {finished && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-[420px] space-y-3">
            <div className="text-lg font-semibold">Great job!</div>
            <div className="text-sm">
              Challenge completed. You earned <b>{finished.points}</b> points.
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button onClick={resetAll}>Start Again</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function toTitle(b: BiasType) {
  if (b === "sexual-orientation") return "Sexual Orientation"
  if (b === "gender") return "Gender"
  return "Age"
}

export default ChatTrainer
