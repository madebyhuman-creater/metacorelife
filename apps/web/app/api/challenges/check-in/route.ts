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

    const { userChallengeId, dayNumber, content, mediaUrl, mediaType } = await request.json()

    if (!userChallengeId || !dayNumber) {
      return NextResponse.json(
        { error: "User challenge ID and day number are required" },
        { status: 400 }
      )
    }

    // Verify user owns this challenge
    const { data: userChallenge, error: fetchError } = await supabase
      .from("user_challenges")
      .select("*")
      .eq("id", userChallengeId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !userChallenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      )
    }

    // Create check-in
    const { error: checkInError } = await supabase
      .from("challenge_check_ins")
      .insert([
        {
          user_challenge_id: userChallengeId,
          day_number: dayNumber,
          content: content || null,
          media_url: mediaUrl || null,
          media_type: mediaType || "none",
        },
      ])

    if (checkInError) throw checkInError

    // Get challenge duration
    const { data: challenge } = await supabase
      .from("challenges")
      .select("duration_days")
      .eq("id", userChallenge.challenge_id)
      .single()

    // Update user challenge progress
    const newCurrentDay = Math.min(dayNumber + 1, (challenge?.duration_days || 30) + 1)
    const newStreakDays = userChallenge.streak_days + 1
    const isCompleted = newCurrentDay > (challenge?.duration_days || 30)

    const updateData: any = {
      current_day: newCurrentDay,
      streak_days: newStreakDays,
      last_check_in: new Date().toISOString(),
    }

    if (isCompleted) {
      updateData.is_completed = true
      updateData.completed_at = new Date().toISOString()

      // Update user's completed challenges count
      const { data: profile } = await supabase
        .from("profiles")
        .select("challenges_completed")
        .eq("id", user.id)
        .single()

      await supabase
        .from("profiles")
        .update({ challenges_completed: (profile?.challenges_completed || 0) + 1 })
        .eq("id", user.id)

      // Create completion post
      await supabase.from("posts").insert([
        {
          user_id: user.id,
          challenge_id: userChallenge.challenge_id,
          user_challenge_id: userChallengeId,
          is_completion_post: true,
          content: `Just completed the challenge! 🎉`,
        },
      ])
    }

    const { error: updateError } = await supabase
      .from("user_challenges")
      .update(updateData)
      .eq("id", userChallengeId)

    if (updateError) throw updateError

    return NextResponse.json(
      { message: "Check-in submitted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Check-in error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit check-in" },
      { status: 500 }
    )
  }
}

