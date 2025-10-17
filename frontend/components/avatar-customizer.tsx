"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Palette } from "lucide-react"

const avatarOptions = [
  { id: "1", initials: "YO", gradient: "from-purple-500 to-pink-500" },
  { id: "2", initials: "AB", gradient: "from-blue-500 to-cyan-500" },
  { id: "3", initials: "CD", gradient: "from-green-500 to-emerald-500" },
  { id: "4", initials: "EF", gradient: "from-orange-500 to-red-500" },
  { id: "5", initials: "GH", gradient: "from-yellow-500 to-orange-500" },
  { id: "6", initials: "IJ", gradient: "from-pink-500 to-rose-500" },
  { id: "7", initials: "KL", gradient: "from-indigo-500 to-purple-500" },
  { id: "8", initials: "MN", gradient: "from-teal-500 to-cyan-500" },
]

export function AvatarCustomizer() {
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("userAvatar")
    const savedGradient = localStorage.getItem("userAvatarGradient")
    if (saved && savedGradient) {
      const found = avatarOptions.find((a) => a.initials === saved)
      if (found) setSelectedAvatar(found)
    }
  }, [])

  const handleSelectAvatar = (avatar: (typeof avatarOptions)[0]) => {
    setSelectedAvatar(avatar)
    localStorage.setItem("userAvatar", avatar.initials)
    localStorage.setItem("userAvatarGradient", avatar.gradient)
    // Trigger a custom event to notify other components
    window.dispatchEvent(new Event("avatarChanged"))
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 hover:scale-110 transition-all"
        >
          <Palette className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Customize Your Avatar
          </SheetTitle>
          <p className="text-sm text-gray-600">Choose your favorite style!</p>
        </SheetHeader>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {avatarOptions.map((avatar, index) => (
            <motion.button
              key={avatar.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectAvatar(avatar)}
              className={`p-6 rounded-2xl border-4 transition-all ${
                selectedAvatar.id === avatar.id
                  ? "border-purple-500 bg-white shadow-xl"
                  : "border-transparent bg-white/50 hover:bg-white hover:shadow-lg"
              }`}
            >
              <Avatar className="w-20 h-20 mx-auto mb-3">
                <AvatarFallback className={`bg-gradient-to-br ${avatar.gradient} text-white text-2xl font-bold`}>
                  {avatar.initials}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-bold text-gray-700">{avatar.initials}</p>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-2">✨ Pro Tip</p>
          <p className="text-sm text-gray-700">
            Your avatar will appear in celebrations and on the leaderboard. Choose one that represents you!
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
