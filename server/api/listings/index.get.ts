import type { PropertyFilters, PaginatedProperties } from '~/types/property'
import { getStorage } from '~/server/utils/storage'

export default defineEventHandler((event): PaginatedProperties => {
  const query = getQuery(event)
  const { listings } = getStorage()

  const filters: PropertyFilters = {
    type: query['type'] as PropertyFilters['type'],
    minPrice: query['minPrice'] ? Number(query['minPrice']) : undefined,
    maxPrice: query['maxPrice'] ? Number(query['maxPrice']) : undefined,
    bedrooms: query['bedrooms'] ? Number(query['bedrooms']) : undefined,
    furnished: query['furnished'] === 'true' ? true : query['furnished'] === 'false' ? false : undefined,
    parking: query['parking'] === 'true' ? true : query['parking'] === 'false' ? false : undefined,
    offer: query['offer'] === 'true' ? true : undefined,
    city: query['city'] as string | undefined,
    search: query['search'] as string | undefined,
    page: query['page'] ? Number(query['page']) : 1,
    limit: query['limit'] ? Math.min(Number(query['limit']), 50) : 12,
  }

  let items = [...listings.values()].filter((p) => p.status === 'active')

  if (filters.type) {
    items = items.filter((p) => p.type === filters.type)
  }
  if (filters.offer) {
    items = items.filter((p) => p.offer === true)
  }
  if (filters.city) {
    const city = filters.city.toLowerCase()
    items = items.filter((p) => p.city.toLowerCase().includes(city))
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }
  if (filters.bedrooms !== undefined) {
    items = items.filter((p) => p.bedrooms >= filters.bedrooms!)
  }
  if (filters.furnished !== undefined) {
    items = items.filter((p) => p.furnished === filters.furnished)
  }
  if (filters.parking !== undefined) {
    items = items.filter((p) => p.parking === filters.parking)
  }
  if (filters.minPrice !== undefined) {
    items = items.filter((p) => {
      const price = p.offer && p.discountedPrice ? p.discountedPrice : p.regularPrice
      return price >= filters.minPrice!
    })
  }
  if (filters.maxPrice !== undefined) {
    items = items.filter((p) => {
      const price = p.offer && p.discountedPrice ? p.discountedPrice : p.regularPrice
      return price <= filters.maxPrice!
    })
  }

  const sort = (query['sort'] as string) ?? 'newest'
  if (sort === 'price_asc') {
    items.sort((a, b) => {
      const pa = a.offer && a.discountedPrice ? a.discountedPrice : a.regularPrice
      const pb = b.offer && b.discountedPrice ? b.discountedPrice : b.regularPrice
      return pa - pb
    })
  } else if (sort === 'price_desc') {
    items.sort((a, b) => {
      const pa = a.offer && a.discountedPrice ? a.discountedPrice : a.regularPrice
      const pb = b.offer && b.discountedPrice ? b.discountedPrice : b.regularPrice
      return pb - pa
    })
  } else {
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const page = filters.page ?? 1
  const limit = filters.limit ?? 12
  const total = items.length
  const totalPages = Math.ceil(total / limit)
  const paginated = items.slice((page - 1) * limit, page * limit)

  return { items: paginated, total, page, limit, totalPages }
})
