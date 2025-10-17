"use client"

import { Suspense } from "react"
import AuthInner from "./_inner"

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthInner />
    </Suspense>
  )
}