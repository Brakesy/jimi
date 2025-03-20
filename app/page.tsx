import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentReviews } from "@/components/recent-reviews"
import { TopRated } from "@/components/top-rated"
import { TrendingProducts } from "@/components/trending-products"
import { PlusCircle, Search, QrCode } from "lucide-react"
import { getSupabaseServer } from "@/lib/supabase"
import { StatsCards } from "@/components/stats-cards"
import { scoreToGrade } from "@/lib/utils"
import { ImportedStrainsCard } from "@/components/imported-strains-card"

export const revalidate = 0

export default async function Home() {
  const supabase = getSupabaseServer()

  // Get total review count
  const { count: reviewCount } = await supabase.from("product_reviews").select("*", { count: "exact", head: true })

  // Get average score
  const { data: avgScoreData } = await supabase
    .from("product_reviews")
    .select("total_score")
    .not("total_score", "is", null)

  const avgScore =
    avgScoreData && avgScoreData.length > 0
      ? avgScoreData.reduce((sum, review) => sum + Number(review.total_score), 0) / avgScoreData.length
      : 0

  // Get top rated strain
  const { data: topStrain } = await supabase
    .from("product_reviews")
    .select("strain_name, total_score")
    .order("total_score", { ascending: false })
    .limit(1)
    .single()

  // Calculate grade distribution
  const gradeDistribution: Record<string, number> = {}
  if (avgScoreData && avgScoreData.length > 0) {
    avgScoreData.forEach((review) => {
      const grade = scoreToGrade(review.total_score)
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1
    })
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">JIMI Cannabis Review</h1>
          <p className="text-muted-foreground">Track, rate, and discover quality cannabis products.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/scan">
            <Button variant="outline" size="sm" className="h-9">
              <QrCode className="mr-2 h-4 w-4" />
              Scan UPC
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" size="sm" className="h-9">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </Link>
          <Link href="/add-review">
            <Button size="sm" className="h-9">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Review
            </Button>
          </Link>
        </div>
      </div>

      <StatsCards
        reviewCount={reviewCount || 0}
        avgScore={avgScore.toFixed(1)}
        topStrain={topStrain?.strain_name || "N/A"}
        topScore={topStrain?.total_score || 0}
        gradeDistribution={gradeDistribution}
      />

      <Card>
        <CardHeader>
          <CardTitle>Trending Products</CardTitle>
          <CardDescription>The most reviewed and viewed cannabis products this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendingProducts />
        </CardContent>
        <CardFooter>
          <Link href="/trending">
            <Button variant="outline">View All Trending</Button>
          </Link>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>The latest cannabis flower reviews in the database.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentReviews />
          </CardContent>
          <CardFooter>
            <Link href="/reviews">
              <Button variant="outline">View All Reviews</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Rated Products</CardTitle>
            <CardDescription>Highest scoring cannabis flower products.</CardDescription>
          </CardHeader>
          <CardContent>
            <TopRated />
          </CardContent>
          <CardFooter>
            <Link href="/top-rated">
              <Button variant="outline">View All Top Rated</Button>
            </Link>
          </CardFooter>
        </Card>

        <ImportedStrainsCard />
      </div>
    </div>
  )
}

