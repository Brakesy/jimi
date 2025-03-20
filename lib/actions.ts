"use server"

import { getSupabaseServer } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

interface ReviewData {
  strain_name: string
  producer: string
  package_date?: string | null
  thc_percentage?: number | null
  terpene_percentage?: number | null
  taxonomy?: string
  flower_structure?: number
  trichome_density?: number
  trim?: number
  burn?: number
  ash_color?: number
  flavor?: number
  intensity?: number
  clarity?: number
  notes?: string
  total_score?: number
  terpene_profile?: Record<string, number>
}

// Helper function to safely extract data from FormData or use direct object properties
function extractData(formData: FormData | ReviewData, key: string, defaultValue: any = null) {
  if (formData instanceof FormData) {
    const value = formData.get(key)
    return value !== null ? value : defaultValue
  } else {
    // @ts-ignore - accessing dynamic property
    return formData[key] !== undefined ? formData[key] : defaultValue
  }
}

export async function addReview(formData: FormData | ReviewData) {
  try {
    console.log("Type of formData:", formData.constructor.name)

    const supabase = getSupabaseServer()

    // Extract form data safely, handling both FormData and plain objects
    const strainName = String(extractData(formData, "strain_name", ""))
    const producer = String(extractData(formData, "producer", ""))
    const packageDate = extractData(formData, "package_date") as string | null

    // Parse numeric values
    const thcPercentage = Number.parseFloat(String(extractData(formData, "thc_percentage", 0)))
    const terpenePercentage = Number.parseFloat(String(extractData(formData, "terpene_percentage", 0)))
    const taxonomy = String(extractData(formData, "taxonomy", "Hybrid"))

    // Rating categories - parse as integers
    const flowerStructure = Number.parseInt(String(extractData(formData, "flower_structure", 5)))
    const trichomeDensity = Number.parseInt(String(extractData(formData, "trichome_density", 5)))
    const trim = Number.parseInt(String(extractData(formData, "trim", 5)))
    const burn = Number.parseInt(String(extractData(formData, "burn", 5)))
    const ashColor = Number.parseInt(String(extractData(formData, "ash_color", 5)))
    const flavor = Number.parseInt(String(extractData(formData, "flavor", 5)))
    const intensity = Number.parseInt(String(extractData(formData, "intensity", 5)))
    const clarity = Number.parseInt(String(extractData(formData, "clarity", 5)))

    // Calculate the raw score using the formula
    const rawScore =
      0.598 +
      5.046 * terpenePercentage +
      0.994 * thcPercentage +
      0.937 * clarity +
      1.057 * intensity +
      1.002 * trichomeDensity +
      0.906 * flowerStructure +
      1.037 * trim +
      1.021 * flavor +
      1.033 * burn +
      0.945 * ashColor

    // Convert raw score to /100 score
    const scoreOutOf100 = 0.702 * rawScore - 0.00006
    const totalScore = Math.min(Math.round(scoreOutOf100 * 100) / 100, 100)

    // Parse terpene profile if available
    let terpeneProfile = {}
    try {
      if (formData instanceof FormData) {
        const terpeneProfileData = formData.get("terpene_profile") as string
        if (terpeneProfileData) {
          terpeneProfile = JSON.parse(terpeneProfileData)
        }
      } else if (formData.terpene_profile) {
        terpeneProfile = formData.terpene_profile
      }
    } catch (error) {
      console.error("Error parsing terpene profile:", error)
    }

    // Validate required fields
    if (!strainName || !producer) {
      return {
        success: false,
        error: "Strain name and producer are required",
      }
    }

    // Insert the review into the database
    const { data, error } = await supabase
      .from("product_reviews")
      .insert([
        {
          strain_name: strainName,
          producer: producer,
          package_date: packageDate || null,
          thc_percentage: isNaN(thcPercentage) ? 0 : thcPercentage,
          terpene_percentage: isNaN(terpenePercentage) ? 0 : terpenePercentage,
          taxonomy: taxonomy || "Hybrid",
          flower_structure: isNaN(flowerStructure) ? 5 : flowerStructure,
          trichome_density: isNaN(trichomeDensity) ? 5 : trichomeDensity,
          trim: isNaN(trim) ? 5 : trim,
          burn: isNaN(burn) ? 5 : burn,
          ash_color: isNaN(ashColor) ? 5 : ashColor,
          flavor: isNaN(flavor) ? 5 : flavor,
          intensity: isNaN(intensity) ? 5 : intensity,
          clarity: isNaN(clarity) ? 5 : clarity,
          total_score: totalScore,
          terpene_profile: terpeneProfile,
        },
      ])
      .select()

    if (error) {
      console.error("Error adding review:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the reviews page to show the new review
    revalidatePath("/reviews")
    revalidatePath("/")

    return {
      success: true,
      data: data[0],
      message: "Review added successfully!",
    }
  } catch (error) {
    console.error("Error in addReview:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export interface ProductData {
  strain_name: string
  producer: string
  package_date: string | null
  thc_percentage: number | null
  terpene_percentage: number | null
  taxonomy: string
  upc_code: string
  terpene_profile?: any
  description?: string
  image_url?: string
}

// Helper function to convert score to letter grade
const scoreToGrade = (score: number): string => {
  if (score >= 90) return "A+"
  if (score >= 80) return "A"
  if (score >= 70) return "B"
  if (score >= 60) return "C"
  if (score >= 50) return "D"
  return "F"
}

// Helper function to determine user rank based on review count
const getUserRank = (reviewCount: number): string => {
  if (reviewCount >= 100) return "Master Reviewer"
  if (reviewCount >= 50) return "Expert Reviewer"
  if (reviewCount >= 10) return "Advanced Reviewer"
  if (reviewCount >= 5) return "Enthusiast"
  return "Newbie"
}

export async function addProduct(data: ProductData) {
  try {
    const supabase = getSupabaseServer()

    // Validate required fields
    if (!data.strain_name || !data.producer) {
      return { error: "Strain name and producer are required" }
    }

    // Ensure numeric values are properly formatted
    const productData = {
      ...data,
      thc_percentage: data.thc_percentage !== null ? Number(data.thc_percentage) : null,
      terpene_percentage: data.terpene_percentage !== null ? Number(data.terpene_percentage) : null,
    }

    // Check if product with UPC already exists
    if (productData.upc_code) {
      const { data: existingProduct } = await supabase
        .from("product_reviews")
        .select("review_id")
        .eq("upc_code", productData.upc_code)
        .single()

      if (existingProduct) {
        return { error: "A product with this UPC code already exists" }
      }
    }

    // Insert the new product directly into product_reviews
    const { data: newProduct, error } = await supabase
      .from("product_reviews")
      .insert({
        strain_name: productData.strain_name,
        producer: productData.producer,
        package_date: productData.package_date,
        thc_percentage: productData.thc_percentage,
        terpene_percentage: productData.terpene_percentage,
        taxonomy: productData.taxonomy,
        upc_code: productData.upc_code,
        description: productData.description,
        image_url: productData.image_url,
        terpene_profile: productData.terpene_profile,
        // Set default values for review fields
        flower_structure: 5,
        trichome_density: 5,
        trim: 5,
        burn: 5,
        ash_color: 5,
        flavor: 5,
        intensity: 5,
        clarity: 5,
        total_score: 50, // Default score
      })
      .select("review_id")
      .single()

    if (error) {
      console.error("Error inserting product:", error)
      return { error: `Failed to create product: ${error.message}` }
    }

    return { success: true, productId: newProduct.review_id }
  } catch (error) {
    console.error("Error in addProduct:", error)
    return { error: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` }
  }
}

export async function searchByUPC(upcCode: string) {
  try {
    const supabase = getSupabaseServer()

    const { data, error } = await supabase.from("product_reviews").select("review_id").eq("upc_code", upcCode).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      console.error("Error searching by UPC:", error)
      return { error: "Failed to search for product" }
    }

    if (!data) {
      return { found: false }
    }

    return { found: true, productId: data.review_id }
  } catch (error) {
    console.error("Error in searchByUPC:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function getReviews() {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase.from("product_reviews").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return data || []
}

export async function getReviewById(id: number) {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase.from("product_reviews").select("*").eq("review_id", id).single()

  if (error) {
    console.error("Error fetching review:", error)
    return null
  }

  return data
}

export async function getProductById(id: number) {
  const supabase = getSupabaseServer()

  // Get the product details
  const { data: product, error: productError } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("review_id", id)
    .single()

  if (productError) {
    console.error("Error fetching product:", productError)
    return null
  }

  // Get similar products/reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("strain_name", product.strain_name)
    .neq("review_id", id)
    .order("created_at", { ascending: false })

  if (reviewsError) {
    console.error("Error fetching product reviews:", reviewsError)
  }

  // For expert reviews and availability, we'll return empty arrays since these tables might not exist
  const expertReviews = []
  const availability = []

  return {
    product,
    reviews: reviews || [],
    expertReviews,
    availability,
  }
}

export async function getNearbyDispensaries(latitude: number, longitude: number, radius = 10) {
  const supabase = getSupabaseServer()

  // This is a simplified version - in a real app, you would use PostGIS for proper geospatial queries
  // For now, we'll just get all dispensaries and filter them client-side
  const { data, error } = await supabase.from("dispensaries").select("*")

  if (error) {
    console.error("Error fetching dispensaries:", error)
    return []
  }

  return data || []
}

export async function addExpertReview(productId: number, expertName: string, score: number, reviewText: string) {
  try {
    const supabase = getSupabaseServer()

    const { error } = await supabase.from("expert_reviews").insert({
      product_id: productId,
      expert_name: expertName,
      score,
      review_text: reviewText,
    })

    if (error) {
      console.error("Error adding expert review:", error)
      return { error: "Failed to add expert review" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in addExpertReview:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function getStrainAverages() {
  const supabase = getSupabaseServer()

  // Group by strain name and producer to get averages
  const { data, error } = await supabase
    .from("product_reviews")
    .select(`
      strain_name,
      producer,
      taxonomy,
      thc_percentage,
      terpene_percentage,
      count(*),
      avg(total_score)
    `)
    .group("strain_name, producer, taxonomy, thc_percentage, terpene_percentage")
    .order("avg", { ascending: false })

  if (error) {
    console.error("Error fetching strain averages:", error)
    return []
  }

  // Format the data with letter grades
  return (
    data?.map((strain) => ({
      ...strain,
      avg: Number.parseFloat(strain.avg).toFixed(2),
      grade: scoreToGrade(Number.parseFloat(strain.avg)),
    })) || []
  )
}

export async function getUserProfile(userId: string) {
  const supabase = getSupabaseServer()

  // Get user's reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (reviewsError) {
    console.error("Error fetching user reviews:", reviewsError)
  }

  // Get user's wishlist
  const { data: wishlist, error: wishlistError } = await supabase
    .from("user_wishlist")
    .select(`
      id,
      product_reviews (
        review_id,
        strain_name,
        producer,
        taxonomy,
        total_score
      )
    `)
    .eq("user_id", userId)

  if (wishlistError) {
    console.error("Error fetching user wishlist:", wishlistError)
  }

  // Calculate user rank based on number of reviews
  const reviewCount = reviews?.length || 0
  const userRank = getUserRank(reviewCount)

  return {
    reviews: reviews || [],
    wishlist: wishlist || [],
    reviewCount,
    userRank,
  }
}

export async function addToWishlist(userId: string, productId: number) {
  try {
    const supabase = getSupabaseServer()

    // Check if already in wishlist
    const { data: existing } = await supabase
      .from("user_wishlist")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single()

    if (existing) {
      return { success: true, message: "Already in wishlist" }
    }

    // Add to wishlist
    const { error } = await supabase.from("user_wishlist").insert({
      user_id: userId,
      product_id: productId,
    })

    if (error) {
      console.error("Error adding to wishlist:", error)
      return { error: "Failed to add to wishlist" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in addToWishlist:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function removeFromWishlist(userId: string, wishlistId: number) {
  try {
    const supabase = getSupabaseServer()

    const { error } = await supabase.from("user_wishlist").delete().eq("id", wishlistId).eq("user_id", userId)

    if (error) {
      console.error("Error removing from wishlist:", error)
      return { error: "Failed to remove from wishlist" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in removeFromWishlist:", error)
    return { error: "An unexpected error occurred" }
  }
}

