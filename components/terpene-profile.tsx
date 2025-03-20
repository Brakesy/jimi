"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"

interface TerpeneProfileProps {
  profile: Record<string, number>
}

export function TerpeneProfile({ profile }: TerpeneProfileProps) {
  // Convert the profile object to an array for the chart
  const data = Object.entries(profile).map(([name, value]) => ({
    name,
    value,
  }))

  // Colors for different terpenes
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

  // Terpene descriptions
  const terpeneInfo: Record<string, string> = {
    myrcene: "Earthy, musky aroma. May promote relaxation and sleep.",
    limonene: "Citrus aroma. May elevate mood and provide stress relief.",
    caryophyllene: "Peppery, spicy aroma. May help reduce inflammation.",
    pinene: "Pine aroma. May promote alertness and memory retention.",
    terpinolene: "Floral, herbal aroma. May have sedative effects.",
    linalool: "Floral, lavender aroma. May help with anxiety and stress.",
    humulene: "Hoppy, earthy aroma. May help reduce inflammation.",
    ocimene: "Sweet, herbal aroma. May have antiviral and antibacterial properties.",
  }

  if (!profile || Object.keys(profile).length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No terpene profile available for this product.</div>
  }

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {data.map((terpene, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <div>
                <div className="font-medium capitalize">
                  {terpene.name} ({terpene.value}%)
                </div>
                <div className="text-sm text-muted-foreground">
                  {terpeneInfo[terpene.name.toLowerCase()] || "No information available."}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

