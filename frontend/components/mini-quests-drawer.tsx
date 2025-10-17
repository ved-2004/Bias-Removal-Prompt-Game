"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Target, CheckCircle2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

type Quest = {
  id: string
  title: string
  description: string
  progress: number
  total: number
  completed: boolean
}

export function MiniQuestsDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "1",
      title: "Fix 3 sentences",
      description: "Help improve biased language",
      progress: 1,
      total: 3,
      completed: false,
    },
    { id: "2", title: "Reach 50 XP", description: "Earn experience points", progress: 25, total: 50, completed: false },
    {
      id: "3",
      title: "Try all AI models",
      description: "Test Claude, GPT, and Llama",
      progress: 1,
      total: 3,
      completed: false,
    },
  ])

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40"
        initial={{ x: -100 }}
        animate={{ x: isOpen ? 0 : -60 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-r-full rounded-l-none bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:from-purple-600 hover:to-pink-600 pl-4 pr-3 py-6"
        >
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <span className="font-bold">Quests</span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </div>
        </Button>
      </motion.div>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            />
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-96 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 shadow-2xl z-40 overflow-y-auto"
            >
              <div className="p-6 space-y-4">
                <div className="mb-6 text-center">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1" />
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Zap className="w-6 h-6 text-orange-500" />
                      Today's Challenges
                    </h2>
                    <div className="flex-1 flex justify-end">
                      <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                        ✕
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Daily missions to make AI fairer!</p>
                </div>

                {quests.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, type: "spring", damping: 20 }}
                  >
                    <Card
                      className={cn(
                        "p-5 border-2 transition-all hover:shadow-xl relative overflow-hidden",
                        quest.completed
                          ? "bg-white/95 border-green-400 shadow-green-200"
                          : "bg-white/90 border-transparent shadow-lg hover:scale-[1.02]",
                      )}
                      style={
                        !quest.completed
                          ? {
                              backgroundImage:
                                "linear-gradient(white, white), linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f97316 100%)",
                              backgroundOrigin: "border-box",
                              backgroundClip: "padding-box, border-box",
                            }
                          : {}
                      }
                    >
                      {quest.completed && (
                        <motion.div
                          className="absolute inset-0 bg-green-400/20 rounded-lg"
                          animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                      )}

                      <div className="flex items-start gap-4">
                        <motion.div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md",
                            quest.completed ? "bg-green-500" : "bg-gradient-to-br from-purple-500 to-pink-500",
                          )}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", damping: 10 }}
                        >
                          {quest.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : (
                            <Target className="w-6 h-6 text-white" />
                          )}
                        </motion.div>

                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-1">{quest.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{quest.description}</p>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                              <span>Progress</span>
                              <span>
                                {quest.progress}/{quest.total}
                              </span>
                            </div>
                            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(quest.progress / quest.total) * 100}%` }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.15 + 0.3 }}
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full shadow-md"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
