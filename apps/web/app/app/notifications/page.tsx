import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bell, Trophy, UserPlus, Heart, MessageCircle, Flame, TrendingUp } from "lucide-react"

const notificationIcons = {
  challenge_reminder: Bell,
  new_follower: UserPlus,
  like: Heart,
  comment: MessageCircle,
  milestone: Trophy,
  trending_challenge: TrendingUp,
  challenge_completed: Trophy,
}

export default async function NotificationsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  // Mark all as read
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with your activity
        </p>
      </div>

      <div className="space-y-3">
        {notifications?.map((notification) => {
          const Icon = notificationIcons[notification.type as keyof typeof notificationIcons] || Bell

          return (
            <Card
              key={notification.id}
              className={notification.is_read ? "opacity-60" : ""}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{notification.title}</h3>
                    {notification.message && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  {notification.link && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={notification.link}>View</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {notifications?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

