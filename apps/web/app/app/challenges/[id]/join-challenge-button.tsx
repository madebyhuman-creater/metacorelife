"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function JoinChallengeButton({ challengeId }: { challengeId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleJoin = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/challenges/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to join challenge")
      }

      toast({
        title: "Challenge joined!",
        description: "You've successfully joined this challenge.",
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
    <Button onClick={handleJoin} className="w-full" disabled={loading}>
      {loading ? "Joining..." : "Join Challenge"}
    </Button>
  )
}

