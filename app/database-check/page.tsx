import { getSupabaseServer } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DatabaseDebug } from "@/components/database-debug"
import { ImportStrainsButton } from "@/components/import-strains-button"
import { EnvCheck } from "@/components/env-check"

export const revalidate = 0

export default async function DatabaseCheckPage() {
  const supabase = getSupabaseServer()

  // Query to check all records in the product_reviews table
  const { data: reviews, error } = await supabase
    .from("product_reviews")
    .select("*")
    .order("created_at", { ascending: false })

  // Count of records
  const recordCount = reviews?.length || 0

  // Check for specific strains from the import
  const importedStrains = [
    "Test 1",
    "Test 2",
    "Test 3",
    "Test 4",
    "Blue Dream",
    "Pink Kush",
    "Jack Haze",
    "Black Cherry Punch",
  ]
  const foundStrains = reviews?.filter((review) => importedStrains.includes(review.strain_name)) || []

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
        <h1 className="text-3xl font-bold tracking-tight">Database Check</h1>
        <p className="text-muted-foreground">Verifying the database records and imported strains</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <EnvCheck />
          <DatabaseDebug />

          <Card>
            <CardHeader>
              <CardTitle>Import Example Strains</CardTitle>
            </CardHeader>
            <CardContent>
              <ImportStrainsButton />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Total Records</h3>
                <p className="text-2xl font-bold">{recordCount}</p>
                {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
              </div>

              <div>
                <h3 className="font-medium">Imported Strains Found</h3>
                <p className="text-2xl font-bold">
                  {foundStrains.length} / {importedStrains.length}
                </p>

                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Found Strains:</h4>
                  <ul className="list-disc pl-5">
                    {foundStrains.map((strain) => (
                      <li key={strain.review_id}>
                        {strain.strain_name} by {strain.producer} - Score: {strain.total_score.toFixed(2)}
                      </li>
                    ))}
                  </ul>

                  {foundStrains.length < importedStrains.length && (
                    <>
                      <h4 className="text-sm font-medium mt-4">Missing Strains:</h4>
                      <ul className="list-disc pl-5">
                        {importedStrains
                          .filter((strain) => !foundStrains.some((found) => found.strain_name === strain))
                          .map((strain) => (
                            <li key={strain} className="text-red-500">
                              {strain}
                            </li>
                          ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

