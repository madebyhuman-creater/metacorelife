"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { useState } from "react"

export default function BuyButton({
  productId,
  affiliateLink,
}: {
  productId: string
  affiliateLink: string
}) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      // Track click
      await fetch(`/api/products/${productId}/click`, {
        method: "POST",
      })

      // Open affiliate link
      window.open(affiliateLink, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("Error tracking click:", error)
      // Still open the link even if tracking fails
      window.open(affiliateLink, "_blank", "noopener,noreferrer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button className="w-full" size="lg" onClick={handleClick} disabled={loading}>
      {loading ? "Opening..." : "Buy Now"}
      <ExternalLink className="ml-2 h-4 w-4" />
    </Button>
  )
}

