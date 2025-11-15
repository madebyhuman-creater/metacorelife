"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to join waitlist")
      }

      setSubmitted(true)
      toast({
        title: "You're on the list!",
        description: "We'll notify you when MetaCore Life launches.",
      })
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Transform Your Life with <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">MetaCore Life</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto">
              Join thousands of people improving their Health, Wealth, and Relationships through challenges, community, and curated products.
            </p>
          </div>

          {!submitted ? (
            <Card className="max-w-md mx-auto bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Get Early Access</CardTitle>
                <CardDescription className="text-purple-200">
                  Be among the first to experience MetaCore Life
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder:text-purple-200"
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Joining..." : "Join Waitlist"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-md mx-auto bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6">
                <div className="space-y-4 text-center">
                  <CheckCircle2 className="h-16 w-16 mx-auto text-green-400" />
                  <h3 className="text-2xl font-bold">You're In!</h3>
                  <p className="text-purple-200">
                    We've sent a confirmation email to {email}. We'll notify you when MetaCore Life launches!
                  </p>
                  <Link href="/login">
                    <Button variant="outline" className="mt-4 border-white text-white hover:bg-white/10">
                      Already have access? Sign In
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="space-y-2">
              <div className="text-4xl font-bold">7-30 Day</div>
              <div className="text-purple-200">Challenges</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">Social</div>
              <div className="text-purple-200">Community</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">Curated</div>
              <div className="text-purple-200">Marketplace</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

