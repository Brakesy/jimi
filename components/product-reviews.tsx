import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Review {
  id: number
  user_id?: string
  flower_structure: number
  trichome_density: number
  trim: number
  burn: number
  ash_color: number
  flavor: number
  intensity: number
  clarity: number
  total_score: number
  notes: string
  created_at: string
}

interface ProductReviewsProps {
  reviews: Review[]
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  // Format category names for display
  const formatCategoryName = (name: string) => {
    return name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }

  // Define categories for display
  const categories = [
    { id: "flower_structure", name: formatCategoryName("flower_structure") },
    { id: "trichome_density", name: formatCategoryName("trichome_density") },
    { id: "trim", name: formatCategoryName("trim") },
    { id: "burn", name: formatCategoryName("burn") },
    { id: "ash_color", name: formatCategoryName("ash_color") },
    { id: "flavor", name: formatCategoryName("flavor") },
    { id: "intensity", name: formatCategoryName("intensity") },
    { id: "clarity", name: formatCategoryName("clarity") },
  ]

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">No reviews yet. Be the first to review this product!</div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Rating Categories</h3>
        <div className="space-y-4">
          {categories.map((category) => {
            // Calculate average score for this category
            const avgScore =
              reviews.reduce((sum, review) => (sum + review[category.id as keyof Review]) as number, 0) / reviews.length

            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{category.name}</div>
                  <div className="text-sm">{avgScore.toFixed(1)}/10</div>
                </div>
                <Progress value={avgScore * 10} className="h-2" />
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">User Reviews</h3>
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{review.user_id ? review.user_id.substring(0, 2).toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">User Review</div>
                <div className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</div>
              </div>
              <Badge className="ml-auto" variant={review.total_score >= 90 ? "default" : "secondary"}>
                {review.total_score}/100
              </Badge>
            </div>
            {review.notes && <div className="text-sm text-muted-foreground">{review.notes}</div>}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <span>{category.name}:</span>
                  <span className="font-medium">{review[category.id as keyof Review]}/10</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

