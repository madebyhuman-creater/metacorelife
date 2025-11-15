import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import BuyButton from "./buy-button"

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/shop" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Back to Marketplace
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {product.image_url ? (
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-96 w-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            {product.price && (
              <p className="text-3xl font-bold text-primary">${product.price}</p>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {product.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <BuyButton productId={product.id} affiliateLink={product.affiliate_link} />
            <p className="text-sm text-muted-foreground text-center">
              You'll be redirected to our partner site to complete your purchase
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

