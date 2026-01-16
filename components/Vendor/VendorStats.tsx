'use client'

import { Card } from "@/components/ui/card"
import { IconCar, IconCalendar, IconCurrencyDollar, IconCheck } from "@tabler/icons-react"

interface VendorStatsProps {
  totalCars: number
  availableCars: number
  avgDailyRate: number
  memberSince: Date
  totalEarnings: number
}

export function VendorStats({ 
  totalCars, 
  availableCars, 
  avgDailyRate, 
  memberSince,
  totalEarnings 
}: VendorStatsProps) {
  const stats = [
    {
      label: 'Total Vehicles',
      value: totalCars.toString(),
      icon: IconCar,
      description: `${availableCars} available`
    },
    {
      label: 'Member Since',
      value: new Date(memberSince).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }),
      icon: IconCalendar,
      description: 'Active vendor'
    },
    {
      label: 'Avg. Daily Rate',
      value: `$${avgDailyRate.toFixed(0)}`,
      icon: IconCurrencyDollar,
      description: 'Per vehicle'
    },
    {
      label: 'Completed Trips',
      value: '—',
      icon: IconCheck,
      description: 'Coming soon'
    }
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 py-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
