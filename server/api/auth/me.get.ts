import { requireAuth } from '~/server/utils/auth'
import { getStorage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const authUser = await requireAuth(event)
  const { users } = getStorage()
  const user = users.get(authUser.id)

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    favourites: user.favourites,
    createdAt: user.createdAt,
  }
})
