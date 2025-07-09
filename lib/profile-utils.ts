import { supabase } from "./supabase"

export async function ensureUserProfile(userId: string, email: string) {
  try {
    // Check if profile exists
    const { data: existingProfile, error: selectError } = await supabase
      .from("profiles")
      .select("id, display_name")
      .eq("id", userId)
      .single()

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error checking profile:", selectError)
      return false
    }

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const defaultDisplayName = email?.split("@")[0] || "User"
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: userId,
          email: email,
          display_name: defaultDisplayName,
        },
      ])

      if (insertError) {
        console.error("Error creating profile:", insertError)
        return false
      }

      console.log("Profile created successfully")
      return true
    }

    // Profile exists, check if display_name needs to be set
    if (!existingProfile.display_name) {
      const defaultDisplayName = email?.split("@")[0] || "User"
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ display_name: defaultDisplayName })
        .eq("id", userId)

      if (updateError) {
        console.error("Error updating profile display name:", updateError)
      }
    }

    return true
  } catch (error) {
    console.error("Unexpected error in ensureUserProfile:", error)
    return false
  }
}
