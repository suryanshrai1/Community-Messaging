"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { ensureUserProfile } from "@/lib/profile-utils"

type MessageFormProps = {
  onMessageSubmitted?: () => void
}

export function MessageForm({ onMessageSubmitted }: MessageFormProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim()) return

    if (content.length > 250) {
      setError("Message must be 250 characters or less")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Ensure profile exists before posting message
      const profileExists = await ensureUserProfile(user.id, user.email || "")
      if (!profileExists) {
        throw new Error("Failed to create or verify user profile")
      }

      // Insert the message
      const { error } = await supabase.from("messages").insert([
        {
          user_id: user.id,
          content: content.trim(),
        },
      ])

      if (error) throw error

      setContent("")
      onMessageSubmitted?.()

      // Add to blockchain if available
      if (typeof window !== "undefined") {
        try {
          await fetch("/api/blockchain/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: content.trim() }),
          })
        } catch (blockchainError) {
          console.log("Blockchain not available:", blockchainError)
        }
      }
    } catch (err: any) {
      console.error("Message submission error:", err)
      setError(err.message || "Failed to submit message")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share a Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? (max 250 characters)"
              maxLength={250}
              rows={3}
            />
            <div className="text-sm text-gray-500 mt-1">{content.length}/250 characters</div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" disabled={loading || !content.trim()}>
            {loading ? "Posting..." : "Post Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
