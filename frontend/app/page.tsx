import { Sidebar } from "@/components/sidebar"
import { HistoryPanel } from "@/components/history-panel"
import { TrainingInterface } from "@/components/training-interface"

export default function HomePage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <TrainingInterface />
      </main>
      <HistoryPanel />
    </div>
  )
}
