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

    if (user.id === params.id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("follows")
      .insert([{ follower_id: user.id, following_id: params.id }])

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ message: "Already following" }, { status: 200 })
      }
      throw error
    }

    return NextResponse.json({ message: "Following" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to follow" },
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
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", params.id)

    if (error) throw error

    return NextResponse.json({ message: "Unfollowed" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to unfollow" },
      { status: 500 }
    )
  }
}

