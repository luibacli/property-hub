import { UpdateListingSchema } from '~/server/utils/validators'
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

  const body = await readBody(event)
  const parsed = UpdateListingSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      message: 'Validation failed',
      data: parsed.error.flatten().fieldErrors,
    })
  }

  const updated = { ...listing, ...parsed.data, updatedAt: new Date().toISOString() }
  listings.set(id, updated)
  return updated
})
