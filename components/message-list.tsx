"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

type MessageWithProfile = {
  id: string
  user_id: string
  content: string
  created_at: string
  display_name?: string
  email?: string
}

type MessageListProps = {
  userId?: string
  title: string
  refreshTrigger?: number
}

export function MessageList({ userId, title, refreshTrigger }: MessageListProps) {
  const [messages, setMessages] = useState<MessageWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    try {
      // Step 1: Fetch messages
      let messageQuery = supabase.from("messages").select("*").order("created_at", { ascending: false })

      if (userId) {
        messageQuery = messageQuery.eq("user_id", userId)
      }

      const { data: messagesData, error: messagesError } = await messageQuery

      if (messagesError) {
        console.error("Error fetching messages:", messagesError)
        setMessages([])
        return
      }

      if (!messagesData || messagesData.length === 0) {
        setMessages([])
        return
      }

      // Step 2: Get unique user IDs from messages
      const userIds = [...new Set(messagesData.map((msg) => msg.user_id))]

      // Step 3: Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, display_name")
        .in("id", userIds)

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError)
        // Use messages without profile data
        const messagesWithoutProfiles = messagesData.map((msg) => ({
          ...msg,
          display_name: "Anonymous",
          email: "",
        }))
        setMessages(messagesWithoutProfiles)
        return
      }

      // Step 4: Combine messages with profile data
      const messagesWithProfiles = messagesData.map((message) => {
        const profile = profilesData?.find((p) => p.id === message.user_id)
        return {
          ...message,
          display_name: profile?.display_name || profile?.email?.split("@")[0] || "Anonymous",
          email: profile?.email || "",
        }
      })

      setMessages(messagesWithProfiles)
    } catch (error) {
      console.error("Unexpected error fetching messages:", error)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [userId, refreshTrigger])

  if (loading) {
    return <div className="text-center py-8">Loading messages...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No messages yet. Be the first to share something!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => {
            const displayName = message.display_name || "Anonymous"
            const avatarLetter = displayName.charAt(0).toUpperCase()

            return (
              <Card key={message.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{avatarLetter}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{displayName}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-800">{message.content}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
