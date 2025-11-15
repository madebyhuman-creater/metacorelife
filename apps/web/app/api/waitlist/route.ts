import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Insert into waitlist
    const { error } = await supabase
      .from("waitlist")
      .insert([{ email: email.toLowerCase() }])

    if (error) {
      // If email already exists, that's okay
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "You're already on the waitlist!" },
          { status: 200 }
        )
      }
      throw error
    }

    // TODO: Send welcome email via Resend or similar service
    // await sendWelcomeEmail(email)

    return NextResponse.json(
      { message: "Successfully joined waitlist!" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Waitlist error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to join waitlist" },
      { status: 500 }
    )
  }
}

