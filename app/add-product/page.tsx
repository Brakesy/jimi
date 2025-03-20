"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { TerpeneEditor } from "@/components/terpene-editor"
import { addProduct } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

export default function AddProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const upcFromQuery = searchParams.get("upc")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    strain_name: "",
    producer: "",
    package_date: null as Date | null,
    thc_percentage: "",
    terpene_percentage: "",
    taxonomy: "Indica",
    upc_code: upcFromQuery || "",
    description: "",
    image_url: "",
    terpene_profile: {} as Record<string, number>,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleDateChange = (date: Date | null) => {
    setFormData({ ...formData, package_date: date })
  }

  const handleTerpeneChange = (profile: Record<string, number>) => {
    setFormData({ ...formData, terpene_profile: profile })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      const productData = {
        ...formData,
        package_date: formData.package_date ? formData.package_date.toISOString().split("T")[0] : null,
        thc_percentage: formData.thc_percentage ? Number.parseFloat(formData.thc_percentage) : null,
        terpene_percentage: formData.terpene_percentage ? Number.parseFloat(formData.terpene_percentage) : null,
      }

      const result = await addProduct(productData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Product added successfully!",
        })
        if (result.productId) {
          router.push(`/products/${result.productId}`)
        } else {
          router.push("/products")
        }
        router.refresh()
      }
    } catch (error) {
      console.error("Error submitting product:", error)
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Cannabis Product</CardTitle>
          <CardDescription>Add a new cannabis product to the database.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="strain_name">Strain Name</Label>
                  <Input
                    id="strain_name"
                    name="strain_name"
                    value={formData.strain_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="producer">Producer/LP</Label>
                  <Input
                    id="producer"
                    name="producer"
                    value={formData.producer}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upc_code">UPC Code</Label>
                  <Input id="upc_code" name="upc_code" value={formData.upc_code} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxonomy">Type</Label>
                  <Select value={formData.taxonomy} onValueChange={(value) => handleSelectChange("taxonomy", value)}>
                    <SelectTrigger id="taxonomy">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indica">Indica</SelectItem>
                      <SelectItem value="Sativa">Sativa</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Hybrid-Indica">Hybrid (Indica Dominant)</SelectItem>
                      <SelectItem value="Hybrid-Sativa">Hybrid (Sativa Dominant)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thc_percentage">THC %</Label>
                  <Input
                    id="thc_percentage"
                    name="thc_percentage"
                    value={formData.thc_percentage}
                    onChange={handleInputChange}
                    type="number"
                    step="0.1"
                    min="0"
                    max="35"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terpene_percentage">Terpene %</Label>
                  <Input
                    id="terpene_percentage"
                    name="terpene_percentage"
                    value={formData.terpene_percentage}
                    onChange={handleInputChange}
                    type="number"
                    step="0.1"
                    min="0"
                    max="15"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="package_date">Package Date</Label>
                  <DatePicker date={formData.package_date} setDate={handleDateChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the product, including aroma, flavor profile, effects, etc."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Terpene Profile</Label>
              <TerpeneEditor profile={formData.terpene_profile} onChange={handleTerpeneChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add Product"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

