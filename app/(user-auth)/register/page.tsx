import { UserSignupForm } from "@/components/user-signup-form"
import { isAuth } from "@/lib/actions/isAuth.action"
import { redirect } from "next/navigation"

export default async function SignupPage() {
  const isAuthed = await isAuth()

  if (isAuthed) {
    redirect('/')
  }
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <UserSignupForm />
      </div>
    </div>
  )
}
