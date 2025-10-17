"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    router.replace(user ? "/train" : "/auth")
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-5 text-sm text-muted-foreground">
        Redirecting...
      </Card>
    </div>
  )
}
