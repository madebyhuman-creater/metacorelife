"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Image as ImageIcon } from "lucide-react"

export default function CheckInForm({
  userChallengeId,
  dayNumber,
}: {
  userChallengeId: string
  dayNumber: number
}) {
  const [content, setContent] = useState("")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let mediaUrl = null
      let mediaType: "image" | "video" | "none" = "none"

      // Upload media if provided
      if (mediaFile) {
        const formData = new FormData()
        formData.append("file", mediaFile)
        formData.append("folder", "check-ins")

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload media")
        }

        const { url, type } = await uploadResponse.json()
        mediaUrl = url
        mediaType = type
      }

      // Create check-in
      const response = await fetch("/api/challenges/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userChallengeId,
          dayNumber,
          content,
          mediaUrl,
          mediaType,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit check-in")
      }

      toast({
        title: "Check-in submitted!",
        description: "Great job on completing day " + dayNumber + "!",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="content" className="text-sm font-medium mb-2 block">
          How did it go today?
        </label>
        <textarea
          id="content"
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your progress, thoughts, or achievements..."
        />
      </div>

      <div>
        <label htmlFor="media" className="text-sm font-medium mb-2 block">
          Add Photo or Video (Optional)
        </label>
        <div className="flex items-center gap-2">
          <label
            htmlFor="media"
            className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent"
          >
            <ImageIcon className="h-4 w-4" />
            {mediaFile ? mediaFile.name : "Choose file"}
          </label>
          <input
            id="media"
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
          />
          {mediaFile && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMediaFile(null)}
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit Check-In"}
      </Button>
    </form>
  )
}

