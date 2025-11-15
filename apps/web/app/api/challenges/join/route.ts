import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { challengeId } = await request.json()

    if (!challengeId) {
      return NextResponse.json(
        { error: "Challenge ID is required" },
        { status: 400 }
      )
    }

    // Check if user already joined
    const { data: existing } = await supabase
      .from("user_challenges")
      .select("id")
      .eq("user_id", user.id)
      .eq("challenge_id", challengeId)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "You've already joined this challenge" },
        { status: 400 }
      )
    }

    // Join challenge
    const { error } = await supabase
      .from("user_challenges")
      .insert([
        {
          user_id: user.id,
          challenge_id: challengeId,
          current_day: 1,
          streak_days: 0,
        },
      ])

    if (error) throw error

    return NextResponse.json(
      { message: "Successfully joined challenge" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Join challenge error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to join challenge" },
      { status: 500 }
    )
  }
}

