"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getGradeColor } from "@/lib/utils"
import Link from "next/link"
import { Search } from "lucide-react"

interface Strain {
  strain_name: string
  producer: string
  taxonomy: string
  thc_percentage: number | null
  terpene_percentage: number | null
  avg: string
  grade: string
  count: number
}

interface DatabaseFiltersProps {
  initialStrains: Strain[]
}

export function DatabaseFilters({ initialStrains }: DatabaseFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("grade")

  const filteredStrains = useMemo(() => {
    return initialStrains
      .filter(
        (strain) =>
          (searchTerm === "" ||
            strain.strain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            strain.producer.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (gradeFilter === "all" || strain.grade.startsWith(gradeFilter)) &&
          (typeFilter === "all" || strain.taxonomy.toLowerCase().includes(typeFilter.toLowerCase())),
      )
      .sort((a, b) => {
        if (sortBy === "grade") {
          return Number.parseFloat(b.avg) - Number.parseFloat(a.avg)
        } else if (sortBy === "name") {
          return a.strain_name.localeCompare(b.strain_name)
        } else if (sortBy === "producer") {
          return a.producer.localeCompare(b.producer)
        } else if (sortBy === "reviews") {
          return b.count - a.count
        } else if (sortBy === "thc") {
          const aThc = a.thc_percentage || 0
          const bThc = b.thc_percentage || 0
          return bThc - aThc
        } else if (sortBy === "terpenes") {
          const aTerp = a.terpene_percentage || 0
          const bTerp = b.terpene_percentage || 0
          return bTerp - aTerp
        }
        return 0
      })
  }, [initialStrains, searchTerm, gradeFilter, typeFilter, sortBy])

  const gradeOptions = [
    { value: "all", label: "All Grades" },
    { value: "AAAA", label: "AAAA & AAAA+" },
    { value: "AAA", label: "AAA & AAA+" },
    { value: "AA", label: "AA & AA+" },
    { value: "A", label: "A & A+" },
    { value: "BBB", label: "BBB & BBB+" },
    { value: "BB", label: "BB & BB+" },
    { value: "B", label: "B & B+" },
  ]

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "indica", label: "Indica" },
    { value: "sativa", label: "Sativa" },
    { value: "hybrid", label: "Hybrid" },
  ]

  const sortOptions = [
    { value: "grade", label: "Grade (High to Low)" },
    { value: "name", label: "Strain Name (A-Z)" },
    { value: "producer", label: "Producer (A-Z)" },
    { value: "reviews", label: "Number of Reviews" },
    { value: "thc", label: "THC % (High to Low)" },
    { value: "terpenes", label: "Terpene % (High to Low)" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search strains or producers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by grade" />
            </SelectTrigger>
            <SelectContent>
              {gradeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStrains.map((strain, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        <Link
                          href={`/strains/${strain.strain_name}?producer=${encodeURIComponent(strain.producer)}`}
                          className="hover:underline"
                        >
                          {strain.strain_name}
                        </Link>
                      </CardTitle>
                      <CardDescription>{strain.producer}</CardDescription>
                    </div>
                    <Badge className={`${getGradeColor(strain.grade)} bg-opacity-10`}>{strain.grade}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline" className="capitalize">
                        {strain.taxonomy?.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Score:</span>
                      <span className="font-medium">{strain.avg}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">THC:</span>
                      <span>{strain.thc_percentage ? `${strain.thc_percentage}%` : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Terpenes:</span>
                      <span>{strain.terpene_percentage ? `${strain.terpene_percentage}%` : "N/A"}</span>
                    </div>
                    <div className="flex justify-between col-span-2">
                      <span className="text-muted-foreground">Reviews:</span>
                      <span>{strain.count}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Strain</th>
                      <th className="py-3 px-4 text-left font-medium">Producer</th>
                      <th className="py-3 px-4 text-left font-medium">Type</th>
                      <th className="py-3 px-4 text-left font-medium">THC</th>
                      <th className="py-3 px-4 text-left font-medium">Terpenes</th>
                      <th className="py-3 px-4 text-left font-medium">Score</th>
                      <th className="py-3 px-4 text-left font-medium">Grade</th>
                      <th className="py-3 px-4 text-left font-medium">Reviews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStrains.map((strain, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">
                          <Link
                            href={`/strains/${strain.strain_name}?producer=${encodeURIComponent(strain.producer)}`}
                            className="hover:underline font-medium"
                          >
                            {strain.strain_name}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{strain.producer}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="capitalize">
                            {strain.taxonomy?.toLowerCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{strain.thc_percentage ? `${strain.thc_percentage}%` : "N/A"}</td>
                        <td className="py-3 px-4">
                          {strain.terpene_percentage ? `${strain.terpene_percentage}%` : "N/A"}
                        </td>
                        <td className="py-3 px-4 font-medium">{strain.avg}/100</td>
                        <td className="py-3 px-4">
                          <Badge className={`${getGradeColor(strain.grade)} bg-opacity-10`}>{strain.grade}</Badge>
                        </td>
                        <td className="py-3 px-4">{strain.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

