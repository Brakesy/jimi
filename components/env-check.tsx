"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EnvCheck() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables Check</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="font-mono text-sm">{key}</span>
              <span className={`text-sm ${value ? "text-green-600" : "text-red-600"}`}>
                {value ? "✓ Set" : "✗ Missing"}
              </span>
            </div>
          ))}

          <div className="text-sm text-muted-foreground mt-4">
            <p>
              Note: Server-side environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) cannot be checked from the
              client.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

