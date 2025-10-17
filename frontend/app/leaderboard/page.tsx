import { Sidebar } from "@/components/sidebar"
import { LeaderboardContent } from "@/components/leaderboard-content"

export default function LeaderboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <LeaderboardContent />
      </main>
    </div>
  )
}
