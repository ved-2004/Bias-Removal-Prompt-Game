"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Sparkles, Trophy, SettingsIcon } from "lucide-react"
import Confetti from "react-confetti"

type TutorialStep = {
  id: number
  title: string
  description: string
  targetElement: string
  action: "type" | "click" | "observe"
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Try rewriting this to make it fair!",
    description: "Type your improved version in the text box below",
    targetElement: "input-area",
    action: "type",
  },
  {
    id: 2,
    title: "You did it! You made AI fairer!",
    description: "Watch the bias meter drop from red to green",
    targetElement: "bias-meter",
    action: "observe",
  },
  {
    id: 3,
    title: "Track your progress here 🏆",
    description: "Check the leaderboard to see how you rank",
    targetElement: "leaderboard",
    action: "click",
  },
  {
    id: 4,
    title: "Replay tutorial or customize your avatar here ⚙️",
    description: "Access settings anytime",
    targetElement: "settings",
    action: "click",
  },
]

export function InteractiveTutorial({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [biasScore, setBiasScore] = useState(85)

  const step = tutorialSteps[currentStep]
  const sampleSentence = "Men are better leaders than women"
  const improvedSentence = "Everyone can be a great leader ✨"

  const handleNext = () => {
    if (currentStep === 0 && userInput.trim()) {
      // Simulate bias score improvement
      setBiasScore(15)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setCurrentStep(1)
      }, 2000)
    } else if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
    >
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={300} />
      )}

      {/* Dimmed background with spotlight effect */}
      <div className="absolute inset-0">
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-white/10 rounded-3xl blur-3xl"
          />
        )}
      </div>

      {/* Tutorial Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="max-w-2xl w-full"
          >
            {currentStep === 0 && (
              <div className="space-y-6">
                {/* Sample sentence card */}
                <Card className="p-6 bg-white/95 backdrop-blur-sm border-4 border-purple-400 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-bold text-purple-600">AI Trainer</span>
                    </div>
                    <p className="text-lg text-gray-800 font-medium">{sampleSentence}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-700">Bias Score</span>
                      <span className="text-sm font-bold text-red-600">{biasScore}%</span>
                    </div>
                    <div className="relative h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${biasScore}%` }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                      />
                    </div>
                  </div>
                </Card>

                {/* Glowing tooltip */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="relative"
                >
                  <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl border-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-2xl opacity-75 blur-xl animate-pulse" />
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-white/90">{step.description}</p>
                    </div>
                  </Card>
                </motion.div>

                {/* Input area */}
                <div className="space-y-3" id="input-area">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your improved version here..."
                    className="w-full px-5 py-4 rounded-2xl bg-white border-4 border-purple-400 text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all"
                    rows={3}
                  />
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={handleSkip} className="rounded-full bg-transparent">
                      Skip Tutorial
                    </Button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleNext}
                        disabled={!userInput.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8"
                      >
                        Check Answer
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="text-8xl"
                >
                  🎉
                </motion.div>
                <Card className="p-8 bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-2xl border-0">
                  <h2 className="text-3xl font-bold mb-4">Amazing Work!</h2>
                  <p className="text-xl mb-6">You reduced the bias from 85% to 15%!</p>
                  <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-sm font-medium mb-2">Your improved sentence:</p>
                    <p className="text-lg font-bold">{improvedSentence}</p>
                  </div>
                </Card>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="rounded-full bg-white/20 text-white border-white/40"
                  >
                    Skip Tutorial
                  </Button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleNext}
                      className="bg-white text-green-600 hover:bg-white/90 rounded-full px-8 font-bold"
                    >
                      Continue
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <Card className="p-8 bg-white/95 backdrop-blur-sm border-4 border-orange-400 shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <motion.div
                    className="absolute -top-4 -right-4 w-32 h-32 bg-orange-400 rounded-full opacity-20 blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </Card>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleSkip} className="rounded-full bg-transparent">
                    Skip Tutorial
                  </Button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-8"
                    >
                      Next
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <Card className="p-8 bg-white/95 backdrop-blur-sm border-4 border-blue-400 shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                      <SettingsIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </Card>

                {/* Closing card with Bias Monster */}
                <Card className="p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white shadow-2xl border-0 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="text-8xl mb-4"
                  >
                    👾👍
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-3">Welcome to AI Bias Trainer!</h2>
                  <p className="text-xl text-white/90">Let's make AI better together!</p>
                </Card>

                <div className="flex justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={onComplete}
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-12 py-6 text-lg font-bold shadow-xl"
                    >
                      Start Training!
                      <Sparkles className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
