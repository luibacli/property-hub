import { getStorage } from '~/server/utils/storage'

export default defineEventHandler(() => {
  const { listings } = getStorage()

  // Featured = active listings sorted by price descending, top 6
  const featured = [...listings.values()]
    .filter((p) => p.status === 'active')
    .sort((a, b) => b.regularPrice - a.regularPrice)
    .slice(0, 6)

  return featured
})
