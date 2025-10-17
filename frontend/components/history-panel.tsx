"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, TrendingDown } from "lucide-react"

interface HistoryItem {
  id: string
  originalSentence: string
  biasType: "Gender" | "Age" | "Sexual"
  originalScore: number
  improvedScore: number
  timestamp: Date
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    originalSentence: "Men are better leaders than women",
    biasType: "Gender",
    originalScore: 85,
    improvedScore: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    originalSentence: "Old people can't learn new technology",
    biasType: "Age",
    originalScore: 92,
    improvedScore: 8,
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "3",
    originalSentence: "Young people are irresponsible",
    biasType: "Age",
    originalScore: 78,
    improvedScore: 15,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
]

const biasTypeColors = {
  Gender: "bg-secondary/20 text-secondary border-secondary/30",
  Age: "bg-accent/20 text-accent border-accent/30",
  Sexual: "bg-primary/20 text-primary border-primary/30",
}

export function HistoryPanel() {
  return (
    <aside className="w-80 h-screen bg-card border-l border-border flex flex-col p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground mb-1">Bias History</h2>
        <p className="text-xs text-muted-foreground">Your recent improvements</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {mockHistory.map((item) => {
            const improvement = item.originalScore - item.improvedScore
            const improvementPercent = Math.round((improvement / item.originalScore) * 100)

            return (
              <Card key={item.id} className="p-3 bg-muted/30 border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className={cn("text-xs", biasTypeColors[item.biasType])}>
                    {item.biasType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <p className="text-xs text-foreground/80 mb-3 line-clamp-2">{item.originalSentence}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                      <span className="text-xs font-medium text-destructive">{item.originalScore}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">→</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-success" />
                      <span className="text-xs font-medium text-success">{item.improvedScore}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                    -{improvementPercent}%
                  </Badge>
                </div>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </aside>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}
