"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star, Zap } from "lucide-react"

interface LevelProgressProps {
  currentLevel: number
  currentXP: number
  xpToNextLevel: number
  totalPoints: number
}

export function LevelProgress({ currentLevel, currentXP, xpToNextLevel, totalPoints }: LevelProgressProps) {
  const progressPercent = (currentXP / xpToNextLevel) * 100

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Level {currentLevel}</h3>
            <p className="text-xs text-muted-foreground">Bias Buster</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-primary">
            <Zap className="w-4 h-4" />
            <span className="text-lg font-bold">{totalPoints}</span>
          </div>
          <p className="text-xs text-muted-foreground">Total Points</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress to Level {currentLevel + 1}</span>
          <span className="font-semibold text-foreground">
            {currentXP} / {xpToNextLevel} XP
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>
    </Card>
  )
}
