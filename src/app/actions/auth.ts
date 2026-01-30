'use server'

import { db } from '@/database'
import { otpCodes, users } from '@/database/schema'
import { Resend } from 'resend'
import { eq, and, gt } from 'drizzle-orm'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { EmailTemplate } from '@/shared/components/EmailTemplate'

// Generate 6 digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendOtp(email: string) {
  if (!email) {
    return { success: false, error: 'Email é obrigatório.' }
  }

  const code = generateCode()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 mins

  try {
    // Delete previous codes for this email to ensure clean slate
    await db.delete(otpCodes).where(eq(otpCodes.email, email))

    await db.insert(otpCodes).values({
      email,
      code,
      expiresAt,
    })

    // Send Email
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: `Seu código de acesso: ${code}`,
      react: EmailTemplate({ code }),
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send OTP:', error)
    return {
      success: false,
      error: 'Falha ao enviar o código. Tente novamente.',
    }
  }
}

export async function verifyOtp(email: string, code: string) {
  if (!email || !code) {
    return { success: false, error: 'Email e código são obrigatórios.' }
  }

  try {
    // Find valid OTP
    const validOtp = await db.query.otpCodes.findFirst({
      where: and(
        eq(otpCodes.email, email),
        eq(otpCodes.code, code),
        gt(otpCodes.expiresAt, new Date())
      ),
    })

    if (!validOtp) {
      return { success: false, error: 'Código inválido ou expirado.' }
    }

    // Consume OTP
    await db.delete(otpCodes).where(eq(otpCodes.id, validOtp.id))

    // Find or Create User
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          name: email.split('@')[0],
          emailVerified: new Date(),
        })
        .returning()
      user = newUser
    } else {
      // Ensure verified
      if (!user.emailVerified) {
        await db
          .update(users)
          .set({ emailVerified: new Date() })
          .where(eq(users.id, user.id))
      }
    }

    if (!user) {
      return { success: false, error: 'Erro ao criar ou encontrar usuário.' }
    }

    // Create Session
    await createSession({
      userId: user.id,
      name: user.name,
      email: user.email,
    })

    return { success: true, user: { name: user.name } }
  } catch (error) {
    console.error('Failed to verify OTP:', error)
    return { success: false, error: 'Erro ao verificar código.' }
  }
}

export async function registerAnonymousUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const needsAccessibility = formData.get('needsAccessibility') === 'on'
  const accessibilityInfo = formData.get('accessibilityInfo') as string

  if (!email || !name) {
    // Should handle error better in a real app
    return
  }

  try {
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          name,
          accessibility_info: needsAccessibility ? accessibilityInfo : null,
          emailVerified: new Date(), // Implicitly verify for anon?
        })
        .returning()
      user = newUser
    } else {
      // Update info if needed
      await db
        .update(users)
        .set({
          name,
          accessibility_info: needsAccessibility ? accessibilityInfo : null,
        })
        .where(eq(users.id, user.id))
    }

    if (!user) {
      // Should handle error better
      console.error('Failed to create user during anonymous reg')
      return
    }

    await createSession({
      userId: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error('Failed to register anonymous user:', error)
    // Handle error
  }

  redirect('/manifestacao/criar')
}

export async function logout() {
  await deleteSession()
}

export async function getSessionData() {
  const { auth } = await import('@/server/auth')
  const session = await auth()
  return session?.user || null
}