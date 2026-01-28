'use server'

import { db } from '@/server/db'
import { otpCodes } from '@/server/db/schema'
import { Resend } from 'resend'
import { eq } from 'drizzle-orm'

// Generate 6 digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendOtp(email: string) {
  if (!email) {
    throw new Error('Email é obrigatório.')
  }

  const code = generateCode()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 mins

  // Delete previous codes for this email to ensure clean slate
  await db.delete(otpCodes).where(eq(otpCodes.email, email))

  await db.insert(otpCodes).values({
    email,
    code,
    expiresAt,
  })

  // Send Email
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Basic HTML template for the OTP
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Código de Acesso</h2>
      <p>Seu código de verificação para o Participa DF é:</p>
      <div style="background: #f4f4f5; padding: 20px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
        ${code}
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">Este código expira em 15 minutos.</p>
    </div>
  `

  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to: email,
    subject: `Seu código de acesso: ${code}`,
    html,
  })

  return { success: true }
}
