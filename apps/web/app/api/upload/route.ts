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

    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string || "uploads"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Determine file type
    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")
    const mediaType = isImage ? "image" : isVideo ? "video" : "none"

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage (you'll need to set up a storage bucket)
    // For now, we'll return a placeholder URL
    // In production, use Supabase Storage:
    // const { data, error } = await supabase.storage
    //   .from('uploads')
    //   .upload(fileName, file)

    // Placeholder: Return a data URL or use a CDN
    // For production, implement actual file upload to Supabase Storage
    const url = `https://placeholder.com/${fileName}`

    return NextResponse.json({
      url,
      type: mediaType,
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    )
  }
}

