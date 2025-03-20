"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation } from "lucide-react"

interface Dispensary {
  id: number
  name: string
  address: string
  city: string
  province: string
}

interface Availability {
  id: number
  price: number
  in_stock: boolean
  last_updated: string
  dispensaries: Dispensary
}

interface DispensaryMapProps {
  availability: Availability[]
}

export function DispensaryMap({ availability }: DispensaryMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Get user's location if they allow it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  if (availability.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No dispensary information available for this product.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {userLocation
          ? "Showing dispensaries near your location."
          : "Allow location access to see dispensaries near you."}
      </div>

      <div className="space-y-3">
        {availability.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="font-medium">{item.dispensaries.name}</div>
                <div className="text-sm text-muted-foreground">
                  {item.dispensaries.address}, {item.dispensaries.city}, {item.dispensaries.province}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={item.in_stock ? "default" : "outline"}>
                    {item.in_stock ? "In Stock" : "Out of Stock"}
                  </Badge>
                  {item.price && <Badge variant="secondary">${item.price.toFixed(2)}</Badge>}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  // Open in Google Maps
                  if (item.dispensaries.address) {
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${item.dispensaries.name} ${item.dispensaries.address} ${item.dispensaries.city} ${item.dispensaries.province}`,
                      )}`,
                      "_blank",
                    )
                  }
                }}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

