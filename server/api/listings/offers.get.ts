import { getStorage } from '~/server/utils/storage'

export default defineEventHandler(() => {
  const { listings } = getStorage()

  const offers = [...listings.values()]
    .filter((p) => p.status === 'active' && p.offer && p.discountedPrice)
    .sort((a, b) => {
      // Sort by biggest savings first
      const savingA = a.regularPrice - (a.discountedPrice ?? a.regularPrice)
      const savingB = b.regularPrice - (b.discountedPrice ?? b.regularPrice)
      return savingB - savingA
    })

  return offers
})
