import { requireAuth } from '~/server/utils/auth'
import { getStorage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing listing ID' })

  const { users, listings } = getStorage()

  if (!listings.has(id)) throw createError({ statusCode: 404, message: 'Listing not found' })

  const userData = users.get(user.id)
  if (!userData) throw createError({ statusCode: 404, message: 'User not found' })

  const isFav = userData.favourites.includes(id)
  userData.favourites = isFav
    ? userData.favourites.filter((f) => f !== id)
    : [...userData.favourites, id]

  users.set(user.id, userData)
  return { favourited: !isFav, favourites: userData.favourites }
})
