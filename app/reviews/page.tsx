import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReviewsTable } from "@/components/reviews-table"
import { PlusCircle } from "lucide-react"
import { getReviews } from "@/lib/actions"

export const revalidate = 0

export default async function ReviewsPage() {
  const reviews = await getReviews()

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cannabis Reviews</h1>
          <p className="text-muted-foreground">Browse and search all cannabis flower reviews.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/add-review">
            <Button size="sm" className="h-9">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Review
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <CardDescription>A comprehensive list of all cannabis flower reviews in the database.</CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewsTable initialReviews={reviews} />
        </CardContent>
      </Card>
    </div>
  )
}

