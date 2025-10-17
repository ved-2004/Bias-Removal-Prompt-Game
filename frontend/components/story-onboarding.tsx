"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { CelebrationPopup } from "@/components/celebration-popup"
import { FeedbackModal } from "@/components/feedback-modal"

type OnboardingProps = {
  onComplete: () => void
}

export function StoryOnboarding({ onComplete }: OnboardingProps) {
  const [scene, setScene] = useState(1)
  const [userRewrite, setUserRewrite] = useState("")
  const [showCelebration, setShowCelebration] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [biasScore, setBiasScore] = useState(85)

  const biasedSentence = "Men are better leaders than women"
  const correctRewrites = [
    "everyone can be a great leader",
    "leadership ability isn't determined by gender",
    "people of all genders can be excellent leaders",
    "great leaders come from all backgrounds",
  ]

  const handleSubmitRewrite = () => {
    const normalized = userRewrite.toLowerCase().trim()
    const isCorrect = correctRewrites.some((correct) => normalized.includes(correct.toLowerCase()))

    if (isCorrect) {
      setBiasScore(15)
      setTimeout(() => {
        setShowCelebration(true)
      }, 500)
    } else {
      setShowFeedback(true)
    }
  }

  const handleTryAgain = () => {
    setShowFeedback(false)
    setUserRewrite("")
    setBiasScore(85)
  }

  const handleCelebrationComplete = () => {
    setShowCelebration(false)
    setScene(4)
  }

  const handleNext = () => {
    if (scene < 5) {
      setScene(scene + 1)
    } else {
      localStorage.setItem("hasCompletedOnboarding", "true")
      onComplete()
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-teal-900/95 backdrop-blur-sm"
      >
        <AnimatePresence mode="wait">
          {/* Scene 1: Meet the Bias Monster */}
          {scene === 1 && (
            <motion.div
              key="scene1"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl mx-auto px-8 text-center"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="text-9xl mb-6"
              >
                👾
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white/10 backdrop-blur-md rotate-45 border-l-2 border-t-2 border-white/20" />
                <p className="text-2xl font-bold text-white mb-4">Hi there! I'm the Bias Monster.</p>
                <p className="text-lg text-white/90">I live in AI's whispers... sometimes I make it unfair!</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8"
              >
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Tell me more
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Scene 2: Why fairness matters */}
          {scene === 2 && (
            <motion.div
              key="scene2"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl mx-auto px-8 text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="text-9xl mb-6"
              >
                🤝
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl"
              >
                <h2 className="text-3xl font-bold text-white mb-4">Can you teach me to be fair?</h2>
                <p className="text-lg text-white/90 mb-2">When AI learns from biased data, it can hurt people.</p>
                <p className="text-lg text-white/90">Together, we can make AI better for everyone!</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8"
              >
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  I'll help you!
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Scene 3: Try a fix */}
          {scene === 3 && (
            <motion.div
              key="scene3"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl mx-auto px-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Let's try fixing a biased sentence!</h2>
                <p className="text-lg text-white/90">Rewrite it to make it fair for everyone</p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="bg-red-500/20 backdrop-blur-md rounded-3xl p-6 border-2 border-red-400/50 shadow-xl">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🤖</div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-3">{biasedSentence}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-white/80">
                          <span>Bias Score</span>
                          <span>{biasScore}%</span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: "85%" }}
                            animate={{ width: `${biasScore}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full rounded-full ${
                              biasScore > 50
                                ? "bg-gradient-to-r from-red-500 to-orange-500"
                                : "bg-gradient-to-r from-green-500 to-emerald-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border-2 border-white/20 shadow-xl"
              >
                <label className="block text-white font-bold mb-3">Your fair rewrite:</label>
                <Textarea
                  value={userRewrite}
                  onChange={(e) => setUserRewrite(e.target.value)}
                  placeholder="Type your fair version here..."
                  className="w-full min-h-[100px] bg-white/90 border-white/30 text-gray-800 placeholder:text-gray-500 rounded-xl mb-4"
                />
                <Button
                  onClick={handleSubmitRewrite}
                  disabled={!userRewrite.trim()}
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check My Answer ✨
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Scene 4: Score & Badges */}
          {scene === 4 && (
            <motion.div
              key="scene4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl mx-auto px-8 text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="text-9xl mb-6"
              >
                🏆
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl"
              >
                <h2 className="text-3xl font-bold text-white mb-4">Earn points, unlock badges!</h2>
                <p className="text-lg text-white/90 mb-4">
                  Complete daily challenges, climb the leaderboard, and outsmart the Bias Monster!
                </p>
                <div className="flex items-center justify-center gap-6 text-4xl">
                  <motion.span
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  >
                    🎯
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                  >
                    🏅
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                  >
                    ⭐
                  </motion.span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8"
              >
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Show me more!
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Scene 5: You're ready */}
          {scene === 5 && (
            <motion.div
              key="scene5"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl mx-auto px-8 text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="text-9xl mb-6"
              >
                👋
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20 shadow-2xl"
              >
                <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                  You're Ready!
                  <Sparkles className="w-10 h-10 text-yellow-300" />
                </h2>
                <p className="text-xl text-white/90">Together, we'll make AI better!</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring", damping: 10 }}
                className="mt-8"
              >
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all animate-pulse"
                >
                  Let's Begin! 🚀
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <motion.div
              key={s}
              className={`w-3 h-3 rounded-full ${s === scene ? "bg-white" : "bg-white/30"}`}
              animate={{ scale: s === scene ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>

      <CelebrationPopup
        isOpen={showCelebration}
        onClose={handleCelebrationComplete}
        message="Amazing job! You made AI fairer today 🎉"
      />

      <FeedbackModal
        isOpen={showFeedback}
        onClose={handleTryAgain}
        explanation="This rewrite still contains bias. Try removing any assumptions about which group is better."
        betterVersion="Everyone can be a great leader ✨"
      />
    </>
  )
}
