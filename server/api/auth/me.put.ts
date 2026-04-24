import { z } from 'zod'
import { requireAuth } from '~/server/utils/auth'
import { getStorage } from '~/server/utils/storage'

const Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60).optional(),
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

  if (parsed.data.name) user.name = parsed.data.name
  user.updatedAt = new Date().toISOString()
  users.set(user.id, user)

  return { id: user.id, name: user.name, email: user.email, favourites: user.favourites, createdAt: user.createdAt }
})
