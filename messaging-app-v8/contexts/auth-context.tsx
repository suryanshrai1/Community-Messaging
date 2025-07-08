"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { ensureUserProfile } from "@/lib/profile-utils"

type AuthContextType = {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: any; message?: string }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Ensure profile exists for existing user
      if (session?.user) {
        ensureUserProfile(session.user.id, session.user.email || "")
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Ensure profile exists when user signs in
      if (session?.user && event === "SIGNED_IN") {
        ensureUserProfile(session.user.id, session.user.email || "")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        console.error("Signup error:", error)
        return { error }
      }

      // If user was created successfully, ensure their profile exists
      if (data.user) {
        await ensureUserProfile(data.user.id, data.user.email || "")
      }

      // If signup is successful but user needs to confirm email
      if (data.user && !data.session) {
        return {
          error: null,
          message: "Please check your email to confirm your account before signing in.",
        }
      }

      return { error: null }
    } catch (err) {
      console.error("Unexpected signup error:", err)
      return { error: { message: "An unexpected error occurred during signup" } }
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
