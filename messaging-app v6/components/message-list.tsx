"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { supabase, type Message } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

type MessageListProps = {
  userId?: string
  title: string
  refreshTrigger?: number
}

export function MessageList({ userId, title, refreshTrigger }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    try {
      let query = supabase
        .from("messages")
        .select(`
          *,
          profiles (
            email
          )
        `)
        .order("created_at", { ascending: false })

      if (userId) {
        query = query.eq("user_id", userId)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching messages:", error)
        // Try without profiles join if it fails
        const simpleQuery = supabase.from("messages").select("*").order("created_at", { ascending: false })

        if (userId) {
          simpleQuery.eq("user_id", userId)
        }

        const { data: simpleData, error: simpleError } = await simpleQuery
        if (simpleError) throw simpleError

        setMessages(simpleData || [])
      } else {
        setMessages(data || [])
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
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
          {messages.map((message) => (
            <Card key={message.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-600">{message.profiles?.email || "Anonymous"}</span>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-800">{message.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
