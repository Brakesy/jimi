"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { scoreToGrade, getGradeColor } from "@/lib/utils"
import Link from "next/link"
import { Search } from "lucide-react"

interface Review {
  review_id: number
  strain_name: string
  producer: string
  taxonomy: string
  total_score: number
  created_at: string
}

interface UserReviewsProps {
  reviews: Review[]
}

export function UserReviews({ reviews }: UserReviewsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")

  const filteredReviews = reviews
    .filter(
      (review) =>
        searchTerm === "" ||
        review.strain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.producer.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === "score") {
        return b.total_score - a.total_score
      } else if (sortBy === "name") {
        return a.strain_name.localeCompare(b.strain_name)
      }
      return 0
    })

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You haven't reviewed any strains yet.</p>
        <Link href="/add-review" className="text-primary hover:underline mt-2 inline-block">
          Add your first review
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date (Newest First)</SelectItem>
            <SelectItem value="score">Score (Highest First)</SelectItem>
            <SelectItem value="name">Strain Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredReviews.map((review) => {
          const grade = scoreToGrade(review.total_score)
          return (
            <Card key={review.review_id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/reviews/${review.review_id}`} className="font-medium hover:underline">
                    {review.strain_name}
                  </Link>
                  <div className="text-sm text-muted-foreground">{review.producer}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {review.taxonomy?.toLowerCase()}
                  </Badge>
                  <Badge className={getGradeColor(grade)}>{grade}</Badge>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</div>
                <div className="font-medium">{review.total_score}/100</div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

