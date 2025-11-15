import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, TrendingUp, Users, Calendar, CheckCircle2, Flame } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import JoinChallengeButton from "./join-challenge-button"
import CheckInForm from "./check-in-form"

const categoryIcons = {
  health: Heart,
  wealth: TrendingUp,
  relationships: Users,
}

export default async function ChallengeDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch challenge
  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !challenge) {
    notFound()
  }

  // Fetch user's challenge progress
  const { data: userChallenge } = await supabase
    .from("user_challenges")
    .select("*")
    .eq("user_id", user.id)
    .eq("challenge_id", params.id)
    .single()

  // Fetch check-ins
  const { data: checkIns } = await supabase
    .from("challenge_check_ins")
    .select("*")
    .eq("user_challenge_id", userChallenge?.id)
    .order("day_number", { ascending: true })

  const Icon = categoryIcons[challenge.category as keyof typeof categoryIcons]
  const dailyTasks = challenge.daily_tasks as string[] || []
  const completedDays = checkIns?.length || 0
  const progress = userChallenge ? (completedDays / challenge.duration_days) * 100 : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/app/challenges" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Back to Challenges
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {challenge.cover_image_url && (
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={challenge.cover_image_url}
                alt={challenge.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium capitalize">{challenge.category}</span>
              </div>
              <CardTitle className="text-3xl">{challenge.title}</CardTitle>
              <CardDescription className="text-base">
                {challenge.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Daily Tasks</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {dailyTasks.map((task, idx) => (
                      <li key={idx}>{task}</li>
                    ))}
                  </ul>
                </div>

                {userChallenge && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4">Your Progress</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Day {userChallenge.current_day} of {challenge.duration_days}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>Streak: {userChallenge.streak_days} days</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {userChallenge && !userChallenge.is_completed && (
            <Card>
              <CardHeader>
                <CardTitle>Daily Check-In</CardTitle>
                <CardDescription>
                  Complete your check-in for day {userChallenge.current_day}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CheckInForm userChallengeId={userChallenge.id} dayNumber={userChallenge.current_day} />
              </CardContent>
            </Card>
          )}

          {userChallenge && userChallenge.is_completed && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle2 className="h-16 w-16 mx-auto text-green-600" />
                  <h3 className="text-2xl font-bold">Challenge Completed! 🎉</h3>
                  <p className="text-muted-foreground">
                    You've successfully completed this challenge. Share your achievement!
                  </p>
                  <Button asChild>
                    <Link href={`/app/post/create?challenge=${challenge.id}&type=completion`}>
                      Share Completion
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{challenge.duration_days} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{challenge.participants_count} participants</span>
              </div>
              {challenge.completion_rate > 0 && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Completion Rate: </span>
                  <span className="font-medium">{challenge.completion_rate}%</span>
                </div>
              )}
            </CardContent>
          </Card>

          {!userChallenge && (
            <Card>
              <CardHeader>
                <CardTitle>Ready to Start?</CardTitle>
                <CardDescription>
                  Join this challenge and begin your journey today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JoinChallengeButton challengeId={challenge.id} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

