"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Palette, Shield, User, Volume2, PlayCircle, Accessibility } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function SettingsContent() {
  const [notifications, setNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [dailyReminders, setDailyReminders] = useState(true)
  const [achievementAlerts, setAchievementAlerts] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark"
    }
    return "dark"
  })
  const { toast } = useToast()

  const handleReplayTutorial = () => {
    localStorage.removeItem("hasCompletedOnboarding")
    localStorage.removeItem("onboarding-completed") // Remove old key for backwards compatibility
    console.log("[v0] Tutorial flags reset")
    toast({
      title: "Tutorial Reset!",
      description: "Refresh the page to restart the tutorial.",
    })
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }

  const handleReducedMotionChange = (checked: boolean) => {
    setReducedMotion(checked)
    if (checked) {
      document.documentElement.style.setProperty("--animation-duration", "0.01ms")
      toast({
        title: "Reduced Motion Enabled",
        description: "Animations have been minimized for better accessibility.",
      })
    } else {
      document.documentElement.style.removeProperty("--animation-duration")
      toast({
        title: "Reduced Motion Disabled",
        description: "Full animations are now enabled.",
      })
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    // Apply theme immediately
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      // Auto mode - check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    toast({
      title: "Theme Updated!",
      description: `Switched to ${newTheme} mode.`,
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">Customize your learning experience</p>
      </motion.div>

      {/* Account Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-6 bg-card border-border shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Account Settings
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="Young Activist" className="focus:ring-4 focus:ring-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="youngactivist@example.com"
                className="focus:ring-4 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age Group</Label>
              <Select defaultValue="10-12">
                <SelectTrigger id="age" className="focus:ring-4 focus:ring-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8-9">8-9 years</SelectItem>
                  <SelectItem value="10-12">10-12 years</SelectItem>
                  <SelectItem value="13-15">13-15 years</SelectItem>
                  <SelectItem value="16+">16+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground focus:ring-4 focus:ring-primary/50">
                Save Changes
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Tutorial */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6 bg-secondary/10 border-secondary/20 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-secondary" />
            Tutorial
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Want to see the welcome tutorial again? Click below to replay it.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleReplayTutorial}
                className="bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-secondary-foreground focus:ring-4 focus:ring-secondary/50"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Replay Tutorial
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-6 bg-card border-border shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your progress</p>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="daily-reminders">Daily Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded to practice daily</p>
              </div>
              <Switch id="daily-reminders" checked={dailyReminders} onCheckedChange={setDailyReminders} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when you unlock achievements</p>
              </div>
              <Switch id="achievement-alerts" checked={achievementAlerts} onCheckedChange={setAchievementAlerts} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Accessibility Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-6 bg-accent/10 border-accent/20 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-accent" />
            Accessibility
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion">Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">Minimize animations for better focus</p>
              </div>
              <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={handleReducedMotionChange} />
            </div>
            <p className="text-xs text-muted-foreground bg-accent/10 p-3 rounded-lg">
              💡 Tip: This setting helps reduce distractions and is great for users who are sensitive to motion.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Appearance Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="p-6 bg-card border-border shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Appearance
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "light", label: "Light", colors: "bg-white border-gray-300" },
                  { value: "dark", label: "Dark", colors: "bg-gray-900 border-gray-700" },
                  { value: "auto", label: "Auto", colors: "bg-gradient-to-r from-white to-gray-900 border-gray-500" },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all",
                      theme === option.value
                        ? "border-primary ring-4 ring-primary/20"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div className={cn("w-full h-12 rounded mb-2", option.colors)} />
                    <p className="text-sm font-bold text-foreground">{option.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="difficulty" className="focus:ring-4 focus:ring-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Sound Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="p-6 bg-card border-border shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            Sound
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound-effects">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play sounds for actions and achievements</p>
              </div>
              <Switch id="sound-effects" checked={soundEffects} onCheckedChange={setSoundEffects} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="p-6 bg-card border-border shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Privacy & Safety
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-profile">Show Profile on Leaderboard</Label>
                <p className="text-sm text-muted-foreground">Let others see your username and stats</p>
              </div>
              <Switch id="show-profile" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-collection">Allow Anonymous Data Collection</Label>
                <p className="text-sm text-muted-foreground">Help us improve the app</p>
              </div>
              <Switch id="data-collection" defaultChecked />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card className="p-6 bg-destructive/10 border-destructive/30 shadow-lg">
          <h3 className="text-lg font-bold text-destructive mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent focus:ring-4 focus:ring-destructive/50"
              >
                Reset All Progress
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent focus:ring-4 focus:ring-destructive/50"
              >
                Delete Account
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
