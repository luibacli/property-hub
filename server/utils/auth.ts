import { SignJWT, jwtVerify } from 'jose'
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import type { AuthUser } from '~/types/user'

// ─── Password hashing (scrypt — stronger than bcrypt, no native deps) ────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const hashBuffer = Buffer.from(hash, 'hex')
  const derived = scryptSync(password, salt, 64)
  return timingSafeEqual(hashBuffer, derived)
}

// ─── JWT ──────────────────────────────────────────────────────────────────────

function getSecret(): Uint8Array {
  const { jwtSecret } = useRuntimeConfig()
  return new TextEncoder().encode(jwtSecret as string)
}

export async function signToken(user: AuthUser): Promise<string> {
  return new SignJWT({ id: user.id, email: user.email, name: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return {
      id: payload['id'] as string,
      email: payload['email'] as string,
      name: payload['name'] as string,
    }
  } catch {
    return null
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTokenFromEvent(event: H3Event): string | null {
  const header = getHeader(event, 'authorization')
  if (header?.startsWith('Bearer ')) return header.slice(7)
  return getCookie(event, 'ph_token') ?? null
}

export async function requireAuth(event: H3Event): Promise<AuthUser> {
  const token = getTokenFromEvent(event)
  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentication required' })
  }
  const user = await verifyToken(token)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid or expired token' })
  }
  return user
}

export function setAuthCookie(event: H3Event, token: string): void {
  setCookie(event, 'ph_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export function clearAuthCookie(event: H3Event): void {
  deleteCookie(event, 'ph_token', { path: '/' })
}
