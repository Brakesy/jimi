import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getSupabaseServer } from "@/lib/supabase"
import { scoreToGrade, getGradeColor } from "@/lib/utils"

export async function RecentReviews() {
  const supabase = getSupabaseServer()

  const { data: reviews } = await supabase
    .from("product_reviews")
    .select("review_id, strain_name, producer, total_score, taxonomy, created_at")
    .order("created_at", { ascending: false })
    .limit(4)

  if (!reviews || reviews.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No reviews yet. Add your first review!</div>
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.review_id} className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">{review.strain_name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <Link href={`/reviews/${review.review_id}`} className="font-medium hover:underline">
                {review.strain_name}
              </Link>
              <span className={`font-medium ${getGradeColor(scoreToGrade(review.total_score))}`}>
                {review.total_score}/100 ({scoreToGrade(review.total_score)})
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{review.producer}</span>
              <span className="mx-2">•</span>
              <Badge variant="outline" className="capitalize">
                {review.taxonomy?.toLowerCase()}
              </Badge>
              <span className="ml-auto text-xs">{new Date(review.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

