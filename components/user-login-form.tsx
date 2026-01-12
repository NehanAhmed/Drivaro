'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconBrandGoogleFilled } from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserLoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [showVerificationAlert, setShowVerificationAlert] = useState(false)
    const router = useRouter()
    const validateForm = () => {
        if (!email.trim() || !password) {
            toast.error("Please fill in all fields")
            return false
        }

        if (!email.includes("@") || !email.includes(".")) {
            toast.error("Please enter a valid email address")
            return false
        }

        return true
    }


    const handleEmailPasswordAuth = async (event: React.FormEvent) => {
        event.preventDefault()

        if (loading) return

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const response = await authClient.signIn.email(
                {
                    email: email.trim(),
                    password: password,
                    callbackURL: `${window.location.origin}/dashboard`,
                },
                {
                    onError: (ctx) => {
                        // Handle email verification error
                        if (ctx.error.status === 403) {
                            toast.error("Please verify your email address to login")
                            return
                        }

                        // Handle other errors
                        toast.error(ctx.error.message || "Failed to sign in")
                    },
                }
            )

            if (response.error) {
                // Error already handled in onError callback
                return
            }

            toast.success("Signed in successfully!")
            router.push("/dashboard")
            setEmail("")
            setPassword("")
        } catch (error) {
            console.error("Login error:", error)
            toast.error("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleAuth = async () => {
        if (googleLoading) return

        setGoogleLoading(true)

        try {
            const response = await authClient.signIn.social({
                provider: "google",
                callbackURL: `${window.location.origin}/vendor/dashboard`,
            })

            if (response.error) {
                toast.error(response.error.message || "Failed to sign in with Google")
            }
        } catch (error) {
            console.error("Google auth error:", error)
            toast.error("Failed to sign in with Google. Please try again.")
        } finally {
            setGoogleLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to your account
                                </p>
                            </div>

                            {showVerificationAlert && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="space-y-2">
                                            <p className="font-medium">Email not verified</p>
                                            <p className="text-sm">
                                                Please verify your email address before logging in.
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-2 w-full"
                                            >
                                                Resend Verification Email
                                            </Button>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading || googleLoading}
                                    required
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Link
                                        href="/vendor/forgot-password"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading || googleLoading}
                                    required
                                />
                            </Field>

                            <Field>
                                <Button
                                    type="button"
                                    onClick={handleEmailPasswordAuth}
                                    disabled={loading || googleLoading}
                                    className="w-full"
                                >
                                    {loading ? "Signing in..." : "Login"}
                                </Button>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>

                            <Field className="grid grid-cols-1 gap-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={handleGoogleAuth}
                                    disabled={loading || googleLoading}
                                    className="w-full"
                                >
                                    <IconBrandGoogleFilled />
                                    <span>
                                        {googleLoading ? "Connecting..." : "Continue with Google"}
                                    </span>
                                </Button>
                            </Field>

                            <FieldDescription className="text-center">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/vendor/register"
                                    className="text-primary hover:underline"
                                >
                                    Sign up
                                </Link>
                            </FieldDescription>
                        </FieldGroup>
                    </div>

                    <div className="bg-muted relative hidden md:block">
                        <Image
                            width={1000}
                            height={1000}
                            src="/placeholder.svg"
                            alt="Login illustration"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                            priority
                        />
                    </div>
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center text-xs">
                By clicking continue, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                </Link>
                .
            </FieldDescription>
        </div>
    )
}