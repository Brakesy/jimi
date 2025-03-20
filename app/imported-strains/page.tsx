import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseServer } from "@/lib/supabase"
import { scoreToGrade, getGradeColor } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TerpeneProfile } from "@/components/terpene-profile"

export const revalidate = 0

export default async function ImportedStrainsPage() {
  const supabase = getSupabaseServer()

  // Get the recently added strains (assuming they're the most recent ones)
  const { data: strains, error } = await supabase
    .from("product_reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching imported strains:", error)
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error loading strains</h1>
          <p className="mt-2 text-muted-foreground">There was an error loading the imported strains.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Imported Strains</h1>
        <p className="text-muted-foreground">Review the recently imported strains from your spreadsheet.</p>
      </div>

      <div className="grid gap-6">
        {strains.map((strain) => {
          const grade = scoreToGrade(strain.total_score)

          return (
            <Card key={strain.review_id} className="overflow-hidden">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{strain.strain_name}</CardTitle>
                    <CardDescription className="text-lg">{strain.producer}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="capitalize">
                        {strain.taxonomy?.toLowerCase()}
                      </Badge>
                      {strain.package_date && (
                        <span className="text-sm text-muted-foreground">
                          Packaged: {new Date(strain.package_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold">{strain.total_score.toFixed(2)}</div>
                    <Badge className={`mt-1 ${getGradeColor(grade)}`}>{grade}</Badge>
                    <div className="text-sm text-muted-foreground mt-1">Overall Score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Strain Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">THC Content</div>
                        <div className="text-lg">
                          {strain.thc_percentage ? `${strain.thc_percentage}%` : "Not specified"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Terpene Content</div>
                        <div className="text-lg">
                          {strain.terpene_percentage ? `${strain.terpene_percentage}%` : "Not specified"}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium mt-6 mb-4">Rating Categories</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Flower Structure</div>
                        <div className="text-lg">{strain.flower_structure}/10</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Trichome Density</div>
                        <div className="text-lg">{strain.trichome_density}/10</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Trim</div>
                        <div className="text-lg">{strain.trim}/10</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Burn</div>
                        <div className="text-lg">{strain.burn}/10</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Ash Color</div>
                        <div className="text-lg">{strain.ash_color}/10</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Flavor</div>
                        <div className="text-lg">{strain.flavor}/10</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Intensity</div>
                        <div className="text-lg">{strain.intensity}/10</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Clarity</div>
                        <div className="text-lg">{strain.clarity}/10</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Terpene Profile</h3>
                    {strain.terpene_profile && Object.keys(strain.terpene_profile).length > 0 ? (
                      <TerpeneProfile profile={strain.terpene_profile} />
                    ) : (
                      <div className="text-muted-foreground">No terpene profile available</div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button asChild>
                    <Link href={`/reviews/${strain.review_id}`}>View Full Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

