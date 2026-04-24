import { z } from 'zod'
import { getStorage } from '~/server/utils/storage'

const ContactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  message: z.string().min(10).max(2000),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing listing ID' })

  const { listings } = getStorage()
  const listing = listings.get(id)
  if (!listing) throw createError({ statusCode: 404, message: 'Listing not found' })

  const body = await readBody(event)
  const parsed = ContactSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      message: 'Validation failed',
      data: parsed.error.flatten().fieldErrors,
    })
  }

  // In production: send email to listing.userRef's email address
  // For demo: just return success
  console.log(`[Contact] "${parsed.data.name}" enquired about listing "${listing.title}"`)

  return { ok: true, message: 'Your enquiry has been sent to the property owner.' }
})
