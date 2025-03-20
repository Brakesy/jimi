"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function ImportStrainsButton() {
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const router = useRouter()

  const importStrains = async () => {
    setIsImporting(true)
    setResult(null)

    try {
      // Create a client directly in the component
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

      // Insert the example strains
      const { error } = await supabase.rpc("import_example_strains")

      if (error) {
        throw new Error(error.message)
      }

      setResult({
        success: true,
        message: "Successfully imported example strains!",
      })

      // Refresh the page data
      router.refresh()
    } catch (error) {
      console.error("Error importing strains:", error)
      setResult({
        success: false,
        message: `Error importing strains: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={importStrains} disabled={isImporting} className="w-full">
        {isImporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Importing Strains...
          </>
        ) : (
          "Import Example Strains"
        )}
      </Button>

      {result && (
        <div className={`p-4 rounded-md ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {result.message}
        </div>
      )}
    </div>
  )
}

