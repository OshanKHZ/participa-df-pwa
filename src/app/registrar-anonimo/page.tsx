import { AnonymousRegisterForm } from '@/components/auth/anonymous-register-form'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function AnonymousRegisterPage() {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          {/* Logo or specialized header could go here */}
        </div>
        <AnonymousRegisterForm />
      </div>
    </div>
  )
}
