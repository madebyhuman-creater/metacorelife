"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Heart, TrendingUp, Users, Sparkles, X } from "lucide-react"
import Link from "next/link"

export default function CreateChallengePage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }
    
    // Check if user is admin (for now, check if they can access admin dashboard)
    // In production, add proper admin field to profiles table
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
    const isUserAdmin = adminEmails.includes(user.email?.toLowerCase() || '')
    
    if (!isUserAdmin) {
      router.push("/app/challenges")
      return
    }
    
    setIsAdmin(true)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<"health" | "wealth" | "relationships">("health")
  const [durationDays, setDurationDays] = useState(7)
  const [dailyTasks, setDailyTasks] = useState<string[]>([""])
  const [isFeatured, setIsFeatured] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const addTask = () => {
    setDailyTasks([...dailyTasks, ""])
  }

  const updateTask = (index: number, value: string) => {
    const newTasks = [...dailyTasks]
    newTasks[index] = value
    setDailyTasks(newTasks)
  }

  const removeTask = (index: number) => {
    setDailyTasks(dailyTasks.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/challenges/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          duration_days: durationDays,
          daily_tasks: dailyTasks.filter(t => t.trim()),
          is_featured: isFeatured,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create challenge")
      }

      const { challenge } = await response.json()
      toast({
        title: "Challenge created!",
        description: "Your challenge has been created successfully.",
      })
      router.push(`/app/challenges/${challenge.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Admin Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Create New Challenge
              </h1>
              <p className="text-muted-foreground">Design an engaging challenge for the community</p>
            </div>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardTitle className="text-2xl">Basic Information</CardTitle>
            <CardDescription>
              Set up your challenge details and make it engaging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium mb-2 block">
                Challenge Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="30-Day Fitness Challenge"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium mb-2 block">
                Description
              </label>
              <textarea
                id="description"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what participants will achieve..."
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="text-sm font-medium mb-2 block">
                Category
              </label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={category === "health" ? "default" : "outline"}
                  onClick={() => setCategory("health")}
                  className={`transition-all ${
                    category === "health" 
                      ? "bg-red-500 hover:bg-red-600 text-white shadow-lg scale-105" 
                      : "hover:bg-red-50 hover:border-red-300"
                  }`}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Health
                </Button>
                <Button
                  type="button"
                  variant={category === "wealth" ? "default" : "outline"}
                  onClick={() => setCategory("wealth")}
                  className={`transition-all ${
                    category === "wealth" 
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-lg scale-105" 
                      : "hover:bg-green-50 hover:border-green-300"
                  }`}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Wealth
                </Button>
                <Button
                  type="button"
                  variant={category === "relationships" ? "default" : "outline"}
                  onClick={() => setCategory("relationships")}
                  className={`transition-all ${
                    category === "relationships" 
                      ? "bg-pink-500 hover:bg-pink-600 text-white shadow-lg scale-105" 
                      : "hover:bg-pink-50 hover:border-pink-300"
                  }`}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Relationships
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <input
                type="checkbox"
                id="featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-yellow-900 cursor-pointer">
                Mark as Featured Challenge (will appear prominently)
              </label>
            </div>

            <div>
              <label htmlFor="duration" className="text-sm font-medium mb-2 block">
                Duration (days)
              </label>
              <Input
                id="duration"
                type="number"
                min={7}
                max={30}
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value))}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardTitle className="text-2xl">Daily Tasks</CardTitle>
            <CardDescription>
              Define what participants should do each day to complete the challenge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dailyTasks.map((task, index) => (
              <div key={index} className="flex gap-2 items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <Input
                  value={task}
                  onChange={(e) => updateTask(index, e.target.value)}
                  placeholder={`Enter task ${index + 1}...`}
                  className="flex-1"
                />
                {dailyTasks.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTask(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={addTask}
              className="w-full border-dashed hover:border-solid transition-all"
            >
              + Add Another Task
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            disabled={submitting}
            size="lg"
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Challenge...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Challenge
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            size="lg"
          >
            Cancel
          </Button>
        </div>
      </form>
      </div>
    </div>
  )
}

