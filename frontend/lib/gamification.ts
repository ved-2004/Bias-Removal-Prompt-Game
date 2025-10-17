export interface UserProgress {
  level: number
  currentXP: number
  xpToNextLevel: number
  totalPoints: number
  streak: number
  badges: string[]
  achievements: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  condition: (progress: UserProgress) => boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_correction",
    title: "First Steps",
    description: "Complete your first bias correction",
    icon: "👶",
    rarity: "common",
    condition: (progress) => progress.totalPoints > 0,
  },
  {
    id: "streak_7",
    title: "Streak Master",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    rarity: "rare",
    condition: (progress) => progress.streak >= 7,
  },
  {
    id: "level_5",
    title: "Rising Star",
    description: "Reach level 5",
    icon: "⭐",
    rarity: "rare",
    condition: (progress) => progress.level >= 5,
  },
  {
    id: "points_1000",
    title: "Point Master",
    description: "Earn 1,000 total points",
    icon: "💎",
    rarity: "epic",
    condition: (progress) => progress.totalPoints >= 1000,
  },
  {
    id: "level_10",
    title: "Bias Destroyer",
    description: "Reach level 10",
    icon: "💥",
    rarity: "legendary",
    condition: (progress) => progress.level >= 10,
  },
]

export function calculateXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

export function calculateLevel(totalXP: number): { level: number; currentXP: number; xpToNextLevel: number } {
  let level = 1
  let xpForCurrentLevel = 0
  let xpForNextLevel = calculateXPForLevel(level)

  while (totalXP >= xpForNextLevel) {
    xpForCurrentLevel = xpForNextLevel
    level++
    xpForNextLevel = calculateXPForLevel(level)
  }

  const currentXP = totalXP - xpForCurrentLevel
  const xpToNextLevel = xpForNextLevel - xpForCurrentLevel

  return { level, currentXP, xpToNextLevel }
}

export function checkAchievements(progress: UserProgress): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => {
    const isUnlocked = progress.achievements.includes(achievement.id)
    const meetsCondition = achievement.condition(progress)
    return !isUnlocked && meetsCondition
  })
}

export function calculatePoints(originalScore: number, improvedScore: number): number {
  const improvement = originalScore - improvedScore
  const improvementPercent = (improvement / originalScore) * 100

  let basePoints = Math.floor(improvement / 7)

  if (improvementPercent >= 90) basePoints *= 2
  else if (improvementPercent >= 75) basePoints *= 1.5

  return Math.max(1, basePoints)
}
