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

    const { title, description, category, duration_days, daily_tasks, is_featured } = await request.json()

    if (!title || !description || !category || !duration_days) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (duration_days < 7 || duration_days > 30) {
      return NextResponse.json(
        { error: "Duration must be between 7 and 30 days" },
        { status: 400 }
      )
    }

    // Check if user is admin (simple email check for now)
    // In production, add is_admin field to profiles table
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    const userEmail = user.email?.toLowerCase()
    
    if (!adminEmails.includes(userEmail || '')) {
      return NextResponse.json(
        { error: "Only admins can create challenges" },
        { status: 403 }
      )
    }

    // Create challenge
    const { data: challenge, error } = await supabase
      .from("challenges")
      .insert([
        {
          title,
          description,
          category,
          duration_days,
          daily_tasks: daily_tasks || [],
          is_featured: is_featured || false,
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { challenge },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Create challenge error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create challenge" },
      { status: 500 }
    )
  }
}

