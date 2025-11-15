import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, TrendingUp, Users, Calendar, Target } from "lucide-react"
import Image from "next/image"

const categoryIcons = {
  health: Heart,
  wealth: TrendingUp,
  relationships: Users,
}

const categoryColors = {
  health: "bg-red-100 text-red-800 border-red-200",
  wealth: "bg-green-100 text-green-800 border-green-200",
  relationships: "bg-pink-100 text-pink-800 border-pink-200",
}

export default async function ChallengesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch challenges
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("participants_count", { ascending: false })
    .limit(20)

  // Fetch user's active challenges
  const { data: userChallenges } = await supabase
    .from("user_challenges")
    .select("challenge_id, is_completed")
    .eq("user_id", user.id)
    .eq("is_completed", false)

  const activeChallengeIds = new Set(userChallenges?.map(uc => uc.challenge_id) || [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4 shadow-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Challenges
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your life through curated challenges. Join thousands building better Health, Wealth, and Relationships.
          </p>
        </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/app/challenges?category=health">
          <Button variant="outline" className="hover:bg-red-50 hover:border-red-300 transition-all">
            <Heart className="mr-2 h-4 w-4" />
            Health
          </Button>
        </Link>
        <Link href="/app/challenges?category=wealth">
          <Button variant="outline" className="hover:bg-green-50 hover:border-green-300 transition-all">
            <TrendingUp className="mr-2 h-4 w-4" />
            Wealth
          </Button>
        </Link>
        <Link href="/app/challenges?category=relationships">
          <Button variant="outline" className="hover:bg-pink-50 hover:border-pink-300 transition-all">
            <Users className="mr-2 h-4 w-4" />
            Relationships
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges?.map((challenge) => {
          const Icon = categoryIcons[challenge.category as keyof typeof categoryIcons]
          const isJoined = activeChallengeIds.has(challenge.id)
          const colorClass = categoryColors[challenge.category as keyof typeof categoryColors]

          return (
            <Card 
              key={challenge.id} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 hover:border-primary/20"
            >
              {challenge.cover_image_url ? (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={challenge.cover_image_url}
                    alt={challenge.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  {challenge.is_featured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      ⭐ Featured
                    </div>
                  )}
                </div>
              ) : (
                <div className={`relative h-48 w-full bg-gradient-to-br ${
                  challenge.category === 'health' ? 'from-red-400 to-red-600' :
                  challenge.category === 'wealth' ? 'from-green-400 to-green-600' :
                  'from-pink-400 to-pink-600'
                } flex items-center justify-center`}>
                  <Icon className="h-16 w-16 text-white/80" />
                  {challenge.is_featured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ Featured
                    </div>
                  )}
                </div>
              )}
              <CardHeader className="bg-gradient-to-b from-background to-muted/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2 text-xl group-hover:text-primary transition-colors">
                      {challenge.title}
                    </CardTitle>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border-2 ${colorClass} transition-all hover:scale-105`}>
                      <Icon className="h-3 w-3" />
                      {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
                    </span>
                  </div>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {challenge.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{challenge.duration_days} days</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{challenge.participants_count || 0} joined</span>
                  </div>
                </div>
                <Link href={`/app/challenges/${challenge.id}`}>
                  <Button 
                    className="w-full font-semibold transition-all hover:scale-105 active:scale-95" 
                    variant={isJoined ? "outline" : "default"}
                    size="lg"
                  >
                    {isJoined ? "▶ Continue Challenge" : "🚀 Start Challenge"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {challenges?.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-muted rounded-full mb-4">
            <Target className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-lg">No challenges available yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Check back soon for new challenges!</p>
        </div>
      )}
      </div>
    </div>
  )
}

