export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      product_reviews: {
        Row: {
          review_id: number
          strain_name: string
          producer: string
          package_date: string | null
          thc_percentage: number | null
          terpene_percentage: number | null
          taxonomy: string | null
          flower_structure: number | null
          trichome_density: number | null
          trim: number | null
          burn: number | null
          ash_color: number | null
          flavor: number | null
          intensity: number | null
          clarity: number | null
          total_score: number
          terpene_profile: Json | null
          created_at: string
          updated_at: string | null
          user_id: string | null
          upc: string | null
          notes: string | null
          image_url: string | null
        }
        Insert: {
          review_id?: number
          strain_name: string
          producer: string
          package_date?: string | null
          thc_percentage?: number | null
          terpene_percentage?: number | null
          taxonomy?: string | null
          flower_structure?: number | null
          trichome_density?: number | null
          trim?: number | null
          burn?: number | null
          ash_color?: number | null
          flavor?: number | null
          intensity?: number | null
          clarity?: number | null
          total_score: number
          terpene_profile?: Json | null
          created_at?: string
          updated_at?: string | null
          user_id?: string | null
          upc?: string | null
          notes?: string | null
          image_url?: string | null
        }
        Update: {
          review_id?: number
          strain_name?: string
          producer?: string
          package_date?: string | null
          thc_percentage?: number | null
          terpene_percentage?: number | null
          taxonomy?: string | null
          flower_structure?: number | null
          trichome_density?: number | null
          trim?: number | null
          burn?: number | null
          ash_color?: number | null
          flavor?: number | null
          intensity?: number | null
          clarity?: number | null
          total_score?: number
          terpene_profile?: Json | null
          created_at?: string
          updated_at?: string | null
          user_id?: string | null
          upc?: string | null
          notes?: string | null
          image_url?: string | null
        }
      }
      users: {
        Row: {
          id: string
          username: string | null
          email: string | null
          created_at: string
          updated_at: string | null
          avatar_url: string | null
          bio: string | null
        }
        Insert: {
          id: string
          username?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string | null
          avatar_url?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string | null
          avatar_url?: string | null
          bio?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      import_example_strains: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

