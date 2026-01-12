import { UserLoginForm } from "@/components/user-login-form"
import { isAuth } from "@/lib/actions/isAuth.action"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const isAuthed = await isAuth()

  if (isAuthed) {
    redirect('/dashboard')
  }
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <UserLoginForm />
      </div>
    </div>
  )
}
