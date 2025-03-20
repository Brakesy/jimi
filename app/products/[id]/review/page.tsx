import { getProductById } from "@/lib/actions"
import { MultiStepReviewForm } from "@/components/multi-step-review-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function ProductReviewPage({ params }: { params: { id: string } }) {
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

  const { product } = productData

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/products/${product.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Review Product</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span>{product.strain_name}</span>
            <span>•</span>
            <span className="text-muted-foreground">{product.producer}</span>
            <Badge variant="outline" className="ml-2 capitalize">
              {product.taxonomy?.toLowerCase()}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You're reviewing {product.strain_name} by {product.producer}.
            {product.thc_percentage && ` THC: ${product.thc_percentage}%.`}
            {product.terpene_percentage && ` Terpenes: ${product.terpene_percentage}%.`}
          </p>
        </CardContent>
      </Card>

      <MultiStepReviewForm />
    </div>
  )
}

