"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { User, Save } from "lucide-react"

export function ProfileForm() {
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase.from("profiles").select("display_name, email").eq("id", user.id).single()

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === "PGRST116") {
          const defaultDisplayName = user.email?.split("@")[0] || "User"
          const { error: insertError } = await supabase.from("profiles").insert([
            {
              id: user.id,
              email: user.email,
              display_name: defaultDisplayName,
            },
          ])

          if (insertError) {
            console.error("Error creating profile:", insertError)
            setError("Failed to create profile")
          } else {
            setDisplayName(defaultDisplayName)
          }
        } else {
          throw error
        }
      } else {
        setDisplayName(data.display_name || data.email?.split("@")[0] || "User")
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err)
      setError("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !displayName.trim()) return

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await supabase.from("profiles").update({ display_name: displayName.trim() }).eq("id", user.id)

      if (error) throw error

      setSuccess("Profile updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      console.error("Error updating profile:", err)
      setError(err.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">Loading profile...</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email (cannot be changed)</Label>
            <Input id="email" type="email" value={user?.email || ""} disabled className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              maxLength={50}
              required
            />
            <p className="text-sm text-gray-500">This name will be shown on your messages to the community</p>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}

          <Button type="submit" disabled={saving || !displayName.trim()} className="w-full">
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
