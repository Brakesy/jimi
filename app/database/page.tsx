import { getStrainAverages } from "@/lib/actions"
import { DatabaseFilters } from "@/components/database-filters"

export const revalidate = 0

export default async function DatabasePage() {
  const strains = await getStrainAverages()

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Strain Database</h1>
        <p className="text-muted-foreground">Browse and filter cannabis strains by grade, type, and more.</p>
      </div>

      <DatabaseFilters initialStrains={strains} />
    </div>
  )
}

