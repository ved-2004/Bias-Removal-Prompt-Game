"use client"

import type React from "react"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayPath, setDisplayPath] = useState(pathname)

  useEffect(() => {
    setDisplayPath(pathname)
  }, [pathname])

  const getColorForPath = (path: string) => {
    if (path.includes("/train")) return "from-purple-500/20 via-pink-500/20 to-blue-500/20"
    if (path.includes("/leaderboard")) return "from-yellow-500/20 via-orange-500/20 to-red-500/20"
    if (path.includes("/profile")) return "from-blue-500/20 via-cyan-500/20 to-teal-500/20"
    if (path.includes("/educational")) return "from-green-500/20 via-emerald-500/20 to-teal-500/20"
    if (path.includes("/settings")) return "from-gray-500/20 via-slate-500/20 to-zinc-500/20"
    return "from-purple-500/20 via-pink-500/20 to-orange-500/20"
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex-1 relative"
    >
      {/* Color fade overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`absolute inset-0 bg-gradient-to-br ${getColorForPath(pathname)} pointer-events-none z-10`}
      />
      {children}
    </motion.div>
  )
}
