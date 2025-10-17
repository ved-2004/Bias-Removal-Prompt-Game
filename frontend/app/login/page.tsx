"use client"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const next = sp.get("next") || "/"

  const signIn = async () => {
    await signInWithPopup(auth, googleProvider)
    router.replace(next)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-6 space-y-4 w-[360px]">
        <h1 className="text-lg font-semibold">Sign in</h1>
        <Button onClick={signIn}>Continue with Google</Button>
      </Card>
    </div>
  )
}
