import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert numerical score to letter grade
export function scoreToGrade(score: number): string {
  if (score >= 95) return "AAAA+"
  if (score >= 90) return "AAAA"
  if (score >= 85) return "AAA+"
  if (score >= 80) return "AAA"
  if (score >= 75) return "AA+"
  if (score >= 70) return "AA"
  if (score >= 65) return "A+"
  if (score >= 60) return "A"
  if (score >= 55) return "BBB+"
  if (score >= 50) return "BBB"
  if (score >= 45) return "BB+"
  if (score >= 40) return "BB"
  if (score >= 35) return "B+"
  return "B"
}

// Get color for grade display
export function getGradeColor(grade: string): string {
  if (grade.startsWith("AAAA")) return "text-purple-600"
  if (grade.startsWith("AAA")) return "text-green-600"
  if (grade.startsWith("AA")) return "text-emerald-600"
  if (grade.startsWith("A")) return "text-blue-600"
  if (grade.startsWith("BBB")) return "text-amber-600"
  if (grade.startsWith("BB")) return "text-orange-600"
  return "text-red-600" // B and B+
}

// Convert number of reviews to user rank
export function getUserRank(reviewCount: number): string {
  if (reviewCount >= 100) return "Master Grower"
  if (reviewCount >= 75) return "Head Cultivator"
  if (reviewCount >= 50) return "Cannabis Connoisseur"
  if (reviewCount >= 25) return "Budtender"
  if (reviewCount >= 10) return "Enthusiast"
  return "Seedling"
}

// Get color for user rank
export function getUserRankColor(rank: string): string {
  switch (rank) {
    case "Master Grower":
      return "text-purple-600"
    case "Head Cultivator":
      return "text-green-600"
    case "Cannabis Connoisseur":
      return "text-emerald-600"
    case "Budtender":
      return "text-blue-600"
    case "Enthusiast":
      return "text-amber-600"
    default:
      return "text-gray-600" // Seedling
  }
}

