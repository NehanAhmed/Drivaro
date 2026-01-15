'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { toast } from 'sonner'
import { IconUser, IconPalette, IconCamera } from '@tabler/icons-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserProfile {
  id: string
  name: string
  email: string
  fullName: string | null
  phoneNumber: string | null
  image: string | null
  profileImageUrl: string | null
}

// Helper to get user initials
function getUserInitials(name?: string, email?: string): string {
  if (name) {
    const names = name.trim().split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) {
    return email.slice(0, 2).toUpperCase()
  }
  return 'U'
}

export default function SettingsPage({ 
  user 
}: { 
  user: UserProfile 
}) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.profileImageUrl || user?.image
  )
  const [hasChanges, setHasChanges] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setHasChanges(true)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file')
      return
    }

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setHasChanges(true)
      }
      reader.readAsDataURL(file)

      // Here you would upload to your storage service (e.g., S3, Cloudinary)
      // const uploadedUrl = await uploadImage(file)
      // For now, we'll use the preview as the URL
      
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Failed to process image')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasChanges) {
      toast.info('No changes to save')
      return
    }

    setIsLoading(true)

    try {
      // Build update payload with only changed fields
      const updatePayload: Record<string, string> = {}
      
      if (formData.name !== user.name && formData.name.trim()) {
        updatePayload.name = formData.name.trim()
      }
      
      if (formData.fullName !== (user.fullName || '') && formData.fullName.trim()) {
        updatePayload.fullName = formData.fullName.trim()
      }
      
      if (formData.email !== user.email && formData.email.trim()) {
        updatePayload.email = formData.email.trim()
      }
      
      if (formData.phoneNumber !== (user.phoneNumber || '') && formData.phoneNumber.trim()) {
        updatePayload.phoneNumber = formData.phoneNumber.trim()
      }

      if (imagePreview && imagePreview !== (user.profileImageUrl || user.image)) {
        updatePayload.profileImageUrl = imagePreview
      }

      // Check if there are actual changes to send
      if (Object.keys(updatePayload).length === 0) {
        toast.info('No changes detected')
        setIsLoading(false)
        setHasChanges(false)
        return
      }

      // Make API call
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please log in again.')
          // Redirect to login
          window.location.href = '/login'
          return
        }
        
        if (response.status === 409) {
          toast.error(data.message || 'Email already in use')
          return
        }

        if (data.details) {
          // Show validation errors
          data.details.forEach((detail: { field: string; message: string }) => {
            toast.error(`${detail.field}: ${detail.message}`)
          })
          return
        }

        throw new Error(data.message || 'Failed to update profile')
      }

      // Success
      toast.success('Profile updated successfully')
      setHasChanges(false)
      
      // Optionally refresh the page to get updated data
      // window.location.reload()

    } catch (error) {
      console.error('Profile update error:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to update profile. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: user.name || '',
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
    })
    setImagePreview(user.profileImageUrl || user.image)
    setHasChanges(false)
    toast.info('Changes discarded')
  }

  const initials = getUserInitials(formData.name, formData.email)

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-hanken-grotesk">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile" className="gap-2">
              <IconUser size={16} />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <IconPalette size={16} />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={imagePreview || undefined} alt={formData.name} />
                      <AvatarFallback className="text-2xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span className="flex items-center gap-2">
                            <IconCamera size={16} />
                            Change Photo
                          </span>
                        </Button>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          className="hidden"
                          onChange={handleImageChange}
                          disabled={isLoading}
                        />
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max size 5MB
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        maxLength={100}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-muted-foreground text-xs">(Optional)</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        maxLength={200}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phoneNumber">
                        Phone Number <span className="text-muted-foreground text-xs">(Optional)</span>
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        maxLength={20}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3">
                    {hasChanges && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleReset}
                        disabled={isLoading}
                      >
                        Discard
                      </Button>
                    )}
                    <Button type="submit" disabled={isLoading || !hasChanges}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Choose your preferred color scheme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Color Mode</Label>
                    <ThemeToggle />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred theme or let the system decide based on your device settings
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}