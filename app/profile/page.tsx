"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your profile information and display preferences</p>
      </div>

      <ProfileForm />
    </div>
  )
}
