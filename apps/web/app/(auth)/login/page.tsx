"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Chrome, Apple } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Log for debugging (remove in production)
      console.log("Attempting login for:", email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        // Log the full error for debugging
        console.error("Login error:", error)
        
        // Provide more helpful error messages
        let errorMessage = error.message
        let errorTitle = "Login Failed"
        
        if (error.message.includes("Email not confirmed") || error.status === 401) {
          errorTitle = "Email Not Verified"
          errorMessage = "Please verify your email address before logging in. Check your inbox (and spam folder) for the confirmation link. If you didn't receive it, you may need to disable email confirmation in Supabase settings for development."
        } else if (error.message.includes("Invalid login credentials") || error.message.includes("invalid")) {
          errorTitle = "Invalid Credentials"
          errorMessage = "The email or password you entered is incorrect. Please check:\n• Email spelling\n• Password (case-sensitive)\n• Make sure you've signed up first\n\nIf email confirmation is enabled, check your email for a verification link."
        } else if (error.message.includes("User not found")) {
          errorTitle = "Account Not Found"
          errorMessage = "No account found with this email. Please sign up first."
        } else {
          errorMessage = `${error.message} (Code: ${error.status || 'unknown'})`
        }
        
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        })
        return
      }

      if (!data.session) {
        toast({
          title: "Login Failed",
          description: "No session was created. This might mean email confirmation is required. Check your Supabase settings.",
          variant: "destructive",
        })
        return
      }

      console.log("Login successful, session created")
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      })
      router.push("/app")
      router.refresh()
    } catch (error: any) {
      console.error("Unexpected login error:", error)
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to sign in with ${provider}`,
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your MetaCore Life account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin("google")}
              disabled={loading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin("apple")}
              disabled={loading}
            >
              <Apple className="mr-2 h-4 w-4" />
              Apple
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Having trouble? Check the browser console (F12) for detailed error messages.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

