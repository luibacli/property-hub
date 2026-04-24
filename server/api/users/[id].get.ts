import { getStorage } from '~/server/utils/storage'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing user ID' })

  const { users } = getStorage()
  const user = users.get(id)
  if (!user) throw createError({ statusCode: 404, message: 'User not found' })

  // Return only public fields
  return { id: user.id, name: user.name, createdAt: user.createdAt }
})
