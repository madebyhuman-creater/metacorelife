import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Trophy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import LikeButton from "./like-button"
import CommentSection from "./comment-section"

export default async function FeedPage() {
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

  const followingIds = following?.map(f => f.following_id) || [user.id]

  // Fetch posts from followed users
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      ),
      challenges:challenge_id (
        id,
        title,
        category
      )
    `)
    .in("user_id", followingIds)
    .order("created_at", { ascending: false })
    .limit(20)

  // Check which posts user has liked
  const { data: userLikes } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("user_id", user.id)

  const likedPostIds = new Set(userLikes?.map(l => l.post_id) || [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Feed</h1>
        <p className="text-muted-foreground">
          Updates from people you follow
        </p>
      </div>

      <div className="space-y-6">
        {posts?.map((post: any) => {
          const profile = post.profiles
          const challenge = post.challenges
          const isLiked = likedPostIds.has(post.id)

          return (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Link href={`/app/profile/${profile.id}`}>
                    <Avatar>
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback>
                        {profile.full_name?.charAt(0) || profile.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 space-y-3">
                    <div>
                      <Link href={`/app/profile/${profile.id}`}>
                        <span className="font-semibold hover:underline">
                          {profile.full_name || profile.username}
                        </span>
                      </Link>
                      {challenge && (
                        <span className="text-muted-foreground text-sm ml-2">
                          completed {challenge.title}
                        </span>
                      )}
                      {post.is_completion_post && (
                        <Trophy className="inline h-4 w-4 ml-2 text-yellow-500" />
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {post.content && (
                      <p className="text-sm">{post.content}</p>
                    )}

                    {post.media_url && (
                      <div className="relative w-full h-96 rounded-lg overflow-hidden">
                        <Image
                          src={post.media_url}
                          alt="Post media"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 border-t">
                      <LikeButton postId={post.id} isLiked={isLiked} likesCount={post.likes_count} />
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/app/post/${post.id}`}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          {post.comments_count || 0}
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>

                    <CommentSection postId={post.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {posts?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Your feed is empty. Follow some users to see their posts!
              </p>
              <Button asChild>
                <Link href="/app/discover">Discover Users</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

