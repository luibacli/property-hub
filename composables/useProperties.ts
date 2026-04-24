import type { Property, PropertyFilters, PaginatedProperties } from '~/types/property'

export function useProperties() {
  async function fetchListings(filters: PropertyFilters = {}) {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
    )
    return $fetch<PaginatedProperties>('/api/listings', { params })
  }

  async function fetchListing(id: string) {
    return $fetch<Property>(`/api/listings/${id}`)
  }

  async function fetchFeatured() {
    return $fetch<Property[]>('/api/listings/featured')
  }

  async function fetchOffers() {
    return $fetch<Property[]>('/api/listings/offers')
  }

  async function createListing(data: Omit<Property, 'id' | 'userRef' | 'createdAt' | 'updatedAt' | 'status'>) {
    return $fetch<Property>('/api/listings', { method: 'POST', body: data })
  }

  async function updateListing(id: string, data: Partial<Property>) {
    return $fetch<Property>(`/api/listings/${id}`, { method: 'PUT', body: data })
  }

  async function deleteListing(id: string) {
    return $fetch(`/api/listings/${id}`, { method: 'DELETE' })
  }

  function formatPrice(property: Property): string {
    const price =
      property.offer && property.discountedPrice
        ? property.discountedPrice
        : property.regularPrice
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  function formatPriceLabel(property: Property): string {
    return property.type === 'rent'
      ? `${formatPrice(property)}/mo`
      : formatPrice(property)
  }

  function savingsAmount(property: Property): number | null {
    if (!property.offer || !property.discountedPrice) return null
    return property.regularPrice - property.discountedPrice
  }

  return {
    fetchListings,
    fetchListing,
    fetchFeatured,
    fetchOffers,
    createListing,
    updateListing,
    deleteListing,
    formatPrice,
    formatPriceLabel,
    savingsAmount,
  }
}
