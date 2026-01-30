import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import { getUserStats } from '@/app/actions/profile'
import { AccessibilityForm } from '@/features/profile/components/accessibility-form'
import { ProfileStats } from '@/features/profile/components/profile-stats'
import { db } from '@/database'
import { users } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { MobileHeader } from '@/shared/components/MobileHeader'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { LogoutButton } from '@/features/profile/components/logout-button'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/registrar-anonimo')
  }

  // Fetch full user data to get accessibility info
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  // Fetch stats separately (could be combined but keeping concerns separate)
  const stats = await getUserStats()

  if (!user) {
    // Should handle this better, but for now redirect
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <DesktopHeader />
      <MobileHeader
        title="Meu Perfil"
        isAuthenticated={true}
        userName={user.name || undefined}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 hidden lg:block">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-500 mt-1">
            Olá,{' '}
            <span className="font-semibold text-gray-800">{user.name}</span>!
            Gerencie suas informações e acompanhe suas atividades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Stats */}
          <div className="md:col-span-1 space-y-6">
            <ProfileStats manifestationsCount={stats.manifestationsCount} />

            {/* Can add more stats here later */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Detalhes da Conta
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500 block">Email</span>
                  <span className="text-gray-800 font-medium truncate block">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:hidden">
              <LogoutButton />
            </div>
          </div>

          {/* Right Column: Settings */}
          <div className="md:col-span-2 space-y-6">
            <AccessibilityForm
              initialAccessibilityInfo={user.accessibility_info}
            />

            <div className="hidden md:block">
              <LogoutButton />
            </div>

            {/* Placeholder for other settings */}
          </div>
        </div>
      </main>

      <MobileBottomNav activeTab="profile" isAuthenticated={true} />
    </div>
  )
}
