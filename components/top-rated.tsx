import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getSupabaseServer } from "@/lib/supabase"
import { scoreToGrade, getGradeColor } from "@/lib/utils"

export async function TopRated() {
  const supabase = getSupabaseServer()

  const { data: topProducts } = await supabase
    .from("product_reviews")
    .select("review_id, strain_name, producer, total_score, taxonomy")
    .order("total_score", { ascending: false })
    .limit(4)

  if (!topProducts || topProducts.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No reviews yet. Add your first review!</div>
  }

  return (
    <div className="space-y-4">
      {topProducts.map((product) => (
        <div key={product.review_id} className="space-y-2">
          <div className="flex items-center justify-between">
            <Link href={`/reviews/${product.review_id}`} className="font-medium hover:underline">
              {product.strain_name}
            </Link>
            <span className={`font-medium ${getGradeColor(scoreToGrade(product.total_score))}`}>
              {product.total_score}/100 ({scoreToGrade(product.total_score)})
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{product.producer}</span>
            <Badge variant="outline" className="capitalize">
              {product.taxonomy?.toLowerCase()}
            </Badge>
          </div>
          <Progress value={product.total_score} className="h-2" />
        </div>
      ))}
    </div>
  )
}

