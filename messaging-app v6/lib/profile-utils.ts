import { supabase } from "./supabase"

export async function ensureUserProfile(userId: string, email: string) {
  try {
    // Check if profile exists
    const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", userId).single()

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const { error } = await supabase.from("profiles").insert([
        {
          id: userId,
          email: email,
        },
      ])

      if (error) {
        console.error("Error creating profile:", error)
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error ensuring user profile:", error)
    return false
  }
}
