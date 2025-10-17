"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

export function OnboardingComic({ onComplete }: { onComplete: () => void }) {
  const [frame, setFrame] = useState(0)

  const frames = [
    {
      title: "Meet the Bias Monster!",
      description: "Hidden in AI's whispers, making things unfair...",
      emoji: "👾",
      background: "from-purple-400 via-pink-400 to-orange-400",
    },
    {
      title: "Help us make AI fair!",
      description: "Train the AI to be kind and equal to everyone",
      emoji: "✨",
      background: "from-blue-400 via-teal-400 to-green-400",
    },
  ]

  const currentFrame = frames[frame]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={frame}
          initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
          transition={{ type: "spring", duration: 0.8 }}
          className={`max-w-2xl w-full mx-4 p-12 rounded-3xl bg-gradient-to-br ${currentFrame.background} shadow-2xl relative overflow-hidden`}
        >
          {/* Floating sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${15 + (i % 3) * 25}%`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
            />
          ))}

          <div className="relative z-10 text-center space-y-8">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="text-9xl"
            >
              {currentFrame.emoji}
            </motion.div>

            <div className="space-y-4">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white drop-shadow-lg"
              >
                {currentFrame.title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-white/90 drop-shadow"
              >
                {currentFrame.description}
              </motion.p>
            </div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
              {frame < frames.length - 1 ? (
                <Button
                  onClick={() => setFrame(frame + 1)}
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-full shadow-xl"
                >
                  Next
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <Button
                  onClick={onComplete}
                  size="lg"
                  className="bg-white text-teal-600 hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-full shadow-xl"
                >
                  Let's Begin!
                  <Sparkles className="ml-2 w-5 h-5" />
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
