import { z } from 'zod'
import { requireAuth, hashPassword, verifyPassword } from '~/server/utils/auth'
import { getStorage } from '~/server/utils/storage'

const Schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

export default defineEventHandler(async (event) => {
  const authUser = await requireAuth(event)
  const body = await readBody(event)
  const parsed = Schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      message: 'Validation failed',
      data: parsed.error.flatten().fieldErrors,
    })
  }

  const { users } = getStorage()
  const user = users.get(authUser.id)
  if (!user) throw createError({ statusCode: 404, message: 'User not found' })

  const valid = verifyPassword(parsed.data.currentPassword, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 422, message: 'Current password is incorrect' })
  }

  user.passwordHash = hashPassword(parsed.data.newPassword)
  user.updatedAt = new Date().toISOString()
  users.set(user.id, user)

  return { ok: true }
})
