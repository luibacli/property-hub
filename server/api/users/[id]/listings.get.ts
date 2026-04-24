import { requireAuth } from '~/server/utils/auth'
import { getStorage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing user ID' })

  // Users can only fetch their own listings
  if (id !== user.id) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const { listings } = getStorage()
  const userListings = [...listings.values()]
    .filter((p) => p.userRef === id && p.status === 'active')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return userListings
})
