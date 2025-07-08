"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthForm } from "@/components/auth-form"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (user) {
    return null
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <AuthForm mode="login" />
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}
