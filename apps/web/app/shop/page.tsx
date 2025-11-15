import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, TrendingUp, Users, Search, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categoryIcons = {
  health: Heart,
  wealth: TrendingUp,
  relationships: Users,
  general: ShoppingBag,
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const supabase = createClient()

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)

  if (searchParams.category) {
    query = query.eq("category", searchParams.category)
  }

  if (searchParams.search) {
    query = query.ilike("title", `%${searchParams.search}%`)
  }

  const { data: products } = await query.order("is_featured", { ascending: false }).limit(50)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
        <p className="text-muted-foreground">
          Curated products to support your Health, Wealth, and Relationships journey
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <form className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                defaultValue={searchParams.search}
                name="search"
              />
            </div>
          </form>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Link href="/shop">
            <Button variant={!searchParams.category ? "default" : "outline"}>
              All
            </Button>
          </Link>
          <Link href="/shop?category=health">
            <Button variant={searchParams.category === "health" ? "default" : "outline"}>
              Health
            </Button>
          </Link>
          <Link href="/shop?category=wealth">
            <Button variant={searchParams.category === "wealth" ? "default" : "outline"}>
              Wealth
            </Button>
          </Link>
          <Link href="/shop?category=relationships">
            <Button variant={searchParams.category === "relationships" ? "default" : "outline"}>
              Relationships
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => {
          const Icon = categoryIcons[product.category as keyof typeof categoryIcons] || ShoppingBag

          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/shop/product/${product.id}`}>
                {product.image_url ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
                    <Icon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                    {product.is_featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {product.price && (
                      <span className="text-xl font-bold">${product.price}</span>
                    )}
                    <Button>View Product</Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>

      {products?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )}
    </div>
  )
}

