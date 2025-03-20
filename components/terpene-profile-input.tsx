"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

interface TerpeneProfileInputProps {
  onChange: (profile: Record<string, number>) => void
  initialProfile?: Record<string, number>
}

export function TerpeneProfileInput({ onChange, initialProfile = {} }: TerpeneProfileInputProps) {
  const [profile, setProfile] = useState<Record<string, number>>(initialProfile)
  const [newTerpene, setNewTerpene] = useState("")

  // Use useCallback to memoize the onChange call to prevent infinite loops
  const notifyChange = useCallback(
    (newProfile: Record<string, number>) => {
      onChange(newProfile)
    },
    [onChange],
  )

  // Only call onChange when profile actually changes, not on every render
  useEffect(() => {
    notifyChange(profile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(profile), notifyChange]) // Use JSON.stringify to do a deep comparison

  const handleAddTerpene = (terpene: string) => {
    if (!terpene || profile[terpene]) {
      setNewTerpene("")
      return
    }

    setProfile((prevProfile) => ({
      ...prevProfile,
      [terpene]: 0.1,
    }))

    setNewTerpene("")
  }

  const handleRemoveTerpene = (terpene: string) => {
    setProfile((prevProfile) => {
      const newProfile = { ...prevProfile }
      delete newProfile[terpene]
      return newProfile
    })
  }

  const handleTerpeneValueChange = (terpene: string, value: number[]) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [terpene]: value[0],
    }))
  }

  const commonTerpenes = [
    "Myrcene",
    "Limonene",
    "Caryophyllene",
    "Pinene",
    "Terpinolene",
    "Linalool",
    "Humulene",
    "Ocimene",
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Enter terpene name" value={newTerpene} onChange={(e) => setNewTerpene(e.target.value)} />
        <Button type="button" variant="outline" onClick={() => handleAddTerpene(newTerpene)}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {commonTerpenes
          .filter((t) => !profile[t])
          .map((terpene) => (
            <Button
              key={terpene}
              type="button"
              variant="outline"
              className="justify-start"
              onClick={() => handleAddTerpene(terpene)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {terpene}
            </Button>
          ))}
      </div>

      <div className="space-y-3">
        {Object.entries(profile).map(([terpene, value]) => (
          <Card key={terpene} className="p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{terpene}</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{value.toFixed(1)}%</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveTerpene(terpene)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[value]}
                min={0.1}
                max={10}
                step={0.1}
                onValueChange={(value) => handleTerpeneValueChange(terpene, value)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

