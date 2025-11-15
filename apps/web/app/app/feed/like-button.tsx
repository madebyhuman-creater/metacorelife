"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default function LikeButton({
  postId,
  isLiked: initialIsLiked,
  likesCount: initialLikesCount,
}: {
  postId: string
  isLiked: boolean
  likesCount: number
}) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (loading) return
    setLoading(true)

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? "DELETE" : "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to like post")
      }

      setIsLiked(!isLiked)
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    } catch (error) {
      console.error("Like error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={loading}
    >
      <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
      {likesCount}
    </Button>
  )
}

