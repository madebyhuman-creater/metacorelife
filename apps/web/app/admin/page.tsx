import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Target, ShoppingBag, BarChart3, Plus } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user is admin (you can add an is_admin field to profiles)
  // For now, we'll allow any authenticated user to access admin
  // In production, add proper admin check

  // Fetch analytics
  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  const { count: challengeCount } = await supabase
    .from("challenges")
    .select("*", { count: "exact", head: true })

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  const { count: waitlistCount } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true })

  // Get active challenges
  const { data: activeChallenges } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get recent signups
  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your MetaCore Life platform
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Challenges</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{challengeCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitlistCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
              <Link href="/app/challenges/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Challenge
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/products/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/challenges">
                <Target className="mr-2 h-4 w-4" />
                Manage Challenges
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Manage Products
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentUsers?.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{profile.full_name || profile.username}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {activeChallenges?.map((challenge) => (
              <div key={challenge.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-semibold">{challenge.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {challenge.participants_count} participants • {challenge.completion_rate}% completion
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/challenges/${challenge.id}`}>Edit</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

