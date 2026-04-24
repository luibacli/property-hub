import type { Property } from '~/types/property'
import type { User } from '~/types/user'

// In-memory store — intentionally isolated per-instance for portfolio demos.
// Swap this file's Map for an Upstash Redis / Neon Postgres client and nothing
// else in the codebase changes.

const listings = new Map<string, Property>()
const users = new Map<string, User>()
const resetTokens = new Map<string, { email: string; expires: number }>()

export function getStorage() {
  return { listings, users, resetTokens }
}
