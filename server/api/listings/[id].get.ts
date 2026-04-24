import { getStorage } from '~/server/utils/storage'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing listing ID' })

  const { listings } = getStorage()
  const listing = listings.get(id)

  if (!listing || listing.status === 'inactive') {
    throw createError({ statusCode: 404, message: 'Listing not found' })
  }

  return listing
})
