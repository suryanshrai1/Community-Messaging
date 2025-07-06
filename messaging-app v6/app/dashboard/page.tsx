"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MessageForm } from "@/components/message-form"
import { MessageList } from "@/components/message-list"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!user) {
    return null
  }

  const handleMessageSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.email}!</p>
      </div>

      <MessageForm onMessageSubmitted={handleMessageSubmitted} />

      <MessageList userId={user.id} title="My Messages" refreshTrigger={refreshTrigger} />
    </div>
  )
}
