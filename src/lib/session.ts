import 'server-only'
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const key = new TextEncoder().encode(process.env.SESSION_SECRET)

const cookie = {
  name: 'session',
  options: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
  },
  duration: 24 * 60 * 60 * 1000,
}

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1day')
    .sign(key)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch {
    return null
  }
}

export async function createSession(user: {
  userId: string
  name?: string | null
  email?: string | null
}) {
  const expires = new Date(Date.now() + cookie.duration)
  const session = await encrypt({ ...user, expires })

  const cookieStore = await cookies()
  cookieStore.set(cookie.name, session, { ...cookie.options, expires })

  // Note: We don't redirect here, we leave that to the action/component
}

export async function verifySession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(cookie.name)?.value
  const payload = await decrypt(session)

  if (!payload?.userId) {
    redirect('/entrar')
  }

  return {
    isAuth: true,
    userId: payload.userId as string,
    user: {
      name: payload.name as string | undefined,
      email: payload.email as string | undefined,
    },
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(cookie.name)?.value
  const payload = await decrypt(session)

  if (!payload?.userId) {
    return null
  }

  return {
    userId: payload.userId as string,
    user: {
      name: payload.name as string | undefined,
      email: payload.email as string | undefined,
    },
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(cookie.name)
}
