"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, ArrowRight } from "lucide-react"

type WalkthroughStep = {
  target: string
  title: string
  description: string
  position: "top" | "bottom" | "left" | "right"
}

const steps: WalkthroughStep[] = [
  {
    target: "chat-area",
    title: "This is where you talk to the AI 👋",
    description: "The AI will send you biased sentences to rewrite",
    position: "right",
  },
  {
    target: "score-gauge",
    title: "Fix biased whispers and earn XP ✨",
    description: "Watch your bias score improve as you make better sentences",
    position: "left",
  },
  {
    target: "leaderboard-link",
    title: "Compete with friends! 🏆",
    description: "See how you rank against other bias busters",
    position: "bottom",
  },
]

export function GuidedWalkthrough({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const step = steps[currentStep]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full mx-4"
        >
          <div className="bg-white rounded-2xl p-6 shadow-2xl border-4 border-purple-400 relative">
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-2xl opacity-75 blur-lg"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onComplete} className="shrink-0">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentStep ? "w-8 bg-purple-500" : "w-2 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                >
                  {currentStep < steps.length - 1 ? (
                    <>
                      Next
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  ) : (
                    "Got it!"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
