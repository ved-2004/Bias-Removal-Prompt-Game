"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Lightbulb, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type WhyItWorkedProps = {
  isOpen: boolean
  onClose: () => void
  before: string
  after: string
  explanation: string
  highlights: { word: string; reason: string }[]
}

export function WhyItWorkedTooltip({ isOpen, onClose, before, after, explanation, highlights }: WhyItWorkedProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="max-w-2xl w-full p-6 bg-white shadow-2xl border-4 border-yellow-400">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Why it Worked!</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-2">Before:</p>
                  <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                    <p className="text-gray-800">{before}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-600 mb-2">After:</p>
                  <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                    <p className="text-gray-800">{after}</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
                </div>

                {highlights.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-600">Key Changes:</p>
                    {highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg"
                      >
                        <span className="text-blue-600 font-bold">→</span>
                        <div>
                          <span className="font-bold text-blue-700">{highlight.word}</span>
                          <span className="text-gray-600"> - {highlight.reason}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
