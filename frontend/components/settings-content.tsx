"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiGet, apiPost } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

type MeSummary = {
  uid: string
  username?: string
  points?: number
  photoURL?: string
  email?: string
}

export default function SettingsContent() {
  const { user } = useAuth()
  const [me, setMe] = useState<MeSummary | null>(null)
  const [username, setUsername] = useState("")
  const [points, setPoints] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setErr(null)
      setOk(null)
      try {
        const res = await apiGet<MeSummary>("/api/me/summary")
        if (cancelled) return
        setMe(res ?? null)
        setUsername(res?.username ?? user?.displayName ?? "")
        setPoints(typeof res?.points === "number" ? res.points : null)
      } catch (e: any) {
        if (cancelled) return
        setErr(e?.message || "Failed to load settings.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user?.uid])

  async function save() {
    setSaving(true)
    setErr(null)
    setOk(null)
    try {
      await apiPost("/api/me/update", { username })
      setOk("Saved")
    } catch (e: any) {
      setErr(e?.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Update your basic info.</p>
      </div>

      <Card className="p-5 space-y-5">
        <div className="flex items-center gap-4">
          <AvatarCircle
            name={username || user?.displayName || "User"}
            photoURL={me?.photoURL || user?.photoURL || undefined}
            size={56}
          />
          <div className="min-w-0">
            <div className="text-base font-semibold truncate">
              {username || user?.displayName || "User"}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {user?.email || me?.email || "—"}
            </div>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Username
          </label>
          <div className="flex items-center gap-3">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your display name"
            />
            <Button onClick={save} disabled={saving || loading}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <div className="text-xs font-medium text-muted-foreground mb-1">
            Total Points
          </div>
          <div className="text-2xl font-bold">
            {loading ? "…" : points != null ? points.toLocaleString() : "0"}
          </div>
        </div>

        {ok && <p className="text-sm text-emerald-600">{ok}</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
      </Card>

      <Card className="p-4">
        <form action="/api/logout" method="post">
          <Button variant="secondary" type="submit">Sign Out</Button>
        </form>
      </Card>
    </div>
  )
}

function AvatarCircle({
  name,
  photoURL,
  size = 40,
}: {
  name?: string
  photoURL?: string
  size?: number
}) {
  const initials = (name ?? "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  if (photoURL) {
    // eslint-disable-next-line @next/next/no-img-element
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
      className="rounded-full bg-muted flex items-center justify-center text-sm font-bold"
      title={name}
    >
      {initials || "?"}
    </div>
  )
}
