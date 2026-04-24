import { requireAuth } from '~/server/utils/auth'
import { getStorage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing listing ID' })

  const { listings } = getStorage()
  const listing = listings.get(id)

  if (!listing) throw createError({ statusCode: 404, message: 'Listing not found' })
  if (listing.userRef !== user.id) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  // Soft delete — preserve data, just mark inactive
  listings.set(id, { ...listing, status: 'inactive', updatedAt: new Date().toISOString() })
  setResponseStatus(event, 204)
  return null
})
