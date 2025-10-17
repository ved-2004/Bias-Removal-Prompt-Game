"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiGet } from "@/lib/api"

type Timeframe = "daily" | "weekly" | "alltime"

type LeaderboardRow = {
  id: string
  displayName?: string
  points: number
  rank?: number
  photoURL?: string
}

type MeSummary = {
  uid: string
  username?: string
  points?: number
  rank?: number
  photoURL?: string
}

export default function LeaderboardContent() {
  const [timeframe, setTimeframe] = useState<Timeframe>("alltime")
  const [rows, setRows] = useState<LeaderboardRow[]>([])
  const [me, setMe] = useState<MeSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  // fetch me + leaderboard
  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      setErr(null)
      try {
        const [meRes, lbRes] = await Promise.all([
          apiGet<MeSummary>("/me/summary"),
          apiGet<{ items: LeaderboardRow[] }>(`/leaderboard?timeframe=${timeframe}`),
        ])
        if (cancelled) return
        setMe(meRes ?? null)

        // ensure ranks client-side if API doesn't provide them
        const list = Array.isArray(lbRes?.items) ? lbRes.items : []
        list.sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
        const ranked = list.map((r, i) => ({ ...r, rank: r.rank ?? i + 1 }))
        setRows(ranked)
      } catch (e: any) {
        if (cancelled) return
        setErr(e?.message || "Failed to load leaderboard.")
        setRows([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [timeframe])

  const top3 = useMemo(() => rows.slice(0, 3), [rows])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Leaderboard</h1>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl">
          <TimeBtn label="Daily" active={timeframe === "daily"} onClick={() => setTimeframe("daily")} />
          <TimeBtn label="Weekly" active={timeframe === "weekly"} onClick={() => setTimeframe("weekly")} />
          <TimeBtn label="All-time" active={timeframe === "alltime"} onClick={() => setTimeframe("alltime")} />
        </div>
      </div>

      {/* Your performance */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AvatarCircle name={me?.username} photoURL={me?.photoURL} size={40} />
            <div>
              <div className="text-sm text-muted-foreground">You</div>
              <div className="text-base font-semibold">
                {me?.username ?? "Anonymous"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Stat label="Rank" value={me?.rank != null ? `#${me.rank}` : "—"} />
            <Stat label="Total Points" value={me?.points != null ? me.points.toString() : "—"} />
          </div>
        </div>
      </Card>


      {/* Top 3 highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">#{r.rank}</span>
              <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full">
                {fmtPoints(r.points)}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <AvatarCircle name={r.displayName ?? r.id} photoURL={r.photoURL} size={44} />
              <div className="truncate">
                <div className="text-sm font-semibold truncate">{r.displayName ?? shortId(r.id)}</div>
                <div className="text-xs text-muted-foreground truncate">{shortId(r.id)}</div>
              </div>
            </div>
          </Card>
        ))}
        {top3.length === 0 && (
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">No entries yet.</div>
          </Card>
        )}
      </div>

      {/* Full table */}
      <Card className="p-0 overflow-hidden">
        <div className="min-w-full">
          <div className="grid grid-cols-[64px_1fr_120px] px-4 py-2 bg-muted/40 text-xs font-medium text-muted-foreground">
            <div>Rank</div>
            <div>Player</div>
            <div className="text-right">Points</div>
          </div>

          {loading ? (
            <div className="px-4 py-6 text-sm text-muted-foreground">Loading…</div>
          ) : err ? (
            <div className="px-4 py-6 text-sm text-red-600">{err}</div>
          ) : rows.length === 0 ? (
            <div className="px-4 py-6 text-sm text-muted-foreground">No data.</div>
          ) : (
            <ul className="divide-y">
              {rows.map((r) => {
                const isMe = me && (me.uid === r.id || me.username === r.displayName)
                return (
                  <li key={`${r.id}-${r.rank}`} className={`px-4 py-3 grid grid-cols-[64px_1fr_120px] items-center ${isMe ? "bg-primary/5" : ""}`}>
                    <div className="text-sm font-semibold">#{r.rank}</div>
                    <div className="flex items-center gap-3">
                      <AvatarCircle name={r.displayName ?? r.id} photoURL={r.photoURL} size={28} />
                      <div className="truncate">
                        <div className="text-sm font-medium truncate">
                          {r.displayName ?? shortId(r.id)}
                          {isMe && <span className="ml-2 text-[10px] font-semibold text-primary px-1.5 py-0.5 bg-primary/10 rounded">You</span>}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{shortId(r.id)}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm font-semibold">{fmtPoints(r.points)}</div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </Card>
    </div>
  )
}

function TimeBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Button
      size="sm"
      variant={active ? "default" : "ghost"}
      onClick={onClick}
      className={active ? "shadow" : "text-muted-foreground"}
    >
      {label}
    </Button>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  )
}

function AvatarCircle({ name, photoURL, size = 32 }: { name?: string; photoURL?: string; size?: number }) {
  const initials = (name ?? "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name ?? "avatar"}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    )
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-muted flex items-center justify-center text-[12px] font-bold"
      title={name}
    >
      {initials || "?"}
    </div>
  )
}

function shortId(id?: string) {
  if (!id) return ""
  if (id.length <= 10) return id
  return `${id.slice(0, 6)}…${id.slice(-4)}`
}

function fmtPoints(p?: number) {
  if (typeof p !== "number") return "0"
  return p.toLocaleString()
}
