"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, X } from "lucide-react"
import confetti from "canvas-confetti"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface AchievementPopupProps {
  achievement: Achievement | null
  onClose: () => void
}

const rarityColors = {
  common: "from-muted to-muted/80",
  rare: "from-accent to-accent/80",
  epic: "from-secondary to-secondary/80",
  legendary: "from-primary via-secondary to-accent",
}

const rarityBadgeColors = {
  common: "bg-muted/20 text-muted-foreground border-muted/30",
  rare: "bg-accent/20 text-accent border-accent/30",
  epic: "bg-secondary/20 text-secondary border-secondary/30",
  legendary: "bg-gradient-to-r from-primary to-secondary text-white border-0",
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"],
      })

      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <Card
        className={`relative w-96 p-6 bg-gradient-to-br ${rarityColors[achievement.rarity]} border-0 shadow-2xl transform transition-all duration-300 ${
          isVisible ? "scale-100" : "scale-90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl">
              {achievement.icon}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-white" />
              <h3 className="text-xl font-bold text-white">Achievement Unlocked!</h3>
            </div>
            <Badge variant="outline" className={rarityBadgeColors[achievement.rarity]}>
              {achievement.rarity.toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white">{achievement.title}</h4>
            <p className="text-sm text-white/80">{achievement.description}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
