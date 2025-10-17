"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Confetti from "react-confetti"
import { OnboardingComic } from "@/components/onboarding-comic"
import { CinematicBadgeReveal } from "@/components/cinematic-badge-reveal"
import { getDynamicBackgroundColor, getDynamicAccentColor } from "@/lib/dynamic-colors"
import { InteractiveTutorial } from "@/components/interactive-tutorial"
import { ParallaxBackground } from "@/components/parallax-background"
import { EmojiReactions } from "@/components/emoji-reactions"
import { MiniQuestsDrawer } from "@/components/mini-quests-drawer"
import { WhyItWorkedTooltip } from "@/components/why-it-worked-tooltip"
import { GlossaryDrawer } from "@/components/glossary-drawer"
import { CelebrationPopup } from "@/components/celebration-popup"
import { FeedbackModal } from "@/components/feedback-modal"

type Message = {
  id: string
  role: "ai" | "user"
  content: string
  biasScore?: number
  improvement?: number
}

type BiasType = "gender" | "sexual-orientation" | "age"

const biasedSentences = [
  { text: "The nurse asked the doctor if he could help with the patient.", biasType: "Gender", initialScore: 85 },
  { text: "The elderly person struggled to use the smartphone.", biasType: "Age", initialScore: 78 },
  { text: "The CEO and his wife attended the gala.", biasType: "Gender", initialScore: 82 },
  { text: "Young people are always on their phones.", biasType: "Age", initialScore: 75 },
]

export function ChatTrainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content:
        "Hi there! I'm your AI Bias Trainer. I'll show you sentences that might have bias, and you can help me learn by rewriting them to be fairer. Ready to start?",
    },
  ])
  const [input, setInput] = useState("")
  const [selectedBiasType, setSelectedBiasType] = useState<BiasType>("gender")
  const [currentSentence, setCurrentSentence] = useState(biasedSentences[0])
  const [isProcessing, setIsProcessing] = useState(false)
  const [history, setHistory] = useState<Array<{ sentence: string; improvement: number; timestamp: Date }>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState("")
  const [earnedBadge, setEarnedBadge] = useState<string | null>(null)
  const [xpGained, setXpGained] = useState(0)
  const [totalXP, setTotalXP] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("hasCompletedOnboarding")
    }
    return false
  })
  const [showWalkthrough, setShowWalkthrough] = useState(false)
  const [showBadgeReveal, setShowBadgeReveal] = useState(false)
  const [revealedBadge, setRevealedBadge] = useState<{ name: string; description: string; icon: string } | null>(null)
  const [averageBiasScore, setAverageBiasScore] = useState(80)
  const [showInteractiveTutorial, setShowInteractiveTutorial] = useState(false)
  const [showWhyItWorked, setShowWhyItWorked] = useState(false)
  const [whyItWorkedData, setWhyItWorkedData] = useState({
    before: "",
    after: "",
    explanation: "",
    highlights: [] as { word: string; reason: string }[],
  })
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackData, setFeedbackData] = useState({ explanation: "", betterVersion: "" })
  const [showCelebrationPopup, setShowCelebrationPopup] = useState(false)
  const [celebrationPopupMessage, setCelebrationPopupMessage] = useState("")
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [celebrationQueue, setCelebrationQueue] = useState<Array<"badge" | "xp" | "explanation">>([])
  const [currentCelebration, setCurrentCelebration] = useState<"badge" | "xp" | "explanation" | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Send first biased sentence
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "ai",
        content: `Here's a sentence that might have some bias:\n\n"${currentSentence.text}"\n\nBias Type: ${currentSentence.biasType}\nCurrent Bias Score: ${currentSentence.initialScore}%\n\nCan you rewrite it to make it fairer?`,
        biasScore: currentSentence.initialScore,
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }, [])

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem("hasCompletedOnboarding", "true")
    setTimeout(() => setShowInteractiveTutorial(true), 500)
  }

  const handleCompleteInteractiveTutorial = () => {
    setShowInteractiveTutorial(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput("")
    setIsProcessing(true)
    setIsEvaluating(true)

    setTimeout(() => {
      const improvement = Math.floor(Math.random() * 40) + 50 // 50-90% improvement
      const newScore = Math.max(0, currentSentence.initialScore - improvement)
      const xp = Math.floor(improvement * 1.5)
      const isCorrect = improvement > 60 // Threshold for "correct"

      setAverageBiasScore((prev) => Math.max(0, prev - improvement / 10))
      setIsEvaluating(false)

      if (isCorrect) {
        const queue: Array<"badge" | "xp" | "explanation"> = []

        // Always show celebration popup first
        setShowConfetti(true)
        setCelebrationPopupMessage("Great job! You made AI fairer today ✨")
        setShowCelebrationPopup(true)

        // Add badge to queue if earned
        if (improvement > 75) {
          queue.push("badge")
          setRevealedBadge({
            name: "Fairness Hero",
            description: "You've mastered the art of unbiased language!",
            icon: "🦸",
          })
        }

        // Add XP to queue
        queue.push("xp")
        setXpGained(xp)
        setTotalXP((prev) => prev + xp)

        // Add explanation to queue
        queue.push("explanation")
        setWhyItWorkedData({
          before: currentSentence.text,
          after: userInput,
          explanation: "You replaced gendered language with inclusive terms, removing bias assumptions.",
          highlights: [
            { word: "policeman → officer", reason: "Removed gender-specific term" },
            { word: "he → they", reason: "Used gender-neutral pronoun" },
          ],
        })

        setCelebrationQueue(queue)

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: `Excellent work! You reduced the bias by ${improvement}%! The new bias score is ${newScore}%. ${
            improvement > 75
              ? "That's amazing! You really understand how to make language more inclusive."
              : "Great job! You're getting better at spotting and fixing bias."
          }`,
          biasScore: newScore,
          improvement,
        }

        setMessages((prev) => [...prev, aiResponse])
        setHistory((prev) => [
          { sentence: currentSentence.text, improvement, timestamp: new Date() },
          ...prev.slice(0, 9),
        ])

        setTimeout(() => {
          const nextIndex = (sentenceIndex + 1) % biasedSentences.length
          setSentenceIndex(nextIndex)
          const nextSentence = biasedSentences[nextIndex]
          setCurrentSentence(nextSentence)

          const nextAiMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: "ai",
            content: `Let's try another one!\n\n"${nextSentence.text}"\n\nBias Type: ${nextSentence.biasType}\nCurrent Bias Score: ${nextSentence.initialScore}%\n\nHow would you rewrite this?`,
            biasScore: nextSentence.initialScore,
          }
          setMessages((prev) => [...prev, nextAiMessage])
          setIsProcessing(false)
        }, 8000)
      } else {
        setFeedbackData({
          explanation: "Hmm... this rewrite still implies that older people can't use technology.",
          betterVersion: "Try: 'The person learned how to use the smartphone features'",
        })
        setShowFeedbackModal(true)
        setIsProcessing(false)
      }
    }, 2000)
  }

  const handleCelebrationPopupClose = () => {
    setShowCelebrationPopup(false)
    setShowConfetti(false)

    // Start processing queue after popup closes
    if (celebrationQueue.length > 0) {
      const [next, ...rest] = celebrationQueue
      setCelebrationQueue(rest)
      setCurrentCelebration(next)

      if (next === "badge") {
        setTimeout(() => setShowBadgeReveal(true), 300)
      } else if (next === "xp") {
        // XP animation happens automatically, move to next after delay
        setTimeout(() => {
          setXpGained(0)
          processNextCelebration(rest)
        }, 2000)
      } else if (next === "explanation") {
        setTimeout(() => setShowWhyItWorked(true), 300)
      }
    }
  }

  const processNextCelebration = (queue: Array<"badge" | "xp" | "explanation">) => {
    if (queue.length > 0) {
      const [next, ...rest] = queue
      setCelebrationQueue(rest)
      setCurrentCelebration(next)

      if (next === "badge") {
        setTimeout(() => setShowBadgeReveal(true), 300)
      } else if (next === "xp") {
        setTimeout(() => {
          setXpGained(0)
          processNextCelebration(rest)
        }, 2000)
      } else if (next === "explanation") {
        setTimeout(() => setShowWhyItWorked(true), 300)
      }
    } else {
      setCurrentCelebration(null)
    }
  }

  const handleBadgeRevealClose = () => {
    setShowBadgeReveal(false)
    processNextCelebration(celebrationQueue)
  }

  const handleWhyItWorkedClose = () => {
    setShowWhyItWorked(false)
    processNextCelebration(celebrationQueue)
  }

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false)
  }

  const dynamicBg = getDynamicBackgroundColor(averageBiasScore)
  const dynamicAccent = getDynamicAccentColor(averageBiasScore)

  return (
    <>
      <CelebrationPopup
        isOpen={showCelebrationPopup}
        onClose={handleCelebrationPopupClose}
        message={celebrationPopupMessage}
      />
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackClose}
        explanation={feedbackData.explanation}
        betterVersion={feedbackData.betterVersion}
      />

      <AnimatePresence>
        {showOnboarding && <OnboardingComic onComplete={handleCompleteOnboarding} />}
        {showInteractiveTutorial && <InteractiveTutorial onComplete={handleCompleteInteractiveTutorial} />}
        {showBadgeReveal && revealedBadge && (
          <CinematicBadgeReveal badge={revealedBadge} onClose={handleBadgeRevealClose} />
        )}
      </AnimatePresence>

      <WhyItWorkedTooltip
        isOpen={showWhyItWorked}
        onClose={handleWhyItWorkedClose}
        before={whyItWorkedData.before}
        after={whyItWorkedData.after}
        explanation={whyItWorkedData.explanation}
        highlights={whyItWorkedData.highlights}
      />

      <ParallaxBackground />
      <MiniQuestsDrawer />
      <GlossaryDrawer />

      <div className="flex-1 flex relative overflow-hidden">
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
        )}

        {/* Main Chat Area - Center */}
        <motion.div
          animate={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
          className={`flex-1 flex flex-col bg-gradient-to-br ${dynamicBg} transition-colors duration-1000`}
        >
          {/* Bias Type Selector at Top */}
          <div className="px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Bias Type:</span>
              <div className="flex gap-2 bg-muted/50 p-1.5 rounded-full">
                {(
                  [
                    { value: "gender", label: "Gender" },
                    { value: "sexual-orientation", label: "Sexual Orientation" },
                    { value: "age", label: "Age" },
                  ] as const
                ).map((biasType) => (
                  <motion.button
                    key={biasType.value}
                    onClick={() => setSelectedBiasType(biasType.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-bold transition-all relative overflow-hidden",
                      selectedBiasType === biasType.value
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/80",
                    )}
                  >
                    {/* Soft glow effect for active tab */}
                    {selectedBiasType === biasType.value && (
                      <motion.div
                        layoutId="bias-type-glow"
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 blur-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {/* Gradient border for active tab */}
                    {selectedBiasType === biasType.value && (
                      <motion.div
                        layoutId="bias-type-border"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                        style={{ padding: "2px" }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      >
                        <div className="w-full h-full rounded-full bg-primary" />
                      </motion.div>
                    )}
                    <span className="relative z-10">{biasType.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-4xl mx-auto space-y-4" id="chat-area">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      type: "spring",
                      duration: 0.6,
                      bounce: 0.4,
                    }}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-5 py-4 shadow-lg transition-all hover:shadow-xl",
                        message.role === "user"
                          ? "rounded-br-sm bg-gradient-to-br from-primary to-accent text-primary-foreground"
                          : "rounded-bl-sm bg-card border-2 border-border text-card-foreground",
                        // Apply pulse animation only to user messages while evaluating
                        isEvaluating && message.role === "user" && messages[messages.length - 1].id === message.id
                          ? "message-bubble-pulsing"
                          : "",
                      )}
                    >
                      {message.role === "ai" && (
                        <div className="flex items-center gap-2 mb-2">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <Sparkles className="w-4 h-4 text-primary" />
                          </motion.div>
                          <span className="text-xs font-bold text-primary">AI Trainer</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                      {message.improvement && message.improvement > 70 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", delay: 0.2 }}
                          className="flex items-center gap-1 mt-3 bg-green-100 text-green-700 px-3 py-1.5 rounded-full"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs font-bold">Excellent improvement!</span>
                        </motion.div>
                      )}
                      {message.role === "ai" && <EmojiReactions messageId={message.id} />}

                      {message.biasScore !== undefined && message.improvement && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-green-700">New Bias Score</span>
                            <motion.span
                              initial={{ scale: 1.5 }}
                              animate={{ scale: 1 }}
                              className="text-lg font-bold text-green-700"
                            >
                              {message.biasScore}%
                            </motion.span>
                          </div>
                          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: `${currentSentence.initialScore}%` }}
                              animate={{ width: `${message.biasScore}%` }}
                              transition={{ duration: 1.5, ease: "easeInOut" }}
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area at Bottom */}
          <div className="border-t border-border bg-surface/80 backdrop-blur-sm px-6 py-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <motion.div className="flex-1 relative" whileFocus={{ scale: 1.01 }}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Rewrite the sentence to make it fair..."
                    className="w-full px-5 py-4 rounded-2xl bg-card border-2 border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                    rows={3}
                    disabled={isProcessing}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!input.trim() || isProcessing}
                    className="rounded-2xl px-8 h-[72px] font-bold shadow-xl text-primary-foreground border-0 relative overflow-hidden bg-gradient-to-r from-primary to-accent"
                  >
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="absolute inset-0 bg-white/20 blur-xl"
                    />
                    <Send className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">Send & Rescore</span>
                  </Button>
                </motion.div>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Right Panel - Bias Score & History */}
        <div className="w-80 border-l border-border bg-gradient-to-br from-surface/50 via-muted/30 to-surface/50 overflow-y-auto p-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -2 }}
            id="score-gauge"
          >
            <Card className="p-5 bg-card border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Current Challenge
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-semibold">Sentence</p>
                  <p className="text-sm text-foreground leading-relaxed">{currentSentence.text}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700">Bias Score</span>
                    <motion.span
                      key={currentSentence.initialScore}
                      initial={{ scale: 1.5, color: "#ef4444" }}
                      animate={{ scale: 1, color: "#dc2626" }}
                      className="text-sm font-bold"
                    >
                      {currentSentence.initialScore}%
                    </motion.span>
                  </div>
                  <div className="relative h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentSentence.initialScore}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                    />
                  </div>
                </div>
                <div className="inline-block px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-xs font-bold text-purple-700">
                  {currentSentence.biasType} Bias
                </div>
              </div>
            </Card>
          </motion.div>

          {/* History */}
          <div>
            <h3 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 px-1">
              Past Performance
            </h3>
            <div className="space-y-2">
              {history.length === 0 ? (
                <Card className="p-4 bg-card/70 border-2 border-dashed border-border">
                  <p className="text-xs text-muted-foreground text-center">No history yet. Start training!</p>
                </Card>
              ) : (
                history.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: -4 }}
                  >
                    <Card className="p-3 bg-card border-2 border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs text-foreground line-clamp-2 flex-1">{item.sentence}</p>
                        <div
                          className={cn(
                            "text-xs font-bold shrink-0 px-2 py-1 rounded-full",
                            item.improvement > 70
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : item.improvement > 50
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          -{item.improvement}%
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
