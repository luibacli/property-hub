export type PropertyType = 'rent' | 'sale'
export type PropertyStatus = 'active' | 'inactive'

export interface Property {
  id: string
  title: string
  type: PropertyType
  status: PropertyStatus
  description: string
  bedrooms: number
  bathrooms: number
  parking: boolean
  furnished: boolean
  amenities: string[]
  address: string
  city: string
  state: string
  lat: number
  lng: number
  regularPrice: number
  discountedPrice?: number
  offer: boolean
  images: string[]
  userRef: string
  createdAt: string
  updatedAt: string
}

export interface CreatePropertyInput {
  title: string
  type: PropertyType
  description: string
  bedrooms: number
  bathrooms: number
  parking: boolean
  furnished: boolean
  amenities: string[]
  address: string
  city: string
  state: string
  lat: number
  lng: number
  regularPrice: number
  discountedPrice?: number
  offer: boolean
  images: string[]
}

export interface PropertyFilters {
  type?: PropertyType
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  furnished?: boolean
  parking?: boolean
  offer?: boolean
  city?: string
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedProperties {
  items: Property[]
  total: number
  page: number
  limit: number
  totalPages: number
}
