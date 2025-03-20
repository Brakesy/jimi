import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Award, Leaf } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { scoreToGrade, getGradeColor } from "@/lib/utils"

interface StatsCardsProps {
  reviewCount: number
  avgScore: string
  topStrain: string
  topScore: number
  gradeDistribution?: Record<string, number>
}

export function StatsCards({ reviewCount, avgScore, topStrain, topScore, gradeDistribution }: StatsCardsProps) {
  const topGrade = scoreToGrade(topScore)
  const avgGrade = scoreToGrade(Number.parseFloat(avgScore))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reviewCount}</div>
          <p className="text-xs text-muted-foreground">In the database</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{avgScore}/100</div>
            <Badge className={getGradeColor(avgGrade)}>{avgGrade}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Across all reviews</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Rated Strain</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold truncate">{topStrain || "N/A"}</div>
            {topStrain && <Badge className={getGradeColor(topGrade)}>{topGrade}</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">Score: {topScore}/100</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Grade Distribution</CardTitle>
          <Leaf className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {gradeDistribution ? (
              Object.entries(gradeDistribution)
                .sort(([gradeA], [gradeB]) => {
                  const gradeOrder = [
                    "AAAA+",
                    "AAAA",
                    "AAA+",
                    "AAA",
                    "AA+",
                    "AA",
                    "A+",
                    "A",
                    "BBB+",
                    "BBB",
                    "BB+",
                    "BB",
                    "B+",
                    "B",
                  ]
                  return gradeOrder.indexOf(gradeA) - gradeOrder.indexOf(gradeB)
                })
                .slice(0, 3)
                .map(([grade, count]) => (
                  <div key={grade} className="flex items-center justify-between">
                    <Badge className={getGradeColor(grade)}>{grade}</Badge>
                    <span className="text-sm font-medium">{count} strains</span>
                  </div>
                ))
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Top 3 grades shown</p>
        </CardContent>
      </Card>
    </div>
  )
}

