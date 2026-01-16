'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconCheck, IconMail, IconPhone } from "@tabler/icons-react"
import Image from "next/image"

interface VendorProfileHeaderProps {
  user: {
    id: string
    name: string
    email: string
    image: string | null
    profileImageUrl: string | null
    phoneNumber: string | null
  }
  vendor: {
    businessName: string
    status: 'pending' | 'approved' | 'suspended' | 'rejected'
    createdAt: Date
  }
}

function getUserInitials(name: string, email: string): string {
  if (name) {
    const names = name.trim().split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

export function VendorProfileHeader({ user, vendor }: VendorProfileHeaderProps) {
  const initials = getUserInitials(user.name, user.email)

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Profile Info */}
          <div className="flex gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt={`${user.name} profile`}
                  width={96}
                  height={96}
                  className="rounded-full object-cover border-2 border-muted"
                  priority
                />
              ) : (
                <Avatar className="h-24 w-24 border-2 border-muted">
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback className="text-2xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Name & Business */}
            <div className="space-y-2">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {user.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {vendor.businessName}
                </p>
              </div>

              {/* Status Badge */}
              {vendor.status === 'approved' && (
                <Badge variant="secondary" className="gap-1">
                  <IconCheck className="h-3 w-3" />
                  Verified Vendor
                </Badge>
              )}

              {/* Contact Info */}
              <div className="flex flex-col gap-2 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <IconMail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <IconPhone className="h-4 w-4" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="gap-2">
              <IconMail className="h-4 w-4" />
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
