import type { H3Event } from 'h3'

export function defineApiHandler<T>(handler: (event: H3Event) => T | Promise<T>) {
  return defineEventHandler(async (event) => {
    try {
      return await handler(event)
    }
    catch (error) {
      if (isError(error)) throw error
      console.error('[api] unexpected error:', describeError(error))
      throw apiError(500, 'internal', 'внутренняя ошибка сервера')
    }
  })
}
