import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, Edit, Percent } from "lucide-react"
import { getReviewById } from "@/lib/actions"
import { scoreToGrade, getGradeColor } from "@/lib/utils"
import { TerpeneProfile } from "@/components/terpene-profile"

export const revalidate = 0

export default async function ReviewDetailPage({ params }: { params: { id: string } }) {
  const review = await getReviewById(Number.parseInt(params.id))

  if (!review) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Review not found</h1>
          <p className="mt-2 text-muted-foreground">The review you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-4">
            <Link href="/reviews">Back to Reviews</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Calculate category weights (matching your spreadsheet)
  const weights = {
    flower_structure: 0.15,
    trichome_density: 0.15,
    trim: 0.1,
    burn: 0.15,
    ash_color: 0.1,
    flavor: 0.15,
    intensity: 0.1,
    clarity: 0.1,
  }

  // Format category names for display
  const formatCategoryName = (name: string) => {
    return name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/reviews">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reviews
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{review.strain_name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-muted-foreground">{review.producer}</span>
            <Badge variant="outline" className="capitalize">
              {review.taxonomy?.toLowerCase()}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Reviewed: {new Date(review.created_at).toLocaleDateString()}</span>
          </div>
          <Button size="sm" asChild>
            <Link href={`/reviews/${review.review_id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Review
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Review Details</CardTitle>
            <CardDescription>Detailed breakdown of the cannabis flower review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">THC Content</div>
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <span>{review.thc_percentage ? `${review.thc_percentage}%` : "Not specified"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Terpene Content</div>
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <span>{review.terpene_percentage ? `${review.terpene_percentage}%` : "Not specified"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Rating Categories</h3>
              <div className="space-y-4">
                {Object.entries(weights).map(([category, weight]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {formatCategoryName(category)} ({Math.round(weight * 100)}%)
                      </div>
                      <div className="text-sm">{review[category as keyof typeof review]}/10</div>
                    </div>
                    <Progress value={Number(review[category as keyof typeof review]) * 10} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {review.terpene_profile && Object.keys(review.terpene_profile).length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Terpene Profile</h3>
                <TerpeneProfile profile={review.terpene_profile} />
              </div>
            )}

            {review.notes && (
              <div>
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <p className="text-muted-foreground">{review.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
            <CardDescription>Weighted score based on all rating categories.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${review.total_score * 2.51} 251.2`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute text-4xl font-bold">{review.total_score}</div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-muted-foreground">out of 100</div>
              <Badge className={`mt-2 ${getGradeColor(scoreToGrade(review.total_score))}`}>
                {scoreToGrade(review.total_score)}
              </Badge>
              <div className={`mt-2 font-medium ${getGradeColor(scoreToGrade(review.total_score))}`}>
                {review.total_score >= 95
                  ? "Exceptional"
                  : review.total_score >= 90
                    ? "Outstanding"
                    : review.total_score >= 85
                      ? "Excellent"
                      : review.total_score >= 80
                        ? "Very Good"
                        : review.total_score >= 70
                          ? "Good"
                          : review.total_score >= 60
                            ? "Above Average"
                            : review.total_score >= 50
                              ? "Average"
                              : "Below Average"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

