import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from("post_likes")
      .insert([{ post_id: params.id, user_id: user.id }])

    if (error) {
      if (error.code === "23505") {
        // Already liked
        return NextResponse.json({ message: "Already liked" }, { status: 200 })
      }
      throw error
    }

    return NextResponse.json({ message: "Liked" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to like post" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", params.id)
      .eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ message: "Unliked" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to unlike post" },
      { status: 500 }
    )
  }
}

