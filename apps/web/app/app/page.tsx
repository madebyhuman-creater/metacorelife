import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Target, Heart, TrendingUp, Users, MessageSquare, ThumbsUp, ShoppingBag, Sparkles, ArrowRight, Calendar, Flame, CheckCircle2, Shield } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { isAdminEmail } from "@/lib/utils/admin-check"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user is admin
  const isAdmin = isAdminEmail(user.email)

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Get active challenges
  const { data: activeChallenges } = await supabase
    .from("user_challenges")
    .select(`
      *,
      challenges:challenge_id (
        id,
        title,
        category,
        duration_days,
        cover_image_url
      )
    `)
    .eq("user_id", user.id)
    .eq("is_completed", false)
    .limit(3)

  // Get featured challenges
  const { data: featuredChallenges } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(3)

  // Get recent posts count
  const { count: postsCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome back, {profile?.full_name || profile?.username || "there"}! 👋
                </h1>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-md">
                    <Shield className="h-3 w-3" />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">
                {isAdmin ? "Manage the platform and create challenges" : "Ready to achieve your core goals today?"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{activeChallenges?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Active Challenges</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{profile?.current_streak || 0}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{profile?.challenges_completed || 0}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{postsCount || 0}</div>
                    <div className="text-xs text-muted-foreground">Your Posts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Admin Quick Access */}
        {isAdmin && (
          <div className="mb-6">
            <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Admin Panel</h3>
                      <p className="text-sm text-muted-foreground">Manage challenges, products, and analytics</p>
                    </div>
                  </div>
                  <Link href="/admin">
                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                      Go to Admin
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            What would you like to do?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/app/challenges">
              <Card className="border-2 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Start a Challenge</CardTitle>
                  <CardDescription>Join challenges to improve Health, Wealth & Relationships</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Browse Challenges <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/feed">
              <Card className="border-2 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>View Your Feed</CardTitle>
                  <CardDescription>See posts from people you follow, like & comment</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Go to Feed <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href={`/app/profile/${user.id}`}>
              <Card className="border-2 hover:border-pink-300 hover:shadow-lg transition-all cursor-pointer group h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Share Progress</CardTitle>
                  <CardDescription>Post updates, share achievements, build your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Your Profile <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/shop">
              <Card className="border-2 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer group h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Browse Marketplace</CardTitle>
                  <CardDescription>Discover curated products for your journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Active Challenges */}
        {activeChallenges && activeChallenges.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-500" />
                Your Active Challenges
              </h2>
              <Link href="/app/challenges">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {activeChallenges.map((uc: any) => {
                const challenge = uc.challenges
                const progress = (uc.current_day / challenge.duration_days) * 100
                return (
                  <Link key={uc.id} href={`/app/challenges/${challenge.id}`}>
                    <Card className="border-2 hover:shadow-lg transition-all cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <CardDescription>Day {uc.current_day} of {challenge.duration_days}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <Button className="w-full" variant="outline">
                          Continue Challenge
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Featured Challenges */}
        {featuredChallenges && featuredChallenges.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                Featured Challenges
              </h2>
              <Link href="/app/challenges">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {featuredChallenges.map((challenge) => (
                <Link key={challenge.id} href={`/app/challenges/${challenge.id}`}>
                  <Card className="border-2 border-yellow-200 hover:shadow-lg transition-all cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </span>
                      </div>
                      <CardTitle>{challenge.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {challenge.duration_days} days
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {challenge.participants_count || 0} joined
                        </div>
                      </div>
                      <Button className="w-full">Start Challenge</Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

