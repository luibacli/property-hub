import { randomUUID } from 'node:crypto'
import { CreateListingSchema } from '~/server/utils/validators'
import { requireAuth } from '~/server/utils/auth'
import { getStorage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  const parsed = CreateListingSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      message: 'Validation failed',
      data: parsed.error.flatten().fieldErrors,
    })
  }

  const { listings } = getStorage()
  const now = new Date().toISOString()
  const id = randomUUID()

  const listing = {
    ...parsed.data,
    id,
    status: 'active' as const,
    userRef: user.id,
    createdAt: now,
    updatedAt: now,
  }

  listings.set(id, listing)
  setResponseStatus(event, 201)
  return listing
})
