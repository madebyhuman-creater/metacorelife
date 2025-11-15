"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function FollowButton({
  profileId,
  isFollowing: initialIsFollowing,
}: {
  profileId: string
  isFollowing: boolean
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleFollow = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/profile/${profileId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to update follow status")
      }

      setIsFollowing(!isFollowing)
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing
          ? "You've unfollowed this user"
          : "You're now following this user",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleFollow}
      variant={isFollowing ? "outline" : "default"}
      disabled={loading}
    >
      {isFollowing ? (
        <>
          <UserMinus className="mr-2 h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  )
}

