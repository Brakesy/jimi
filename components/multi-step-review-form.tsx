"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { addReview } from "@/lib/actions"
import { Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TerpeneProfileInput } from "./terpene-profile-input"

const steps = [
  { id: "strain-info", title: "Strain Information" },
  { id: "terpene-profile", title: "Terpene Profile" },
  { id: "appearance", title: "Appearance" },
  { id: "experience", title: "Experience" },
  { id: "review", title: "Review" },
]

export function MultiStepReviewForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    strain_name: "",
    producer: "",
    package_date: "",
    thc_percentage: 20,
    terpene_percentage: 2,
    taxonomy: "Hybrid",
    flower_structure: 5,
    trichome_density: 5,
    trim: 5,
    burn: 5,
    ash_color: 5,
    flavor: 5,
    intensity: 5,
    clarity: 5,
    terpene_profile: {} as Record<string, number>,
  })

  const updateFormData = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Memoize the terpene profile handler to prevent unnecessary re-renders
  const handleTerpeneProfileChange = useCallback((profile: Record<string, number>) => {
    setFormData((prev) => {
      // Only update if the profile has actually changed
      if (JSON.stringify(prev.terpene_profile) === JSON.stringify(profile)) {
        return prev
      }
      return { ...prev, terpene_profile: profile }
    })
  }, [])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Strain Information
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="strain_name">Strain Name</Label>
                <Input
                  id="strain_name"
                  value={formData.strain_name}
                  onChange={(e) => updateFormData("strain_name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="producer">Producer/LP</Label>
                <Input
                  id="producer"
                  value={formData.producer}
                  onChange={(e) => updateFormData("producer", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="package_date">Package Date</Label>
                <Input
                  id="package_date"
                  type="date"
                  value={formData.package_date}
                  onChange={(e) => updateFormData("package_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thc_percentage">THC %</Label>
                <Input
                  id="thc_percentage"
                  type="number"
                  step="0.1"
                  min="0"
                  max="40"
                  placeholder="20.0"
                  value={formData.thc_percentage}
                  onChange={(e) => updateFormData("thc_percentage", Number.parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terpene_percentage">Terpene %</Label>
                <Input
                  id="terpene_percentage"
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  placeholder="2.0"
                  value={formData.terpene_percentage}
                  onChange={(e) => updateFormData("terpene_percentage", Number.parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxonomy">Taxonomy</Label>
              <Select value={formData.taxonomy} onValueChange={(value) => updateFormData("taxonomy", value)}>
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
        )

      case 1: // Terpene Profile
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Enter the terpene profile of the strain if available. You can add multiple terpenes and their percentages.
            </p>
            <TerpeneProfileInput onChange={handleTerpeneProfileChange} initialProfile={formData.terpene_profile} />
          </div>
        )

      case 2: // Appearance
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Rate the appearance aspects of the cannabis flower.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="flower_structure">Flower Structure</Label>
                  <span className="text-sm text-muted-foreground">{formData.flower_structure}</span>
                </div>
                <Slider
                  id="flower_structure"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.flower_structure]}
                  onValueChange={(value) => updateFormData("flower_structure", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="trichome_density">Trichome Density</Label>
                  <span className="text-sm text-muted-foreground">{formData.trichome_density}</span>
                </div>
                <Slider
                  id="trichome_density"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.trichome_density]}
                  onValueChange={(value) => updateFormData("trichome_density", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="trim">Trim</Label>
                  <span className="text-sm text-muted-foreground">{formData.trim}</span>
                </div>
                <Slider
                  id="trim"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.trim]}
                  onValueChange={(value) => updateFormData("trim", value[0])}
                />
              </div>
            </div>
          </div>
        )

      case 3: // Experience
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Rate the experience aspects of the cannabis flower.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="burn">Burn</Label>
                  <span className="text-sm text-muted-foreground">{formData.burn}</span>
                </div>
                <Slider
                  id="burn"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.burn]}
                  onValueChange={(value) => updateFormData("burn", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="ash_color">Ash Color</Label>
                  <span className="text-sm text-muted-foreground">{formData.ash_color}</span>
                </div>
                <Slider
                  id="ash_color"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.ash_color]}
                  onValueChange={(value) => updateFormData("ash_color", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="flavor">Flavor</Label>
                  <span className="text-sm text-muted-foreground">{formData.flavor}</span>
                </div>
                <Slider
                  id="flavor"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.flavor]}
                  onValueChange={(value) => updateFormData("flavor", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="intensity">Intensity</Label>
                  <span className="text-sm text-muted-foreground">{formData.intensity}</span>
                </div>
                <Slider
                  id="intensity"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.intensity]}
                  onValueChange={(value) => updateFormData("intensity", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="clarity">Clarity</Label>
                  <span className="text-sm text-muted-foreground">{formData.clarity}</span>
                </div>
                <Slider
                  id="clarity"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.clarity]}
                  onValueChange={(value) => updateFormData("clarity", value[0])}
                />
              </div>
            </div>
          </div>
        )

      case 4: // Review
        // Calculate the score
        const rawScore =
          0.598 +
          5.046 * formData.terpene_percentage +
          0.994 * formData.thc_percentage +
          0.937 * formData.clarity +
          1.057 * formData.intensity +
          1.002 * formData.trichome_density +
          0.906 * formData.flower_structure +
          1.037 * formData.trim +
          1.021 * formData.flavor +
          1.033 * formData.burn +
          0.945 * formData.ash_color

        const scoreOutOf100 = 0.702 * rawScore - 0.00006
        const totalScore = Math.min(Math.round(scoreOutOf100 * 100) / 100, 100)

        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Review your submission before finalizing.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Strain Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium">Strain Name</p>
                    <p>{formData.strain_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Producer</p>
                    <p>{formData.producer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">THC %</p>
                    <p>{formData.thc_percentage}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Terpene %</p>
                    <p>{formData.terpene_percentage}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Taxonomy</p>
                    <p>{formData.taxonomy}</p>
                  </div>
                  {formData.package_date && (
                    <div>
                      <p className="text-sm font-medium">Package Date</p>
                      <p>{formData.package_date}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ratings</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium">Flower Structure</p>
                    <p>{formData.flower_structure}/10</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Trichome Density</p>
                    <p>{formData.trichome_density}/10</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Trim</p>
                    <p>{formData.trim}/10</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Burn</p>
                    <p>{formData.burn}/10</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ash Color</p>
                    <p>{formData.ash_color}/10</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Flavor</p>
                    <p>{formData.flavor}/10</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Intensity</p>
                    <p>{formData.intensity}/10</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Clarity</p>
                    <p>{formData.clarity}/10</p>
                  </div>
                </div>
              </div>
            </div>

            {Object.keys(formData.terpene_profile).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Terpene Profile</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(formData.terpene_profile).map(([terpene, percentage]) => (
                    <div key={terpene}>
                      <p className="text-sm font-medium">{terpene}</p>
                      <p>{percentage}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-muted rounded-md">
              <div className="flex justify-between items-center">
                <p className="font-medium">Calculated Score</p>
                <p className="text-2xl font-bold">{totalScore.toFixed(2)}/100</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Review</CardTitle>
        <CardDescription>Enter the details of the cannabis product you want to review.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step indicator */}
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${index <= currentStep ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  index < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index === currentStep
                      ? "border-2 border-primary text-primary"
                      : "border-2 border-muted-foreground text-muted-foreground"
                }`}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
              </div>
              <span className="text-xs hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step content */}
        {renderStepContent()}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0 || isSubmitting}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep} disabled={isSubmitting}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

