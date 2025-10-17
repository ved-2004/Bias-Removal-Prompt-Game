"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Brain, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  const [loading, setLoading] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)
  }, [])

  const handleGoogleSignIn = async () => {
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Welcome!",
      description: "Successfully signed in. Let's start training AI!",
    })
    router.push("/train")
    setLoading(false)
  }

  return (
    <div className="flex h-screen">
      {/* Left Side - Auth Card (45%) */}
      <div className="w-[45%] flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-xl relative overflow-hidden">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-100/30 via-purple-100/30 to-blue-100/30 rounded-xl" />

            <CardHeader className="space-y-4 text-center pb-4 relative z-10">
              <motion.div
                animate={
                  reducedMotion
                    ? {}
                    : {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }
                }
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-400 via-purple-400 to-blue-400 flex items-center justify-center shadow-xl"
              >
                <Brain className="w-10 h-10 text-white" />
              </motion.div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-gray-900">AI Bias Trainer for Kids</CardTitle>
                <CardDescription className="text-base text-gray-700 font-semibold">
                  Let's make AI fair — one sentence at a time!
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-2 relative z-10">
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400/70"
                  style={{
                    boxShadow: "0 0 30px rgba(6, 182, 212, 0.4), 0 0 60px rgba(99, 102, 241, 0.3)",
                  }}
                >
                  {!reducedMotion && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{
                        x: ["-200%", "200%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  )}

                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 opacity-0 group-hover:opacity-60 blur-xl"
                    animate={
                      reducedMotion
                        ? {}
                        : {
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }
                    }
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-white font-semibold">
                      {loading ? "Signing you in..." : "Continue with Google"}
                    </span>
                  </span>
                </Button>
              </motion.div>

              <div className="flex items-center gap-2 text-sm text-gray-700 font-medium justify-center">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>Join thousands of kids making AI better!</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Side - Animated Gradient Background (55%) */}
      <div className="w-[55%] relative overflow-hidden bg-gradient-to-br from-cyan-100 via-purple-100 to-sky-100">
        {!reducedMotion ? (
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(135deg, rgba(103, 232, 249, 0.5) 0%, rgba(196, 181, 253, 0.5) 50%, rgba(125, 211, 252, 0.5) 100%)",
                "linear-gradient(135deg, rgba(125, 211, 252, 0.5) 0%, rgba(103, 232, 249, 0.5) 50%, rgba(196, 181, 253, 0.5) 100%)",
                "linear-gradient(135deg, rgba(196, 181, 253, 0.5) 0%, rgba(125, 211, 252, 0.5) 50%, rgba(103, 232, 249, 0.5) 100%)",
                "linear-gradient(135deg, rgba(103, 232, 249, 0.5) 0%, rgba(196, 181, 253, 0.5) 50%, rgba(125, 211, 252, 0.5) 100%)",
              ],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(103, 232, 249, 0.5) 0%, rgba(196, 181, 253, 0.5) 50%, rgba(125, 211, 252, 0.5) 100%)",
            }}
          />
        )}

        {!reducedMotion &&
          [...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full blur-sm"
              style={{
                left: `${5 + i * 6}%`,
                top: `${10 + (i % 6) * 15}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, 30, 0],
                scale: [0, 1.5, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={
              reducedMotion
                ? {}
                : {
                    y: [0, -20, 0],
                    rotate: [0, 3, -3, 0],
                    scale: [1, 1.03, 1],
                  }
            }
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="text-white/8 text-[14rem] font-bold select-none"
          >
            AI
          </motion.div>
        </div>

        {/* Floating Circles */}
        {!reducedMotion &&
          [...Array(8)].map((_, i) => (
            <motion.div
              key={`circle-${i}`}
              className="absolute rounded-full bg-gradient-to-br from-cyan-300/15 to-purple-300/15 backdrop-blur-sm"
              style={{
                width: `${50 + i * 25}px`,
                height: `${50 + i * 25}px`,
                left: `${10 + i * 12}%`,
                top: `${20 + i * 10}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
      </div>
    </div>
  )
}
