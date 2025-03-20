"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, X } from "lucide-react"
import { searchByUPC } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

export default function ScanPage() {
  const router = useRouter()
  const [upcCode, setUpcCode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Function to handle manual UPC search
  const handleSearch = async () => {
    if (!upcCode) {
      toast({
        title: "Error",
        description: "Please enter a UPC code",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSearching(true)
      const result = await searchByUPC(upcCode)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.productId) {
        router.push(`/products/${result.productId}`)
      } else {
        toast({
          title: "Product Not Found",
          description: "No product found with this UPC code. Would you like to add it?",
          action: (
            <Button variant="outline" onClick={() => router.push(`/add-product?upc=${upcCode}`)}>
              Add Product
            </Button>
          ),
        })
      }
    } catch (error) {
      console.error("Error searching by UPC:", error)
      toast({
        title: "Error",
        description: "Failed to search for product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Function to start camera for scanning
  const startScanner = async () => {
    setIsScanning(true)

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()

          // Start scanning for barcodes
          scanBarcode()
        }
      } else {
        toast({
          title: "Camera Not Available",
          description: "Your device doesn't support camera access or permission was denied.",
          variant: "destructive",
        })
        setIsScanning(false)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      })
      setIsScanning(false)
    }
  }

  // Function to stop camera
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()

      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }

    setIsScanning(false)
  }

  // Function to scan for barcodes
  const scanBarcode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // This is a placeholder for actual barcode scanning logic
    // In a real app, you would use a library like quagga.js or zxing
    // For now, we'll just simulate finding a barcode after a few seconds

    setTimeout(() => {
      if (isScanning) {
        // Simulate finding a barcode
        const simulatedUPC = "123456789012"
        setUpcCode(simulatedUPC)
        stopScanner()

        toast({
          title: "UPC Code Detected",
          description: `Found UPC: ${simulatedUPC}`,
        })
      }
    }, 3000)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isScanning) {
        stopScanner()
      }
    }
  }, [isScanning])

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Scan UPC Code</CardTitle>
          <CardDescription>Scan a product's UPC code to find reviews or add a new product.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isScanning ? (
            <div className="relative">
              <video ref={videoRef} className="w-full h-64 bg-black rounded-md object-cover" />
              <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full hidden" />
              <Button variant="outline" size="icon" className="absolute top-2 right-2" onClick={stopScanner}>
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-1 bg-red-500 opacity-50" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upc">UPC Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="upc"
                    value={upcCode}
                    onChange={(e) => setUpcCode(e.target.value)}
                    placeholder="Enter UPC code"
                  />
                  <Button variant="outline" size="icon" onClick={startScanner}>
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSearch} disabled={isSearching || !upcCode}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

