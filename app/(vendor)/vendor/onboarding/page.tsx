'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2, Building2, FileText, Receipt, CheckCircle2 } from "lucide-react"

interface VendorOnboardingFormData {
    businessName: string
    businessLicenseNumber: string
    taxId: string
}

export default function VendorOnboarding() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<VendorOnboardingFormData>({
        businessName: "",
        businessLicenseNumber: "",
        taxId: "",
    })

    const handleInputChange = (field: keyof VendorOnboardingFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const validateForm = (): boolean => {
        if (!formData.businessName.trim()) {
            toast.error("Business name is required")
            return false
        }

        if (formData.businessName.trim().length < 2) {
            toast.error("Business name must be at least 2 characters")
            return false
        }

        if (!formData.businessLicenseNumber.trim()) {
            toast.error("Business license number is required")
            return false
        }

        if (formData.businessLicenseNumber.trim().length < 5) {
            toast.error("Business license number must be at least 5 characters")
            return false
        }

        if (!formData.taxId.trim()) {
            toast.error("Tax ID is required")
            return false
        }

        if (formData.taxId.trim().length < 5) {
            toast.error("Tax ID must be at least 5 characters")
            return false
        }

        return true
    }

    const handleSubmit = async () => {
        if (loading) return

        if (!validateForm()) return

        setLoading(true)

        try {
            // Get userId from localStorage
            const userId = localStorage.getItem("user_id")

            if (!userId) {
                toast.error("User session not found. Please log in again.")
                router.push("/vendor/login")
                return
            }

            const response = await fetch("/api/vendor/create-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    businessName: formData.businessName.trim(),
                    businessLicenseNumber: formData.businessLicenseNumber.trim(),
                    taxId: formData.taxId.trim(),
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.message || "Failed to create vendor profile")
                return
            }

            toast.success("Vendor profile created successfully! Awaiting admin approval.")

            // Clear form
            setFormData({
                businessName: "",
                businessLicenseNumber: "",
                taxId: "",
            })

            // Redirect to dashboard or pending approval page
            setTimeout(() => {
                router.push("/vendor/dashboard")
            }, 1500)

        } catch (error) {
            console.error("Error creating vendor profile:", error)
            toast.error("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-2xl space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Become a Vendor</h1>
                    <p className="text-muted-foreground text-base">
                        Complete your business profile to start listing your vehicles
                    </p>
                </div>

                {/* Main Form Card */}
                <Card className="border-border shadow-lg">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl">Business Information</CardTitle>
                        <CardDescription>
                            Provide your business details for verification. This information will be reviewed by our admin team.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Business Name */}
                            <div className="space-y-2">
                                <Label htmlFor="businessName" className="text-sm font-medium flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                    Business Name
                                </Label>
                                <Input
                                    id="businessName"
                                    type="text"
                                    placeholder="Enter your business name"
                                    value={formData.businessName}
                                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                                    disabled={loading}
                                    className="h-11"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Your registered business or company name
                                </p>
                            </div>

                            {/* Business License Number */}
                            <div className="space-y-2">
                                <Label htmlFor="businessLicenseNumber" className="text-sm font-medium flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    Business License Number
                                </Label>
                                <Input
                                    id="businessLicenseNumber"
                                    type="text"
                                    placeholder="Enter your business license number"
                                    value={formData.businessLicenseNumber}
                                    onChange={(e) => handleInputChange("businessLicenseNumber", e.target.value)}
                                    disabled={loading}
                                    className="h-11"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Your official business license or registration number
                                </p>
                            </div>

                            {/* Tax ID */}
                            <div className="space-y-2">
                                <Label htmlFor="taxId" className="text-sm font-medium flex items-center gap-2">
                                    <Receipt className="w-4 h-4 text-muted-foreground" />
                                    Tax ID / EIN
                                </Label>
                                <Input
                                    id="taxId"
                                    type="text"
                                    placeholder="Enter your tax identification number"
                                    value={formData.taxId}
                                    onChange={(e) => handleInputChange("taxId", e.target.value)}
                                    disabled={loading}
                                    className="h-11"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Your tax identification number or EIN
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-2">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-foreground">What happens next?</p>
                                        <p className="text-xs text-muted-foreground">
                                            Your application will be reviewed by our admin team within 24-48 hours.
                                            You'll receive an email notification once your account is approved.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full h-11 text-base font-medium"
                                size="lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Submitting Application...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Submit for Approval</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Note */}
                <p className="text-center text-xs text-muted-foreground">
                    By submitting this form, you agree to our vendor terms and conditions.
                    All information provided will be kept confidential and used only for verification purposes.
                </p>
            </div>
        </div>
    )
}