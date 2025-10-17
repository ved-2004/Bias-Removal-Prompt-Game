"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, Lightbulb, Users, Calendar, Heart, Brain, ChevronRight } from "lucide-react"

interface LessonModule {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  topics: string[]
  completed: boolean
}

const modules: LessonModule[] = [
  {
    id: "1",
    title: "What is Bias?",
    description: "Learn the basics of bias and how it affects our thinking",
    icon: <Brain className="w-5 h-5" />,
    duration: "10 min",
    difficulty: "Beginner",
    topics: ["Definition of bias", "Types of bias", "Why bias matters"],
    completed: true,
  },
  {
    id: "2",
    title: "Gender Bias",
    description: "Understanding stereotypes and assumptions about gender",
    icon: <Users className="w-5 h-5" />,
    duration: "15 min",
    difficulty: "Beginner",
    topics: ["Gender stereotypes", "Equal opportunities", "Inclusive language"],
    completed: true,
  },
  {
    id: "3",
    title: "Age Bias",
    description: "Recognizing assumptions based on age",
    icon: <Calendar className="w-5 h-5" />,
    duration: "12 min",
    difficulty: "Intermediate",
    topics: ["Ageism", "Generational stereotypes", "Respecting all ages"],
    completed: false,
  },
  {
    id: "4",
    title: "Cultural Bias",
    description: "Appreciating diversity and avoiding cultural stereotypes",
    icon: <Heart className="w-5 h-5" />,
    duration: "18 min",
    difficulty: "Intermediate",
    topics: ["Cultural sensitivity", "Avoiding stereotypes", "Celebrating diversity"],
    completed: false,
  },
  {
    id: "5",
    title: "AI and Bias",
    description: "How AI systems can inherit and amplify human biases",
    icon: <Brain className="w-5 h-5" />,
    duration: "20 min",
    difficulty: "Advanced",
    topics: ["Training data bias", "Algorithmic fairness", "Responsible AI"],
    completed: false,
  },
]

const faqs = [
  {
    question: "Why does bias exist in AI?",
    answer:
      "AI systems learn from data created by humans, and if that data contains biases, the AI will learn those biases too. For example, if an AI is trained on text that mostly shows doctors as men, it might assume all doctors are men.",
  },
  {
    question: "How can I identify bias in a sentence?",
    answer:
      "Look for generalizations about groups of people, stereotypes, or assumptions based on characteristics like gender, age, race, or other traits. Ask yourself: Is this statement fair to everyone? Does it make assumptions?",
  },
  {
    question: "What is inclusive language?",
    answer:
      "Inclusive language is language that avoids bias and treats all people with respect. It uses terms that don't exclude or stereotype any group. For example, saying 'firefighter' instead of 'fireman' or 'police officer' instead of 'policeman'.",
  },
  {
    question: "Can bias ever be completely eliminated?",
    answer:
      "While it's difficult to eliminate all bias, we can work to reduce it significantly. By being aware of our biases and actively working to correct them, we can make AI systems and our own thinking much fairer.",
  },
  {
    question: "Why is it important for kids to learn about bias?",
    answer:
      "Learning about bias early helps you become a more thoughtful, fair person. As AI becomes more common in our lives, understanding how to make it fair is an important skill for the future.",
  },
]

const difficultyColors = {
  Beginner: "bg-success/20 text-success border-success/30",
  Intermediate: "bg-warning/20 text-warning border-warning/30",
  Advanced: "bg-destructive/20 text-destructive border-destructive/30",
}

export function EducationalContent() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  const completedCount = modules.filter((m) => m.completed).length

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Educational Zone
        </h1>
        <p className="text-muted-foreground">Learn about bias and how to make AI fairer</p>
      </div>

      {/* Progress Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">Your Learning Progress</h3>
            <p className="text-sm text-muted-foreground">
              {completedCount} of {modules.length} modules completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {Math.round((completedCount / modules.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </div>
        <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${(completedCount / modules.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Learning Modules */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          Learning Modules
        </h2>

        <div className="grid gap-4">
          {modules.map((module) => (
            <Card
              key={module.id}
              className={`p-6 transition-all hover:shadow-lg ${
                module.completed ? "bg-success/5 border-success/30" : "bg-card border-border"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    module.completed
                      ? "bg-success/20 text-success"
                      : "bg-gradient-to-br from-primary to-secondary text-white"
                  }`}
                >
                  {module.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                    {module.completed && (
                      <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                        Completed
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline" className={difficultyColors[module.difficulty]}>
                      {module.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{module.duration}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {module.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/50 text-muted-foreground border-border">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    variant={module.completed ? "outline" : "default"}
                    className={
                      module.completed ? "" : "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                    }
                  >
                    {module.completed ? "Review Module" : "Start Learning"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>

        <Card className="p-6 bg-card border-border">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          Quick Tips for Spotting Bias
        </h3>
        <ul className="space-y-3 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold">•</span>
            <span>
              <strong>Question generalizations:</strong> If a statement says "all" or "always" about a group, it's
              likely biased
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold">•</span>
            <span>
              <strong>Look for stereotypes:</strong> Does the sentence assume something based on gender, age, or other
              characteristics?
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold">•</span>
            <span>
              <strong>Consider alternatives:</strong> Can you rewrite the sentence to be more inclusive and fair?
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold">•</span>
            <span>
              <strong>Think about impact:</strong> How might this statement make different people feel?
            </span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
