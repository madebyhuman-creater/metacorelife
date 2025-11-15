import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Get current click count
    const { data: product } = await supabase
      .from("products")
      .select("click_count")
      .eq("id", params.id)
      .single()

    // Increment click count
    await supabase
      .from("products")
      .update({ click_count: (product?.click_count || 0) + 1 })
      .eq("id", params.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to track click" },
      { status: 500 }
    )
  }
}

