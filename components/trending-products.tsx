import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSupabaseServer } from "@/lib/supabase"
import { TrendingUp, Star } from "lucide-react"

export async function TrendingProducts() {
  const supabase = getSupabaseServer()

  const { data: trendingProducts } = await supabase.from("trending_products").select("*").limit(5)

  if (!trendingProducts || trendingProducts.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No trending products yet. Start reviewing to see trends!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {trendingProducts.map((product) => (
        <div key={product.id} className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            {product.image_url ? (
              <AvatarImage src={product.image_url} alt={product.strain_name} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {product.strain_name.substring(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <Link href={`/products/${product.id}`} className="font-medium hover:underline">
                {product.strain_name}
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                  <span className="text-sm font-medium">
                    {product.avg_score ? product.avg_score.toFixed(1) : "N/A"}
                  </span>
                </div>
                {product.expert_score && (
                  <div className="flex items-center bg-primary/10 px-2 py-0.5 rounded-full">
                    <span className="text-xs font-medium text-primary">JIMI: {product.expert_score.toFixed(0)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{product.producer}</span>
              <span className="mx-2">•</span>
              <Badge variant="outline" className="capitalize">
                {product.taxonomy?.toLowerCase()}
              </Badge>
              <div className="ml-auto flex items-center text-xs">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span>{product.review_count_last_30_days} reviews this month</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

