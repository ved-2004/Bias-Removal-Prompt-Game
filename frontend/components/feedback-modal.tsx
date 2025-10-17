"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

type FeedbackModalProps = {
  isOpen: boolean
  onClose: () => void
  explanation: string
  betterVersion: string
}

export function FeedbackModal({ isOpen, onClose, explanation, betterVersion }: FeedbackModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg mx-4 bg-gradient-to-br from-amber-50 to-pink-50 rounded-3xl p-8 shadow-2xl border-4 border-amber-300"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 3,
                }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
              >
                <AlertCircle className="w-10 h-10 text-white" />
              </motion.div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">Not quite there yet!</h3>

            {/* Explanation */}
            <div className="bg-white/80 rounded-2xl p-6 mb-6 border-2 border-amber-200">
              <p className="text-gray-700 text-center mb-4">{explanation}</p>

              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300">
                <p className="text-sm font-bold text-green-700 mb-2">Try this instead:</p>
                <p className="text-gray-800 font-medium">{betterVersion}</p>
              </div>
            </div>

            {/* Try Again Button */}
            <Button
              onClick={onClose}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Try Again 💪
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
