import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUserProfile } from "@/lib/actions"
import { getUserRankColor } from "@/lib/utils"
import { UserReviews } from "@/components/user-reviews"
import { UserWishlist } from "@/components/user-wishlist"

export const revalidate = 0

export default async function ProfilePage() {
  // In a real app, you would get the user ID from authentication
  // For now, we'll use a placeholder user ID
  const userId = "user123"

  const { reviews, wishlist, reviewCount, userRank } = await getUserProfile(userId)

  // Calculate average score of user's reviews
  const avgScore =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.total_score, 0) / reviews.length : 0

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground">View your reviews, wishlist, and stats.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your cannabis review profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">U</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">User123</h2>
                <Badge className={`mt-1 ${getUserRankColor(userRank)}`}>{userRank}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{reviewCount}</p>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{avgScore.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Next Rank Progress</p>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(100, (reviewCount / (userRank === "Master Grower" ? 100 : userRank === "Head Cultivator" ? 75 : userRank === "Cannabis Connoisseur" ? 50 : userRank === "Budtender" ? 25 : userRank === "Enthusiast" ? 10 : 1)) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  {userRank === "Master Grower"
                    ? "Max level reached"
                    : `${reviewCount} / ${userRank === "Head Cultivator" ? 100 : userRank === "Cannabis Connoisseur" ? 75 : userRank === "Budtender" ? 50 : userRank === "Enthusiast" ? 25 : 10} reviews`}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">User Ranks</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Seedling</span>
                  <span>0-9 reviews</span>
                </div>
                <div className="flex justify-between">
                  <span>Enthusiast</span>
                  <span>10-24 reviews</span>
                </div>
                <div className="flex justify-between">
                  <span>Budtender</span>
                  <span>25-49 reviews</span>
                </div>
                <div className="flex justify-between">
                  <span>Cannabis Connoisseur</span>
                  <span>50-74 reviews</span>
                </div>
                <div className="flex justify-between">
                  <span>Head Cultivator</span>
                  <span>75-99 reviews</span>
                </div>
                <div className="flex justify-between">
                  <span>Master Grower</span>
                  <span>100+ reviews</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="reviews">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Cannabis Journey</CardTitle>
                <TabsList>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>Your reviews and wishlist</CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="reviews" className="mt-0">
                <UserReviews reviews={reviews} />
              </TabsContent>
              <TabsContent value="wishlist" className="mt-0">
                <UserWishlist wishlist={wishlist} userId={userId} />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

