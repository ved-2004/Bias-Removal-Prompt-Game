"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { apiPost } from "@/lib/api"

type Row = { id: string; points: number; displayName?: string }

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiPost<{ items: Row[] }>("/api/leaderboard", {})
      .then((r) => setRows(r.items || []))
      .catch((e) => setError(e?.message || "Failed to load"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">Leaderboard</h3>
      {loading && <div className="text-sm">Loading…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={r.id} className="flex items-center justify-between">
              <div className="text-sm">{i + 1}. {r.displayName ?? r.id.slice(0,6)}</div>
              <div className="text-sm font-semibold">{r.points}</div>
            </div>
          ))}
          {rows.length === 0 && <div className="text-sm text-muted-foreground">No entries yet.</div>}
        </div>
      )}
    </Card>
  )
}
