"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { MessageCircle } from "lucide-react"

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    loadComments()
    loadUser()
  }, [postId])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      setUser(profile)
    }
  }

  const loadComments = async () => {
    const { data } = await supabase
      .from("post_comments")
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .limit(5)

    if (data) setComments(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("post_comments")
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            content: newComment,
          },
        ])

      if (error) throw error

      setNewComment("")
      loadComments()
    } catch (error) {
      console.error("Comment error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 mt-4">
      {comments.length > 0 && (
        <div className="space-y-2">
          {comments.map((comment: any) => (
            <div key={comment.id} className="flex gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={comment.profiles?.avatar_url} />
                <AvatarFallback>
                  {comment.profiles?.full_name?.charAt(0) || comment.profiles?.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <span className="text-sm font-semibold">
                  {comment.profiles?.full_name || comment.profiles?.username}
                </span>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={loading || !newComment.trim()}>
            <MessageCircle className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  )
}

