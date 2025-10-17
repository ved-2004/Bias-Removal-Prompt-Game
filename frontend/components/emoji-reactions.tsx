"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Reaction = {
  id: string
  emoji: string
  x: number
  y: number
}

export function EmojiReactions({ messageId }: { messageId: string }) {
  const [reactions, setReactions] = useState<Reaction[]>([])

  const emojis = ["👍", "😮", "🎉", "❤️", "✨"]

  const handleReaction = (emoji: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const newReaction: Reaction = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
    setReactions((prev) => [...prev, newReaction])

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id))
    }, 2000)
  }

  return (
    <div className="relative">
      <div className="flex gap-1 mt-2">
        {emojis.map((emoji) => (
          <motion.button
            key={emoji}
            onClick={(e) => handleReaction(emoji, e)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="text-lg hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            {emoji}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {reactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute text-2xl pointer-events-none"
            style={{ left: reaction.x, top: reaction.y }}
          >
            {reaction.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
