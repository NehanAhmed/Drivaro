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
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { isAuth } from "@/lib/actions/isAuth.action"
import { useRouter } from "next/navigation"

export function UserSignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    const router = useRouter();

    const validateForm = () => {
        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            toast.error("Please fill in all fields")
            return false
        }

        if (name.trim().length < 2) {
            toast.error("Please enter a valid name (at least 2 characters)")
            return false
        }

        if (!email.includes("@") || !email.includes(".")) {
            toast.error("Please enter a valid email address")
            return false
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long")
            return false
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return false
        }

        return true
    }

    

    const handleEmailPasswordAuth = async (event: React.FormEvent) => {
        event.preventDefault()

        if (loading) return // Prevent double submission

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const response = await authClient.signUp.email({
                email: email.trim(),
                password: password,
                name: name.trim(),
                callbackURL: `${window.location.origin}/dashboard`,
            })

            if (response.error) {
                toast.error(response.error.message || "Failed to create account")
                return
            }

            // Check if user ID exists
            const userId = response.data?.user?.id
            if (!userId) {
                toast.error("Account created but user ID not found. Please try logging in.")
                return
            }


            toast.success("Account created successfully!")
            setTimeout(() => {
                router.push("/login");
            }, 3000);
            // Clear form on success
            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")

        } catch (error) {
            console.error("Signup error:", error)
            toast.error("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleAuth = async () => {
        if (googleLoading) return // Prevent double clicks

        setGoogleLoading(true)

        try {
            const response = await authClient.signIn.social({
                provider: "google",
                callbackURL: `${window.location.origin}/dashboard`,
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
                                <h1 className="text-2xl font-bold">Create your account</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Enter your email below to create your account
                                </p>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading || googleLoading}
                                    required
                                />
                            </Field>

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
                                <FieldDescription>
                                    We&apos;ll use this to contact you. We will not share your
                                    email with anyone else.
                                </FieldDescription>
                            </Field>

                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
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
                                        <FieldLabel htmlFor="confirm-password">
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={loading || googleLoading}
                                            required
                                        />
                                    </Field>
                                </Field>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>

                            <Field>
                                <Button
                                    type="button"
                                    onClick={handleEmailPasswordAuth}
                                    disabled={loading || googleLoading}
                                    className="w-full"
                                >
                                    {loading ? "Creating Account..." : "Create Account"}
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
                                        {googleLoading ? "Connecting..." : "Continue With Google"}
                                    </span>
                                </Button>
                            </Field>

                            <FieldDescription className="text-center">
                                Already have an account?{" "}
                                <Link
                                    href="/vendor/login"
                                    className="text-primary hover:underline"
                                >
                                    Sign in
                                </Link>
                            </FieldDescription>
                        </FieldGroup>
                    </div>

                    <div className="bg-muted relative hidden md:block">
                        <Image
                            width={1000}
                            height={1000}
                            src="/placeholder.svg"
                            alt="Signup illustration"
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