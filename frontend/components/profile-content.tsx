"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BadgesDisplay } from "@/components/badges-display"
import { LevelProgress } from "@/components/level-progress"
import { User, TrendingUp, Target, Flame, Star, Award, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

const biasProgressData = [
  {
    category: "Gender Bias",
    score: 85,
  },
  { category: "Age Bias", score: 72 },
  { category: "Sexual Bias", score: 91 },
]

const activityData = [
  { day: "Mon", corrections: 12 },
  { day: "Tue", corrections: 18 },
  { day: "Wed", corrections: 15 },
  { day: "Thu", corrections: 22 },
  { day: "Fri", corrections: 19 },
  { day: "Sat", corrections: 25 },
  { day: "Sun", corrections: 20 },
]

const stats = [
  { label: "Total Corrections", value: "142", icon: TrendingUp },
  { label: "Current Streak", value: "7 days", icon: Flame },
  { label: "Best Improvement", value: "95%", icon: Target },
  { label: "Badges Earned", value: "4", icon: Award },
]

const recentAchievements = [
  {
    id: "1",
    title: "Streak Master",
    description: "Maintained a 7-day streak",
    date: "2 days ago",
    rarity: "rare" as const,
  },
  {
    id: "2",
    title: "Gender Equality",
    description: "Corrected 50 gender bias sentences",
    date: "1 week ago",
    rarity: "epic" as const,
  },
  {
    id: "3",
    title: "First Steps",
    description: "Completed first bias correction",
    date: "2 weeks ago",
    rarity: "common" as const,
  },
]

const rarityColors = {
  common: "bg-muted text-muted-foreground border-border",
  rare: "bg-accent/20 text-accent-foreground border-accent/30",
  epic: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  legendary: "bg-primary text-primary-foreground border-0",
}

export function ProfileContent() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const currentXP = 340
  const xpToNextLevel = 500
  const xpPercentage = (currentXP / xpToNextLevel) * 100

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
          <User className="w-8 h-8 text-primary" />
          Your Profile
        </h1>
        <p className="text-muted-foreground">Track your progress and achievements</p>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className="p-6 bg-card border-border shadow-lg relative overflow-hidden">
          {/* Sparkle decorations */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute top-4 right-4 text-accent"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute bottom-4 left-4 text-secondary"
          >
            <Star className="w-5 h-5" />
          </motion.div>

          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <svg className="absolute -inset-2 w-28 h-28" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="hsl(var(--ring))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - xpPercentage / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                />
              </svg>

              <Avatar className="w-24 h-24 border-4 border-card shadow-lg ring-2 ring-ring">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">YO</AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">Young Activist</h2>
              <p className="text-muted-foreground mb-3">Member since January 2025</p>
              <div className="flex items-center gap-4">
                <Badge className="bg-primary text-primary-foreground border-0 shadow-md">Level 7</Badge>
                <Badge className="bg-secondary text-secondary-foreground border-0 shadow-md">Bias Buster</Badge>
                <Badge className="bg-accent text-accent-foreground border-0 shadow-md">Rank #8</Badge>
              </div>
            </div>

            <motion.div className="text-right" whileHover={{ scale: 1.05 }}>
              <div className="text-3xl font-bold text-primary">1,890</div>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Level Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <LevelProgress currentLevel={7} currentXP={currentXP} xpToNextLevel={xpToNextLevel} totalPoints={1890} />
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colors = [
            "bg-primary text-primary-foreground",
            "bg-secondary text-secondary-foreground",
            "bg-accent text-accent-foreground",
            "bg-chart-4 text-foreground",
          ]
          return (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-4 bg-card border-border shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg ${colors[index]} flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Bias Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        key="bias-chart"
      >
        <Card className="p-4 md:p-6 bg-card border-border shadow-lg rounded-xl">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Bias Training Progress
          </h3>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            key="chart-container"
          >
            {biasProgressData.map((item, index) => {
              const chartIndex = (index % 3) + 1
              return (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 1,
                    delay: 0.5 + index * 0.1,
                    type: "spring",
                    stiffness: 50,
                  }}
                  className="relative"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{item.category}</span>
                    <span className="text-sm font-bold text-foreground">{item.score}%</span>
                  </div>

                  <div className="relative h-12 bg-muted rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.6 + index * 0.1,
                        type: "spring",
                        stiffness: 50,
                      }}
                      className="h-full rounded-full relative shadow-lg"
                      style={{
                        background: `linear-gradient(to right, var(--chart-bar-${chartIndex}), var(--chart-fill-${chartIndex}))`,
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                      />
                    </motion.div>
                  </div>

                  {hoveredBar === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -top-16 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-card text-card-foreground rounded-lg shadow-xl z-10 border border-border"
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold">{item.score}% Complete</div>
                        <div className="text-xs text-muted-foreground">Keep up the great work!</div>
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </Card>
      </motion.div>

      {/* Recent Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="p-6 bg-card border-border shadow-lg">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" />
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted border border-border shadow-md hover:shadow-lg transition-shadow"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl shadow-lg"
                >
                  🏆
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <Badge className={`${rarityColors[achievement.rarity]} border shadow-md`}>{achievement.rarity}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Badges Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
        <BadgesDisplay />
      </motion.div>
    </div>
  )
}
