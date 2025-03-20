import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Edit, Percent, MapPin, Star } from "lucide-react"
import { getProductById } from "@/lib/actions"
import { ProductReviews } from "@/components/product-reviews"
import { ExpertReviews } from "@/components/expert-reviews"
import { DispensaryMap } from "@/components/dispensary-map"
import { TerpeneProfile } from "@/components/terpene-profile"

export const revalidate = 0

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const productData = await getProductById(Number.parseInt(params.id))

  if (!productData || !productData.product) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="mt-2 text-muted-foreground">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="mt-4">
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { product, reviews, expertReviews, availability } = productData

  // Calculate average user score
  const avgUserScore =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.total_score, 0) / reviews.length : 0

  // Calculate average expert score
  const avgExpertScore =
    expertReviews.length > 0 ? expertReviews.reduce((sum, review) => sum + review.score, 0) / expertReviews.length : 0

  // Calculate THC and terpene multipliers for display
  const calculateMultipliers = () => {
    const thcPercentage = product.thc_percentage || 0
    const terpenePercentage = product.terpene_percentage || 0

    // THC multiplier with more nuanced curve
    let thcMultiplier
    if (thcPercentage <= 20) {
      // Linear increase up to 20% THC
      thcMultiplier = 1 + thcPercentage / 100
    } else if (thcPercentage <= 30) {
      // Slower increase from 20% to 30%
      thcMultiplier = 1.2 + (thcPercentage - 20) / 200
    } else {
      // Cap at 30% THC
      thcMultiplier = 1.25
    }

    const terpeneMultiplier = 1 + Math.min(terpenePercentage, 5) / 20

    return {
      thcMultiplier: thcMultiplier.toFixed(2),
      terpeneMultiplier: terpeneMultiplier.toFixed(2),
      combinedMultiplier: (thcMultiplier * terpeneMultiplier).toFixed(2),
    }
  }

  const multipliers = calculateMultipliers()

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  {product.image_url ? (
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.strain_name}
                      width={300}
                      height={300}
                      className="rounded-md object-cover w-full aspect-square"
                    />
                  ) : (
                    <div className="bg-muted rounded-md w-full aspect-square flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">{product.strain_name}</h1>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-muted-foreground">{product.producer}</span>
                      <Badge variant="outline" className="capitalize">
                        {product.taxonomy?.toLowerCase()}
                      </Badge>
                      {product.upc_code && (
                        <Badge variant="secondary" className="ml-auto">
                          UPC: {product.upc_code}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">THC Content</div>
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span>{product.thc_percentage ? `${product.thc_percentage}%` : "Not specified"}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Terpene Content</div>
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span>{product.terpene_percentage ? `${product.terpene_percentage}%` : "Not specified"}</span>
                      </div>
                    </div>
                    {product.package_date && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Package Date</div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(product.package_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {product.description && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Description</div>
                      <p className="text-muted-foreground">{product.description}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{avgUserScore.toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">({reviews.length} reviews)</span>
                    </div>
                    {expertReviews.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="font-medium">
                          JIMI Score: {avgExpertScore.toFixed(0)}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button asChild>
                      <Link href={`/products/${product.id}/review`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Add Review
                      </Link>
                    </Button>
                    {availability.length > 0 && (
                      <Button variant="outline" asChild>
                        <Link href={`/products/${product.id}?tab=availability`}>
                          <MapPin className="mr-2 h-4 w-4" />
                          Find Nearby
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="reviews">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews">User Reviews</TabsTrigger>
              <TabsTrigger value="expert">JIMI Expert Reviews</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Reviews</CardTitle>
                  <CardDescription>See what other users think about this product.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductReviews reviews={reviews} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="expert" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>JIMI Expert Reviews</CardTitle>
                  <CardDescription>Reviews from our panel of cannabis experts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpertReviews reviews={expertReviews} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="availability" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Where to Find</CardTitle>
                  <CardDescription>Dispensaries that carry this product.</CardDescription>
                </CardHeader>
                <CardContent>
                  <DispensaryMap availability={availability} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Score</CardTitle>
              <CardDescription>Score based on ratings with THC and terpene multipliers.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${avgUserScore * 2.51} 251.2`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute text-4xl font-bold">{avgUserScore.toFixed(1)}</div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground">out of 100</div>
                <div
                  className={`mt-2 font-medium ${avgUserScore >= 90 ? "text-green-600" : avgUserScore >= 80 ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {avgUserScore >= 90
                    ? "Exceptional"
                    : avgUserScore >= 80
                      ? "Very Good"
                      : avgUserScore >= 70
                        ? "Good"
                        : "Average"}
                </div>
              </div>

              <div className="mt-6 w-full space-y-2 text-sm">
                <h4 className="font-medium">Score Multipliers:</h4>
                {product.thc_percentage || product.terpene_percentage ? (
                  <div className="space-y-1">
                    {product.thc_percentage ? (
                      <div className="flex justify-between">
                        <span>THC ({product.thc_percentage}%):</span>
                        <span className="font-medium">×{multipliers.thcMultiplier}</span>
                      </div>
                    ) : null}
                    {product.terpene_percentage ? (
                      <div className="flex justify-between">
                        <span>Terpenes ({product.terpene_percentage}%):</span>
                        <span className="font-medium">×{multipliers.terpeneMultiplier}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between pt-1 border-t">
                      <span>Combined Multiplier:</span>
                      <span className="font-medium">×{multipliers.combinedMultiplier}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No THC or terpene data available for multiplier calculation.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {product.terpene_profile && (
            <Card>
              <CardHeader>
                <CardTitle>Terpene Profile</CardTitle>
                <CardDescription>Detailed breakdown of terpenes.</CardDescription>
              </CardHeader>
              <CardContent>
                <TerpeneProfile profile={product.terpene_profile} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

