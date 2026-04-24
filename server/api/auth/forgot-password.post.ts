import { z } from 'zod'
import { getStorage } from '~/server/utils/storage'

const Schema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = Schema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'A valid email address is required' })
  }

  const { users } = getStorage()
  const user = [...users.values()].find(u => u.email === parsed.data.email)

  // Always return 200 to prevent email enumeration
  if (!user) {
    return { ok: true, message: 'If that email is registered you will receive a reset link.' }
  }

  // In production: generate a signed token, store it in resetTokens Map, send email
  // For this demo the endpoint confirms the email exists and returns success
  console.log(`[Password Reset] Reset requested for ${user.email}`)

  return { ok: true, message: 'If that email is registered you will receive a reset link.' }
})
