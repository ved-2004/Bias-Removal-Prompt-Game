import { Sidebar } from "@/components/sidebar"
import { ChatTrainer } from "@/components/chat-trainer"

export default function TrainPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <ChatTrainer />
    </div>
  )
}
