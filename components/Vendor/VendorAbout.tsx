'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VendorAboutProps {
  businessName: string
  status: 'pending' | 'approved' | 'suspended' | 'rejected'
  approvedAt: Date | null
}

export function VendorAbout({ businessName, status, approvedAt }: VendorAboutProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">About</h2>
        <p className="text-muted-foreground">
          {businessName} is a professional car rental service committed to providing 
          quality vehicles and excellent customer service. All vehicles are regularly 
          maintained and inspected to ensure safety and reliability.
        </p>
      </div>

      {approvedAt && (
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Verified since</span>
            <Badge variant="secondary">
              {new Date(approvedAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </Badge>
          </div>
        </div>
      )}
    </Card>
  )
}
