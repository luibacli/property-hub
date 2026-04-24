import { LoginSchema } from '~/server/utils/validators'
import { verifyPassword, signToken, setAuthCookie } from '~/server/utils/auth'
import { getStorage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = LoginSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      message: 'Validation failed',
      data: parsed.error.flatten().fieldErrors,
    })
  }

  const { email, password } = parsed.data
  const { users } = getStorage()

  const user = [...users.values()].find((u) => u.email === email)
  if (!user || !verifyPassword(password, user.passwordHash)) {
    // Intentionally vague — don't leak whether email exists
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  const token = await signToken({ id: user.id, name: user.name, email: user.email })
  setAuthCookie(event, token)

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  }
})
