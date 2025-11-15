import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Users, UserPlus, Flame, Calendar } from "lucide-react"
import Link from "next/link"
import FollowButton from "./follow-button"

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  if (!currentUser) {
    redirect("/login")
  }

  // Fetch profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !profile) {
    notFound()
  }

  // Check if current user follows this profile
  const { data: follow } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", currentUser.id)
    .eq("following_id", params.id)
    .single()

  const isFollowing = !!follow
  const isOwnProfile = currentUser.id === params.id

  // Fetch user's active challenges
  const { data: activeChallenges } = await supabase
    .from("user_challenges")
    .select(`
      *,
      challenges:challenge_id (
        id,
        title,
        category,
        duration_days
      )
    `)
    .eq("user_id", params.id)
    .eq("is_completed", false)
    .limit(5)

  // Fetch user's completed challenges
  const { data: completedChallenges } = await supabase
    .from("user_challenges")
    .select(`
      *,
      challenges:challenge_id (
        id,
        title,
        category,
        duration_days
      )
    `)
    .eq("user_id", params.id)
    .eq("is_completed", true)
    .limit(10)

  // Fetch user's badges
  const { data: badges } = await supabase
    .from("user_badges")
    .select(`
      *,
      badges:badge_id (
        id,
        name,
        description,
        icon_url,
        category
      )
    `)
    .eq("user_id", params.id)

  // Fetch recent posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">
                {profile.full_name?.charAt(0) || profile.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">
                    {profile.full_name || profile.username}
                  </h1>
                  <p className="text-muted-foreground">@{profile.username}</p>
                  {profile.bio && (
                    <p className="mt-2">{profile.bio}</p>
                  )}
                </div>
                {!isOwnProfile && (
                  <FollowButton
                    profileId={params.id}
                    isFollowing={isFollowing}
                  />
                )}
                {isOwnProfile && (
                  <Button asChild variant="outline">
                    <Link href="/app/profile/settings">Edit Profile</Link>
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <div className="text-2xl font-bold">{profile.followers_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{profile.following_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{profile.challenges_completed || 0}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold flex items-center gap-1">
                    <Flame className="h-5 w-5 text-orange-500" />
                    {profile.current_streak || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {activeChallenges && activeChallenges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeChallenges.map((uc: any) => (
                    <Link
                      key={uc.id}
                      href={`/app/challenges/${uc.challenges.id}`}
                      className="block p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="font-semibold">{uc.challenges.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Day {uc.current_day} of {uc.challenges.duration_days}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {completedChallenges && completedChallenges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Completed Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedChallenges.map((uc: any) => (
                    <Link
                      key={uc.id}
                      href={`/app/challenges/${uc.challenges.id}`}
                      className="block p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="font-semibold">{uc.challenges.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Completed {new Date(uc.completed_at).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {badges && badges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {badges.map((ub: any) => (
                    <div key={ub.id} className="text-center">
                      <div className="h-16 w-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                        <Trophy className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div className="text-xs font-medium">{ub.badges.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Longest Streak</div>
                <div className="text-2xl font-bold flex items-center gap-1">
                  <Flame className="h-5 w-5 text-orange-500" />
                  {profile.longest_streak || 0} days
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Member Since</div>
                <div className="text-lg font-semibold">
                  {new Date(profile.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

