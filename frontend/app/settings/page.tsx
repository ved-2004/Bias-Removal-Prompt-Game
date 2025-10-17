// frontend/app/settings/page.tsx  (auth redirect built-in)
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import SettingsContent from "@/components/settings-content"
import { Card } from "@/components/ui/card"

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth?next=/settings")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="max-w-2xl">
        <Card className="p-5 text-sm text-muted-foreground">Loading…</Card>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <SettingsContent />
}
