import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ExpertReview {
  id: number
  expert_name: string
  score: number
  review_text: string
  created_at: string
}

interface ExpertReviewsProps {
  reviews: ExpertReview[]
}

export function ExpertReviews({ reviews }: ExpertReviewsProps) {
  if (reviews.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No expert reviews yet for this product.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">JIMI Expert Score</h3>
        <Badge className="text-lg px-3 py-1">
          {(reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length).toFixed(0)}/100
        </Badge>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4 space-y-3 bg-primary/5">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {review.expert_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{review.expert_name}</div>
                <div className="text-sm text-muted-foreground">
                  JIMI Expert • {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
              <Badge className="ml-auto">{review.score}/100</Badge>
            </div>
            {review.review_text && <div className="text-sm">{review.review_text}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

