import { requireAuth } from '~/server/utils/auth'
import { getStorage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { users, listings } = getStorage()

  const userData = users.get(user.id)
  if (!userData) throw createError({ statusCode: 404, message: 'User not found' })

  const favourites = userData.favourites
    .map((id) => listings.get(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined && p.status === 'active')

  return favourites
})
