import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, Target, ShoppingBag, Bell, User, LogOut, Shield } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { isAdminEmail } from "@/lib/utils/admin-check"

export default async function Navbar() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  let isAdmin = false
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    profile = data
    isAdmin = isAdminEmail(user.email)
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={user ? "/app" : "/"} className="text-2xl font-bold">
              MetaCore Life
            </Link>
            {user && (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/app">
                  <Button variant="ghost" size="sm">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/app/challenges">
                  <Button variant="ghost" size="sm">
                    <Target className="mr-2 h-4 w-4" />
                    Challenges
                  </Button>
                </Link>
                <Link href="/app/feed">
                  <Button variant="ghost" size="sm">
                    Feed
                  </Button>
                </Link>
                <Link href="/app/discover">
                  <Button variant="ghost" size="sm">
                    Discover
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="ghost" size="sm">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Shop
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/app/notifications">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/app/profile/${user.id}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback>
                      {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <form action="/api/auth/signout" method="post">
                  <Button type="submit" variant="ghost" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

