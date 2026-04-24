import { randomUUID } from 'node:crypto'
import { RegisterSchema } from '~/server/utils/validators'
import { hashPassword, signToken, setAuthCookie } from '~/server/utils/auth'
import { getStorage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = RegisterSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      message: 'Validation failed',
      data: parsed.error.flatten().fieldErrors,
    })
  }

  const { name, email, password } = parsed.data
  const { users } = getStorage()

  // Check duplicate email
  const existing = [...users.values()].find((u) => u.email === email)
  if (existing) {
    throw createError({ statusCode: 409, message: 'Email already in use' })
  }

  const user = {
    id: randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
    favourites: [] as string[],
    createdAt: new Date().toISOString(),
  }

  users.set(user.id, user)

  const token = await signToken({ id: user.id, name: user.name, email: user.email })
  setAuthCookie(event, token)

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  }
})
