import { Sidebar } from "@/components/sidebar"
import { EducationalContent } from "@/components/educational-content"

export default function EducationalPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <EducationalContent />
      </main>
    </div>
  )
}
