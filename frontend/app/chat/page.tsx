"use client"
import { useState } from "react"
import { doTurn, type Mode } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const DEFAULT_MODE: Mode = "gpt4-gender"

export default function ChatPage() {
  const [original, setOriginal] = useState("")
  const [instruction, setInstruction] = useState("")
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await doTurn({ mode: DEFAULT_MODE, original, instruction, messages: [] })
      setReply(res.reply)
      // optionally push to history-panel live stream:
      window.dispatchEvent(new CustomEvent("bias-history-add", { detail: res.history_item }))
    } catch (e: any) {
      setError(e?.message || "Request failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-4">
      <Card className="p-4 space-y-3">
        <Textarea placeholder="Original sentence" value={original} onChange={(e)=>setOriginal(e.target.value)} />
        <Textarea placeholder="Instruction to fix bias (e.g., 'use neutral terms')" value={instruction} onChange={(e)=>setInstruction(e.target.value)} />
        <div className="flex items-center gap-3">
          <Button onClick={send} disabled={!original.trim() || !instruction.trim() || loading}>
            {loading ? "Working…" : "Send"}
          </Button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </Card>
      {reply && (
        <Card className="p-4">
          <div className="text-sm whitespace-pre-wrap">{reply}</div>
        </Card>
      )}
    </div>
  )
}
