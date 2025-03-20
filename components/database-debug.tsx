"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

export function DatabaseDebug() {
  const [isChecking, setIsChecking] = useState(false)
  const [status, setStatus] = useState<{
    connected: boolean
    message: string
    count?: number
    error?: string
  } | null>(null)

  const checkConnection = async () => {
    setIsChecking(true)
    setStatus(null)

    try {
      // Create a client directly in the component
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

      // Try to query the database
      const { data, error, count } = await supabase.from("product_reviews").select("*", { count: "exact" }).limit(1)

      if (error) {
        throw error
      }

      setStatus({
        connected: true,
        message: "Successfully connected to the database!",
        count: count || 0,
      })
    } catch (error) {
      console.error("Database connection error:", error)
      setStatus({
        connected: false,
        message: "Failed to connect to the database",
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    // Check connection on mount
    checkConnection()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Connection Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === null ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-md ${status.connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <p className="font-medium">{status.message}</p>
              {status.connected && <p className="mt-2">Found {status.count} records in the database.</p>}
              {!status.connected && status.error && <p className="mt-2 text-sm">Error: {status.error}</p>}
            </div>

            <Button onClick={checkConnection} disabled={isChecking} variant="outline" className="w-full">
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Connection...
                </>
              ) : (
                "Check Connection Again"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

