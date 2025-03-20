"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search } from "lucide-react"
import { scoreToGrade, getGradeColor } from "@/lib/utils"

interface Review {
  review_id: number
  strain_name: string
  producer: string
  taxonomy: string
  thc_percentage: number | null
  terpene_percentage: number | null
  total_score: number
  created_at: string
}

interface ReviewsTableProps {
  initialReviews: Review[]
}

export function ReviewsTable({ initialReviews }: ReviewsTableProps) {
  const [reviews] = useState<Review[]>(initialReviews)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredReviews = reviews.filter(
    (review) =>
      review.strain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.taxonomy.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Producer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>THC/Terp %</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  {reviews.length === 0 ? "No reviews yet. Add your first review!" : "No reviews match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.review_id}>
                  <TableCell className="font-medium">
                    <Link href={`/reviews/${review.review_id}`} className="hover:underline">
                      {review.strain_name}
                    </Link>
                  </TableCell>
                  <TableCell>{review.producer}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {review.taxonomy?.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {review.thc_percentage ? `${review.thc_percentage}%` : "-"} /
                    {review.terpene_percentage ? `${review.terpene_percentage}%` : "-"}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getGradeColor(scoreToGrade(review.total_score))}`}>
                      {review.total_score}/100 ({scoreToGrade(review.total_score)})
                    </span>
                  </TableCell>
                  <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link href={`/reviews/${review.review_id}`} className="w-full">
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/reviews/${review.review_id}/edit`} className="w-full">
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

