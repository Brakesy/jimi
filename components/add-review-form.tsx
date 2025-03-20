"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { addReview } from "@/lib/actions"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TerpeneProfileInput } from "./terpene-profile-input"

export function AddReviewForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [terpeneProfile, setTerpeneProfile] = useState<Record<string, number>>({})

  // Use useCallback to memoize the terpene profile handler
  const handleTerpeneProfileChange = useCallback((profile: Record<string, number>) => {
    setTerpeneProfile(profile)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)

      // Add terpene profile to form data
      formData.append("terpene_profile", JSON.stringify(terpeneProfile))

      const result = await addReview(formData)

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        })

        // Redirect to the review page
        if (result.data?.review_id) {
          router.push(`/reviews/${result.data.review_id}`)
        } else {
          router.push("/reviews")
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add review",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Add New Review</CardTitle>
          <CardDescription>Enter the details of the cannabis product you want to review.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="strain_name">Strain Name</Label>
                <Input id="strain_name" name="strain_name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="producer">Producer/LP</Label>
                <Input id="producer" name="producer" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="package_date">Package Date</Label>
                <Input id="package_date" name="package_date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thc_percentage">THC %</Label>
                <Input
                  id="thc_percentage"
                  name="thc_percentage"
                  type="number"
                  step="0.1"
                  min="0"
                  max="40"
                  placeholder="20.0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terpene_percentage">Terpene %</Label>
                <Input
                  id="terpene_percentage"
                  name="terpene_percentage"
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  placeholder="2.0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxonomy">Taxonomy</Label>
              <Select name="taxonomy" defaultValue="Hybrid">
                <SelectTrigger>
                  <SelectValue placeholder="Select taxonomy" />
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
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Terpene Profile</h3>
            <TerpeneProfileInput onChange={handleTerpeneProfileChange} initialProfile={terpeneProfile} />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Rating Categories</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="flower_structure">Flower Structure</Label>
                  <span className="text-sm text-muted-foreground" id="flower_structure_value">
                    5
                  </span>
                </div>
                <Slider
                  id="flower_structure"
                  name="flower_structure"
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[5]}
                  onValueChange={(value) => {
                    document.getElementById("flower_structure_value")!.textContent = value[0].toString()
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="trichome_density">Trichome Density</Label>
                  <span className="text-sm text-muted-foreground" id="trichome_density_value">
                    5
                  </span>
                </div>
                <Slider
                  id="trichome_density"
                  name="trichome_density"
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[5]}
                  onValueChange={(value) => {
                    document.getElementById("trichome_density_value")!.textContent = value[0].toString()
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="trim">Trim</Label>
                  <span className="text-sm text-muted-foreground" id="trim_value">
                    5
                  </span>
                </div>
                <Slider
                  id="trim"
                  name="trim"
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[5]}
                  onValueChange={(value) => {
                    document.getElementById("trim_value")!.textContent = value[0].toString()
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="burn">Burn</Label>
                  <span className="text-sm text-muted-foreground" id="burn_value">
                    5
                  </span>
                </div>
                <Slider
                  id="burn"
                  name="burn"
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[5]}
                  onValueChange={(value) => {
                    document.getElementById("burn_value")!.textContent = value[0].toString()
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="ash_color">Ash Color</Label>
                  <span className="text-sm text-muted-foreground" id="ash_color_value">
                    5
                  </span>
                </div>
                <Slider
                  id="ash_color"
                  name="ash_color"
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[5]}
                  onValueChange={(value) => {
                    document.getElementById("ash_color_value")!.textContent = value[0].toString()
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="flavor">Flavor</Label>
                  <span className="text-sm text-muted-foreground" id="flavor_value">
                    5
                  </span>
                </div>
                <Slider
                  id="flavor"
                  name="flavor"
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[5]}
                  onValueChange={(value) => {
                    document.getElementById("flavor_value")!.textContent = value[0].toString()
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="intensity">Intensity</Label>
                  <span className="text-sm text-muted-foreground" id="intensity_value">
                    5
                  </span>
                </div>
                <Slider
                  id="intensity"
                  name="intensity"
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[5]}
                  onValueChange={(value) => {
                    document.getElementById("intensity_value")!.textContent = value[0].toString()
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="clarity">Clarity</Label>
                  <span className="text-sm text-muted-foreground" id="clarity_value">
                    5
                  </span>
                </div>
                <Slider
                  id="clarity"
                  name="clarity"
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[5]}
                  onValueChange={(value) => {
                    document.getElementById("clarity_value")!.textContent = value[0].toString()
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

