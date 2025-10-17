import { Sidebar } from "@/components/sidebar"
import { ProfileContent } from "@/components/profile-content"

export default function ProfilePage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ProfileContent />
      </main>
    </div>
  )
}
