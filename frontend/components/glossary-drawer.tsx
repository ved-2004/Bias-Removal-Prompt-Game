"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type GlossaryTerm = {
  term: string
  icon: string
  definition: string
  details: string
  example: string
  emoji: string
  didYouKnow: string
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Bias",
    icon: "⚖️",
    definition: "An unfair preference toward or against something",
    details:
      "Bias happens when we make assumptions about people based on stereotypes rather than facts. In AI, bias can make systems treat people unfairly.",
    example: "Assuming all doctors are men is a gender bias.",
    emoji: "🤔",
    didYouKnow:
      "AI systems can inherit biases from the data they're trained on, which is why human feedback is crucial!",
  },
  {
    term: "Stereotype",
    icon: "👥",
    definition: "An oversimplified belief about a group of people",
    details:
      "Stereotypes are generalizations that ignore individual differences. They can be harmful because they don't recognize that everyone is unique.",
    example: "Thinking all elderly people struggle with technology is a stereotype.",
    emoji: "🙅",
    didYouKnow:
      "Stereotypes form in our brains as mental shortcuts, but they often lead to unfair judgments about individuals.",
  },
  {
    term: "Fairness",
    icon: "⚖️",
    definition: "Treating everyone equally without prejudice",
    details:
      "Fairness means giving everyone the same opportunities and respect, regardless of their background, identity, or characteristics.",
    example: "Using 'they' instead of assuming gender pronouns promotes fairness.",
    emoji: "✨",
    didYouKnow: "Fairness in AI isn't just about equal treatment—it's about equitable outcomes for all groups.",
  },
  {
    term: "Inclusive Language",
    icon: "💬",
    definition: "Words that don't exclude or marginalize anyone",
    details:
      "Inclusive language respects all people by avoiding assumptions and using terms that welcome everyone, regardless of their identity.",
    example: "Using 'firefighter' instead of 'fireman' is more inclusive.",
    emoji: "🌈",
    didYouKnow: "Language shapes how we think—using inclusive terms can actually reduce unconscious bias over time!",
  },
]

export function GlossaryDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % glossaryTerms.length)
    setExpandedTerm(null)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + glossaryTerms.length) % glossaryTerms.length)
    setExpandedTerm(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setExpandedTerm(null)
  }

  return (
    <>
      {/* Glossary Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 rounded-full shadow-lg bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 hover:opacity-90 hover:scale-110 transition-all z-30"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Glossary
      </Button>

      {/* Full-Page Glossary Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Blurred Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-40"
              onClick={handleClose}
            />

            {/* Full-Page Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
            >
              <div className="w-full max-w-5xl h-full max-h-[90vh] overflow-hidden pointer-events-auto">
                {/* Gradient Background Container */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 shadow-2xl border-2 border-border">
                  {/* Animated Gradient Background */}
                  <motion.div
                    animate={{
                      background: [
                        "radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 100% 100%, hsl(var(--accent) / 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 0% 100%, hsl(var(--secondary) / 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 100% 0%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
                      ],
                    }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute inset-0"
                  />

                  {/* Content Container */}
                  <div className="relative z-10 w-full h-full flex flex-col bg-card/50 backdrop-blur-sm">
                    {/* Header */}
                    <div className="px-6 md:px-8 py-6 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                            Bias Glossary
                          </h2>
                          <p className="text-sm md:text-base text-muted-foreground mt-1">
                            Learn key terms about fairness and AI
                          </p>
                        </div>
                        <Button
                          onClick={handleClose}
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-muted"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8">
                      <div className="max-w-3xl mx-auto">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                          >
                            <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
                              <Card className="rounded-3xl p-8 md:p-10 shadow-xl border-2 border-border bg-card hover:shadow-2xl transition-shadow">
                                {/* Icon and Title */}
                                <div className="flex items-center gap-4 mb-6">
                                  <motion.div
                                    className="text-6xl md:text-7xl"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                  >
                                    {glossaryTerms[currentIndex].icon}
                                  </motion.div>
                                  <h3 className="text-3xl md:text-4xl font-bold text-card-foreground">
                                    {glossaryTerms[currentIndex].term}
                                  </h3>
                                </div>

                                {/* Definition */}
                                <p className="text-lg md:text-xl leading-relaxed text-card-foreground font-semibold mb-6">
                                  {glossaryTerms[currentIndex].definition}
                                </p>

                                {/* Details */}
                                <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6">
                                  {glossaryTerms[currentIndex].details}
                                </p>

                                {/* Example */}
                                <div className="p-5 bg-accent/10 rounded-2xl border-2 border-accent/20 mb-6">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-3xl">{glossaryTerms[currentIndex].emoji}</span>
                                    <p className="text-sm font-bold text-accent-foreground">Example:</p>
                                  </div>
                                  <p className="text-base md:text-lg leading-relaxed text-card-foreground">
                                    {glossaryTerms[currentIndex].example}
                                  </p>
                                </div>

                                {/* Did You Know? */}
                                <div className="p-5 bg-primary/10 rounded-2xl border-2 border-primary/20">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl">💡</span>
                                    <p className="text-sm font-bold text-primary">Did You Know?</p>
                                  </div>
                                  <p className="text-base md:text-lg leading-relaxed text-card-foreground">
                                    {glossaryTerms[currentIndex].didYouKnow}
                                  </p>
                                </div>
                              </Card>
                            </motion.div>
                          </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8">
                          <Button
                            onClick={handlePrev}
                            variant="outline"
                            size="lg"
                            className="rounded-2xl hover:bg-accent hover:text-accent-foreground transition-all bg-card shadow-md"
                          >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Previous
                          </Button>

                          {/* Progress Dots */}
                          <div className="flex justify-center gap-3">
                            {glossaryTerms.map((_, index) => (
                              <motion.button
                                key={index}
                                onClick={() => {
                                  setCurrentIndex(index)
                                  setExpandedTerm(null)
                                }}
                                className={cn(
                                  "rounded-full transition-all",
                                  index === currentIndex
                                    ? "w-10 h-3 bg-primary"
                                    : "w-3 h-3 bg-muted hover:bg-muted-foreground/50",
                                )}
                                animate={{ scale: index === currentIndex ? 1 : 0.8 }}
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.2 }}
                              />
                            ))}
                          </div>

                          <Button
                            onClick={handleNext}
                            variant="outline"
                            size="lg"
                            className="rounded-2xl hover:bg-accent hover:text-accent-foreground transition-all bg-card shadow-md"
                          >
                            Next
                            <ChevronRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Back to Chat Floating Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <Button
                onClick={handleClose}
                size="lg"
                className="rounded-full shadow-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 hover:opacity-90 hover:scale-110 transition-all px-6 py-6"
              >
                <X className="w-5 h-5 mr-2" />
                Back to Chat
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
