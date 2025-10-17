"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Crown, TrendingUp, Flame, Star } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  username: string
  avatar?: string
  level: number
  totalPoints: number
  correctionsCount: number
  streak: number
  badges: number
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "BiasHunter2024",
    level: 12,
    totalPoints: 3450,
    correctionsCount: 287,
    streak: 21,
    badges: 8,
  },
  {
    rank: 2,
    username: "FairMindKid",
    level: 11,
    totalPoints: 3120,
    correctionsCount: 245,
    streak: 14,
    badges: 7,
  },
  {
    rank: 3,
    username: "EqualityChamp",
    level: 10,
    totalPoints: 2890,
    correctionsCount: 223,
    streak: 18,
    badges: 6,
  },
  {
    rank: 4,
    username: "YoungActivist",
    level: 9,
    totalPoints: 2650,
    correctionsCount: 198,
    streak: 12,
    badges: 6,
  },
  {
    rank: 5,
    username: "JusticeSeeker",
    level: 9,
    totalPoints: 2480,
    correctionsCount: 189,
    streak: 9,
    badges: 5,
  },
  {
    rank: 6,
    username: "BiasBuster",
    level: 8,
    totalPoints: 2210,
    correctionsCount: 167,
    streak: 15,
    badges: 5,
  },
  {
    rank: 7,
    username: "FairPlayPro",
    level: 8,
    totalPoints: 2050,
    correctionsCount: 156,
    streak: 7,
    badges: 4,
  },
  {
    rank: 8,
    username: "You",
    level: 7,
    totalPoints: 1890,
    correctionsCount: 142,
    streak: 7,
    badges: 4,
  },
]

interface MedalChipProps {
  rank: number
  count: number
}

function MedalChip({ rank, count }: MedalChipProps) {
  const [lowContrast, setLowContrast] = useState(false)

  useEffect(() => {
    // Simple contrast check - in production, you'd check actual parent background
    const isDark = document.documentElement.classList.contains("dark")
    // Silver medals need extra contrast handling
    setLowContrast(rank === 2 && !isDark)
  }, [rank])

  const getMedalStyles = () => {
    switch (rank) {
      case 1:
        return {
          gradient: "linear-gradient(135deg, var(--medal-gold-from), var(--medal-gold-to))",
          textColor: "var(--text-on-medal-gold)",
        }
      case 2:
        return {
          gradient: "linear-gradient(135deg, var(--medal-silver-from), var(--medal-silver-to))",
          textColor: "var(--text-on-medal-silver)",
        }
      case 3:
        return {
          gradient: "linear-gradient(135deg, var(--medal-bronze-from), var(--medal-bronze-to))",
          textColor: "var(--text-on-medal-bronze)",
        }
      default:
        return { gradient: "hsl(var(--muted))", textColor: "hsl(var(--foreground))" }
    }
  }

  const styles = getMedalStyles()

  return (
    <div className="inline-flex items-center gap-2 rounded-full px-3 h-8 bg-card border border-border shadow-sm">
      <div
        className="relative w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          background: styles.gradient,
          outline: "1.5px solid var(--medal-outline)",
          outlineOffset: "-1px",
          boxShadow: `0 1px 4px var(--medal-shadow)`,
        }}
        data-low-contrast={lowContrast}
      >
        {/* Inner highlight for depth */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.35), transparent)",
          }}
        />
        {rank === 1 && <Crown className="w-3 h-3 relative z-10" style={{ color: styles.textColor }} />}
        {rank === 2 && <Medal className="w-3 h-3 relative z-10" style={{ color: styles.textColor }} />}
        {rank === 3 && <Medal className="w-3 h-3 relative z-10" style={{ color: styles.textColor }} />}
      </div>
      <span className="text-sm font-semibold text-foreground">{count}</span>
    </div>
  )
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-primary" />
    case 2:
      return <Medal className="w-5 h-5 text-muted-foreground" />
    case 3:
      return <Medal className="w-5 h-5 text-accent" />
    default:
      return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
  }
}

export function LeaderboardContent() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "alltime">("weekly")

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground">See how you rank against other bias busters</p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
        {/* 2nd Place */}
        <Card className="p-4 text-center space-y-3 bg-muted border-border mt-8">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-border ring-2 ring-ring">
                <AvatarFallback className="bg-muted text-foreground font-bold">
                  {mockLeaderboard[1].username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-card shadow-md">
                <Medal className="w-4 h-4 text-foreground" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-foreground">{mockLeaderboard[1].username}</h3>
            <p className="text-sm text-muted-foreground">Level {mockLeaderboard[1].level}</p>
          </div>
          <Badge variant="outline" className="bg-muted text-foreground border-border">
            {mockLeaderboard[1].totalPoints.toLocaleString()} pts
          </Badge>
        </Card>

        <Card className="p-4 text-center space-y-3 bg-card border-primary/30 shadow-lg">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-primary ring-2 ring-ring">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                  {mockLeaderboard[0].username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-card shadow-lg">
                <Crown className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">{mockLeaderboard[0].username}</h3>
            <p className="text-sm text-muted-foreground">Level {mockLeaderboard[0].level}</p>
          </div>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            {mockLeaderboard[0].totalPoints.toLocaleString()} pts
          </Badge>
        </Card>

        <Card className="p-4 text-center space-y-3 bg-muted border-border mt-8">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-accent ring-2 ring-ring">
                <AvatarFallback className="bg-accent text-accent-foreground font-bold">
                  {mockLeaderboard[2].username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center border-2 border-card shadow-md">
                <Medal className="w-4 h-4 text-accent-foreground" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-foreground">{mockLeaderboard[2].username}</h3>
            <p className="text-sm text-muted-foreground">Level {mockLeaderboard[2].level}</p>
          </div>
          <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
            {mockLeaderboard[2].totalPoints.toLocaleString()} pts
          </Badge>
        </Card>
      </div>

      {/* Timeframe Tabs */}
      <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as typeof timeframe)} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="alltime">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value={timeframe} className="mt-6">
          <Card className="p-6 bg-card border-border">
            <div className="space-y-3">
              {mockLeaderboard.map((entry) => {
                const isCurrentUser = entry.username === "You"
                return (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      isCurrentUser
                        ? "bg-primary/10 border-2 border-primary/30"
                        : "bg-card hover:bg-muted border border-border"
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-12 flex justify-center">{getRankIcon(entry.rank)}</div>

                    <Avatar className="w-12 h-12 ring-2 ring-ring">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {entry.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground">{entry.username}</h3>
                        {isCurrentUser && (
                          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Level {entry.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {entry.correctionsCount} corrections
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-accent" />
                          {entry.streak} day streak
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">{entry.totalPoints.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>

                    <MedalChip rank={entry.rank} count={entry.badges} />
                  </div>
                )
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-6 bg-card border-border shadow-lg">
        <h3 className="text-lg font-bold text-foreground mb-4">Your Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">8th</div>
            <p className="text-xs text-muted-foreground">Current Rank</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">1,890</div>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">142</div>
            <p className="text-xs text-muted-foreground">Corrections</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent flex items-center justify-center gap-1">
              <Flame className="w-5 h-5" />7
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
