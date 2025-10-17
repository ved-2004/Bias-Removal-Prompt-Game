"use client"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function AuthCookie() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      // cookie with 1-day max-age; middleware uses it to gate routes
      document.cookie = `x-signed-in=${u ? "1" : "0"}; path=/; max-age=${60*60*24}`
    })
    return () => unsub()
  }, [])
  return null
}
