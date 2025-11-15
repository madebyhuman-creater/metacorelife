import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { TrendingUp, Users, UserPlus } from "lucide-react"

export default async function DiscoverPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get users the current user follows
  const { data: following } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id)

  const followingIds = following?.map(f => f.following_id) || []

  // Fetch trending challenges
  const { data: trendingChallenges } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_active", true)
    .order("participants_count", { ascending: false })
    .limit(10)

  // Fetch suggested users (users with most followers that you don't follow)
  const { data: suggestedUsers } = await supabase
    .from("profiles")
    .select("*")
    .not("id", "in", `(${[user.id, ...followingIds].join(",")})`)
    .order("followers_count", { ascending: false })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Discover</h1>
        <p className="text-muted-foreground">
          Find trending challenges and connect with new people
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5" />
            <h2 className="text-2xl font-bold">Trending Challenges</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {trendingChallenges?.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <CardTitle>{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {challenge.participants_count} participants
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/app/challenges/${challenge.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5" />
            <h2 className="text-2xl font-bold">Suggested Users</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {suggestedUsers?.map((profile) => (
              <Card key={profile.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Link href={`/app/profile/${profile.id}`}>
                      <Avatar>
                        <AvatarImage src={profile.avatar_url || undefined} />
                        <AvatarFallback>
                          {profile.full_name?.charAt(0) || profile.username?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/app/profile/${profile.id}`}>
                        <div className="font-semibold hover:underline">
                          {profile.full_name || profile.username}
                        </div>
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        @{profile.username}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {profile.followers_count || 0} followers
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/app/profile/${profile.id}`}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

