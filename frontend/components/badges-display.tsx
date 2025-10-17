"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Lock } from "lucide-react"

interface BadgeItem {
  id: string
  name: string
  icon: string
  description: string
  unlocked: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
}

const mockBadges: BadgeItem[] = [
  {
    id: "1",
    name: "First Steps",
    icon: "👶",
    description: "Complete your first bias correction",
    unlocked: true,
    rarity: "common",
  },
  {
    id: "2",
    name: "Streak Master",
    icon: "🔥",
    description: "Maintain a 7-day streak",
    unlocked: true,
    rarity: "rare",
  },
  {
    id: "3",
    name: "Gender Equality",
    icon: "⚖️",
    description: "Correct 50 gender bias sentences",
    unlocked: true,
    rarity: "epic",
  },
  {
    id: "4",
    name: "Bias Destroyer",
    icon: "💥",
    description: "Achieve 95%+ improvement on 10 sentences",
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: "5",
    name: "Age Advocate",
    icon: "🎂",
    description: "Correct 50 age bias sentences",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "6",
    name: "Perfect Score",
    icon: "🎯",
    description: "Reduce bias score to 0",
    unlocked: false,
    rarity: "legendary",
  },
]

const rarityColors = {
  common: "border-muted/50",
  rare: "border-accent/50",
  epic: "border-secondary/50",
  legendary: "border-primary/50",
}

export function BadgesDisplay() {
  const unlockedCount = mockBadges.filter((b) => b.unlocked).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Badges</h3>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          {unlockedCount} / {mockBadges.length}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {mockBadges.map((badge) => (
          <Card
            key={badge.id}
            className={`p-4 text-center space-y-2 transition-all hover:scale-105 ${
              badge.unlocked ? `bg-card border-2 ${rarityColors[badge.rarity]}` : "bg-muted/30 border-border opacity-60"
            }`}
          >
            <div className="text-4xl">
              {badge.unlocked ? badge.icon : <Lock className="w-8 h-8 mx-auto text-muted-foreground" />}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{badge.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
            </div>
            {badge.unlocked && (
              <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                Unlocked
              </Badge>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
