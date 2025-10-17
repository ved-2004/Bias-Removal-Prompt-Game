"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Send } from "lucide-react"
import confetti from "canvas-confetti"

interface BiasData {
  sentence: string
  biasType: "Gender" | "Age" | "Sexual"
  biasScore: number
}

const mockBiasData: BiasData = {
  sentence: "Men are better leaders than women in the workplace.",
  biasType: "Gender",
  biasScore: 85,
}

const biasTypeColors = {
  Gender: "bg-secondary/20 text-secondary border-secondary/30",
  Age: "bg-accent/20 text-accent border-accent/30",
  Sexual: "bg-primary/20 text-primary border-primary/30",
}

export function TrainingInterface() {
  const [currentBias, setCurrentBias] = useState<BiasData>(mockBiasData)
  const [userInput, setUserInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [newScore, setNewScore] = useState<number | null>(null)

  const handleSubmit = async () => {
    if (!userInput.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Calculate new score (mock)
    const calculatedScore = Math.max(5, Math.floor(Math.random() * 20))
    setNewScore(calculatedScore)
    setShowResult(true)
    setIsSubmitting(false)

    // Show confetti if improvement is significant
    const improvement = currentBias.biasScore - calculatedScore
    if (improvement > 60) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  const handleNextSentence = () => {
    setShowResult(false)
    setUserInput("")
    setNewScore(null)
    // In a real app, fetch next sentence from API
  }

  const getBiasColor = (score: number) => {
    if (score >= 70) return "from-destructive to-destructive/80"
    if (score >= 40) return "from-warning to-warning/80"
    return "from-success to-success/80"
  }

  const getBiasLabel = (score: number) => {
    if (score >= 70) return "High Bias"
    if (score >= 40) return "Moderate Bias"
    return "Low Bias"
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          Train the AI
        </h1>
        <p className="text-muted-foreground">Help make AI fairer by rewriting biased sentences</p>
      </div>

      {/* Main Training Card */}
      <Card className="p-6 space-y-6 bg-card border-border shadow-lg">
        {/* Bias Type Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={cn("text-sm px-3 py-1", biasTypeColors[currentBias.biasType])}>
            {currentBias.biasType} Bias
          </Badge>
          <span className="text-sm text-muted-foreground">Sentence #1</span>
        </div>

        {/* Original Sentence */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Original Sentence</h3>
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-foreground leading-relaxed">{currentBias.sentence}</p>
          </div>
        </div>

        {/* Bias Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Bias Score</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{currentBias.biasScore}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
          </div>
          <div className="relative">
            <Progress value={currentBias.biasScore} className="h-3" />
            <div
              className={cn(
                "absolute inset-0 h-3 rounded-full bg-gradient-to-r opacity-80",
                getBiasColor(currentBias.biasScore),
              )}
              style={{ width: `${currentBias.biasScore}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">{getBiasLabel(currentBias.biasScore)}</p>
        </div>

        {/* User Input */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Your Unbiased Version</h3>
          <Textarea
            placeholder="Rewrite the sentence to remove bias..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={showResult}
          />
        </div>

        {/* Submit Button */}
        {!showResult ? (
          <Button
            onClick={handleSubmit}
            disabled={!userInput.trim() || isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold"
            size="lg"
          >
            {isSubmitting ? (
              "Analyzing..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit & Rescore
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Result */}
            <Card className="p-4 bg-success/10 border-success/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-success">New Bias Score</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-success">{newScore}</span>
                  <span className="text-sm text-success/70">/ 100</span>
                </div>
              </div>
              <div className="relative">
                <Progress value={newScore || 0} className="h-3" />
                <div
                  className="absolute inset-0 h-3 rounded-full bg-gradient-to-r from-success to-success/80 opacity-80"
                  style={{ width: `${newScore}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                  +{Math.floor((currentBias.biasScore - (newScore || 0)) / 7)} points earned!
                </Badge>
              </div>
            </Card>

            <Button
              onClick={handleNextSentence}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold"
              size="lg"
            >
              Next Sentence
            </Button>
          </div>
        )}
      </Card>

      {/* Tips Card */}
      <Card className="p-4 bg-muted/30 border-border">
        <h3 className="text-sm font-semibold text-foreground mb-2">💡 Tips for Success</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use gender-neutral language when possible</li>
          <li>• Focus on abilities and actions, not stereotypes</li>
          <li>• Consider how your words might affect different groups</li>
        </ul>
      </Card>
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}
