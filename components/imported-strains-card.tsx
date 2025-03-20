import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseServer } from "@/lib/supabase"
import { scoreToGrade, getGradeColor } from "@/lib/utils"
import { FileSpreadsheet } from "lucide-react"

export async function ImportedStrainsCard() {
  const supabase = getSupabaseServer()

  // Get the recently added strains (assuming they're the most recent ones)
  const { data: strains, error } = await supabase
    .from("product_reviews")
    .select("review_id, strain_name, producer, total_score, taxonomy")
    .order("created_at", { ascending: false })
    .limit(3)

  if (error || !strains || strains.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Imported Strains</CardTitle>
          <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>Recently imported strains from your spreadsheet.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {strains.map((strain) => {
            const grade = scoreToGrade(strain.total_score)

            return (
              <div key={strain.review_id} className="flex items-center justify-between">
                <div>
                  <Link href={`/reviews/${strain.review_id}`} className="font-medium hover:underline">
                    {strain.strain_name}
                  </Link>
                  <div className="text-sm text-muted-foreground">{strain.producer}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {strain.taxonomy?.toLowerCase()}
                  </Badge>
                  <Badge className={getGradeColor(grade)}>{grade}</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/imported-strains" className="w-full">
          <Button variant="outline" className="w-full">
            View All Imported Strains
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

