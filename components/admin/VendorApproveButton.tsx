"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Check } from "lucide-react"
import { } from "@/components/ui/button"

interface VendorApproveButtonProps {
  vendorId: string
  children?: React.ReactNode
  disabled?:boolean
  onSuccess?: () => void
  onError?: (error: Error) => void
}

const VendorApproveButton = ({ 
  vendorId, 
  onSuccess,
  onError,
  children,
  disabled,
  ...props 
}: VendorApproveButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  const handleApprove = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/vendor/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vendorId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to approve vendor')
      }

      const data = await response.json()
      
      setIsApproved(true)
      onSuccess?.()
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error('An error occurred')
      onError?.(err)
      console.error('Error approving vendor:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleApprove}
      disabled={disabled || isLoading || isApproved}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Approving...
        </>
      ) : isApproved ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Approved
        </>
      ) : (
        children || 'Approve Vendor'
      )}
    </Button>
  )
}

export default VendorApproveButton