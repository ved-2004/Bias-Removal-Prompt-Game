"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Confetti from "react-confetti"

type CelebrationPopupProps = {
  isOpen: boolean
  onClose: () => void
  message: string
}

export function CelebrationPopup({ isOpen, onClose, message }: CelebrationPopupProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [avatarName, setAvatarName] = useState("YO")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      const savedAvatar = localStorage.getItem("userAvatar") || "YO"
      setAvatarName(savedAvatar)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="relative"
            >
              {/* Glowing circle background */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 blur-3xl"
              />

              {/* Avatar with glow */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute -inset-4"
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `rotate(${i * 45}deg) translateY(-80px)`,
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </motion.div>

                <Avatar className="w-32 h-32 border-8 border-white shadow-2xl relative z-10">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-4xl font-bold">
                    {avatarName}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl px-8 py-6 shadow-2xl border-4 border-yellow-400">
                  <p className="text-2xl font-bold text-gray-800">{message.replace("[AvatarName]", avatarName)}</p>

                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-full transition-all"
                  >
                    Continue ✨
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
