"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Brain, Trophy, Settings, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const navItems = [
  { href: "/train", label: "Chat Trainer", icon: Brain },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, id: "leaderboard-link" },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    toast({
      title: "Signed out successfully!",
      description: "See you next time!",
    })
    router.push("/auth")
  }

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg"
        >
          <Brain className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">AI Bias Trainer</h1>
          <p className="text-xs text-muted-foreground">For Kids</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                id={item.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 relative overflow-hidden group",
                  "focus:outline-none focus:ring-4 focus:ring-purple-400/50",
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-sidebar-accent-foreground shadow-md"
                    : "text-sidebar-foreground/70 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:text-sidebar-foreground hover:shadow-sm",
                )}
              >
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-pink-400/20 to-purple-400/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />

                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10"
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className="font-medium relative z-10">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-2 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      <motion.button
        onClick={handleSignOut}
        whileHover={{ scale: 1.05, x: 4 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-purple-500/20 hover:text-sidebar-foreground transition-all duration-300 mt-4 border border-sidebar-border hover:border-orange-500/50 hover:shadow-lg relative overflow-hidden group focus:outline-none focus:ring-4 focus:ring-orange-400/50"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-purple-400/20 to-orange-400/0"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }} className="relative z-10">
          <LogOut className="w-5 h-5" />
        </motion.div>
        <span className="font-medium relative z-10">Sign Out</span>
      </motion.button>
    </aside>
  )
}
