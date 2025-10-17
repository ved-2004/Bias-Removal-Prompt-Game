"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Confetti from "react-confetti"

type BadgeRevealProps = {
  badge: {
    name: string
    description: string
    icon: string
  }
  onClose: () => void
}

export function CinematicBadgeReveal({ badge, onClose }: BadgeRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-8"
    >
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={300}
        gravity={0.2}
      />

      <div className="relative flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ type: "spring", duration: 1, bounce: 0.5 }}
          className="relative flex items-center justify-center"
        >
          {/* Glowing pedestal */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 60px rgba(168, 85, 247, 0.6)",
                "0 0 100px rgba(236, 72, 153, 0.8)",
                "0 0 60px rgba(168, 85, 247, 0.6)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-80 h-80 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center relative"
          >
            {/* Rotating particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-white rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  marginTop: "-6px",
                  marginLeft: "-6px",
                }}
                animate={{
                  x: [0, Math.cos((i * Math.PI) / 6) * 150],
                  y: [0, Math.sin((i * Math.PI) / 6) * 150],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1,
                }}
              />
            ))}

            {/* Badge Icon - Properly centered */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center text-9xl z-10"
            >
              {badge.icon}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Badge info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 space-y-4"
        >
          <h2 className="text-4xl font-bold text-white drop-shadow-lg">You earned the</h2>
          <h3 className="text-5xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
            {badge.name} Badge!
          </h3>
          <p className="text-xl text-white/80">{badge.description}</p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onClose}
              size="lg"
              className="mt-6 bg-white text-purple-600 hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-full shadow-xl"
            >
              Awesome!
            </Button>
          </motion.div>
        </motion.div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-4 -right-4 text-white hover:bg-white/20 rounded-full"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>
    </motion.div>
  )
}
