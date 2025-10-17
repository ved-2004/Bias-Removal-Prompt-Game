export type BiasLevel = "low" | "medium" | "high"

export function getDynamicBackgroundColor(biasScore: number): string {
  if (biasScore < 30) {
    // Low bias - mint/green tones
    return "from-emerald-50 via-teal-50 to-cyan-50"
  } else if (biasScore < 60) {
    // Medium bias - periwinkle/blue tones
    return "from-blue-50 via-indigo-50 to-purple-50"
  } else {
    // High bias - soft violet tones
    return "from-purple-50 via-violet-50 to-pink-50"
  }
}

export function getDynamicAccentColor(biasScore: number): string {
  if (biasScore < 30) {
    return "from-emerald-400 to-teal-500"
  } else if (biasScore < 60) {
    return "from-blue-400 to-indigo-500"
  } else {
    return "from-purple-400 to-violet-500"
  }
}

export function getBiasLevel(score: number): BiasLevel {
  if (score < 30) return "low"
  if (score < 60) return "medium"
  return "high"
}
