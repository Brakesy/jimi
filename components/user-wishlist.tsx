"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { scoreToGrade, getGradeColor } from "@/lib/utils"
import { removeFromWishlist } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Search, X } from "lucide-react"

interface WishlistItem {
  id: number
  product_reviews: {
    review_id: number
    strain_name: string
    producer: string
    taxonomy: string
    total_score: number
  }
}

interface UserWishlistProps {
  wishlist: WishlistItem[]
  userId: string
}

export function UserWishlist({ wishlist, userId }: UserWishlistProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [items, setItems] = useState(wishlist)

  const filteredItems = items
    .filter(
      (item) =>
        searchTerm === "" ||
        item.product_reviews.strain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product_reviews.producer.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.product_reviews.strain_name.localeCompare(b.product_reviews.strain_name)
      } else if (sortBy === "score") {
        return b.product_reviews.total_score - a.product_reviews.total_score
      } else if (sortBy === "producer") {
        return a.product_reviews.producer.localeCompare(b.product_reviews.producer)
      }
      return 0
    })

  const handleRemove = async (id: number) => {
    try {
      const result = await removeFromWishlist(userId, id)

      if (result.success) {
        setItems(items.filter((item) => item.id !== id))
        toast({
          title: "Removed from wishlist",
          description: "The strain has been removed from your wishlist.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove from wishlist",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Your wishlist is empty.</p>
        <Link href="/database" className="text-primary hover:underline mt-2 inline-block">
          Browse strains to add to your wishlist
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
            placeholder="Search your wishlist..."
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
            <SelectItem value="name">Strain Name (A-Z)</SelectItem>
            <SelectItem value="score">Score (Highest First)</SelectItem>
            <SelectItem value="producer">Producer (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => {
          const { review_id, strain_name, producer, taxonomy, total_score } = item.product_reviews
          const grade = scoreToGrade(total_score)

          return (
            <Card key={item.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/reviews/${review_id}`} className="font-medium hover:underline">
                    {strain_name}
                  </Link>
                  <div className="text-sm text-muted-foreground">{producer}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {taxonomy?.toLowerCase()}
                  </Badge>
                  <Badge className={getGradeColor(grade)}>{grade}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemove(item.id)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Added to wishlist</div>
                <div className="font-medium">{total_score}/100</div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

