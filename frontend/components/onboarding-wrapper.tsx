"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { StoryOnboarding } from "./story-onboarding"

export function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check localStorage for completion flag
    const hasCompleted = localStorage.getItem("hasCompletedOnboarding")
    console.log("[v0] Onboarding check:", hasCompleted)

    if (hasCompleted !== "true") {
      setShowOnboarding(true)
    }
    setIsChecking(false)
  }, [])

  const handleOnboardingComplete = () => {
    console.log("[v0] Onboarding completed")
    setShowOnboarding(false)
  }

  // Don't render children until we've checked onboarding status
  if (isChecking) {
    return null
  }

  return (
    <>
      {showOnboarding && <StoryOnboarding onComplete={handleOnboardingComplete} />}
      {children}
    </>
  )
}
