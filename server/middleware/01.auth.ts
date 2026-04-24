import type { AuthUser } from '~/types/user'
import { getTokenFromEvent, verifyToken } from '~/server/utils/auth'

// Attaches the authenticated user to event.context on every request.
// Route handlers call requireAuth(event) to assert the user is present.
declare module 'h3' {
  interface H3EventContext {
    user?: AuthUser
  }
}

export default defineEventHandler(async (event) => {
  const token = getTokenFromEvent(event)
  if (token) {
    const user = await verifyToken(token)
    if (user) event.context.user = user
  }
})
