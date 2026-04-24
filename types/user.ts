export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  favourites: string[]
  createdAt: string
  updatedAt?: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  createdAt?: string
}

export interface PublicUser {
  id: string
  name: string
  email: string
  createdAt: string
}
