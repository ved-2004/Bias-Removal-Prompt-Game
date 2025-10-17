"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { apiGet } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

type MeSummary = {
  uid: string
  username?: string
  points?: number
  photoURL?: string
}

export default function ProfileContent() {
  const { user, loading } = useAuth()
  const [me, setMe] = useState<MeSummary | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (loading) return
      setBusy(true)
      setErr(null)
      try {
        const res = await apiGet<MeSummary>("/me/summary")
        if (cancelled) return
        setMe(res ?? null)
      } catch (e: any) {
        if (cancelled) return
        setErr(e?.message || "Failed to load profile.")
      } finally {
        if (!cancelled) setBusy(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [loading])

  const displayName =
    user?.displayName?.trim() ||
    me?.username?.trim() ||
    "Anonymous"

  const points = typeof me?.points === "number" ? me!.points : undefined
  const photoURL = user?.photoURL || me?.photoURL

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <p className="text-sm text-muted-foreground">
          Basic account info and your total points.
        </p>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-4">
          <AvatarCircle name={displayName} photoURL={photoURL} size={56} />
          <div className="min-w-0">
            <div className="text-lg font-semibold truncate">{displayName}</div>
            {user?.email && (
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            label="Total Points"
            value={
              busy ? "…" : points != null ? points.toLocaleString() : "0"
            }
          />
          <StatCard
            label="User ID"
            value={(user?.uid || me?.uid || "—").toString()}
          />
        </div>

        {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
      </Card>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </Card>
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
    return (
      // eslint-disable-next-line @next/next/no-img-element
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
