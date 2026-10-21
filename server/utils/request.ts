import type { H3Event } from 'h3'
import { isValidPostId, REQUEST_BODY_MAX_BYTES } from '#shared/constants'
import type { ValidationResult } from '../lib/validation/posts'

function payloadTooLarge() {
  return apiError(413, 'payload_too_large', 'публикация слишком большая')
}

export async function readJsonBody(event: H3Event): Promise<unknown> {
  const declaredLength = Number(getRequestHeader(event, 'content-length') ?? 0)
  if (declaredLength > REQUEST_BODY_MAX_BYTES) throw payloadTooLarge()

  const raw = await readRawBody(event, false)
  if (!raw || raw.length === 0) throw apiError(400, 'invalid_body', 'пустое тело запроса')
  if (raw.length > REQUEST_BODY_MAX_BYTES) throw payloadTooLarge()

  try {
    return JSON.parse(raw.toString('utf8'))
  }
  catch {
    throw apiError(400, 'invalid_json', 'некорректный JSON')
  }
}

export function validated<T>(result: ValidationResult<T>): T {
  if (!result.ok) throw apiError(400, result.error.code, result.error.message)
  return result.value
}

export function requirePostId(event: H3Event): string {
  const id = getRouterParam(event, 'id')
  if (!isValidPostId(id)) throw apiError(404, 'not_found', 'публикация не найдена')
  return id
}

export function getClientAddress(event: H3Event): string {
  if (useRuntimeConfig(event).trustProxy) {
    const forwarded = getRequestHeader(event, 'x-forwarded-for')?.split(',').at(-1)?.trim()
    if (forwarded) return forwarded
  }
  return event.node.req.socket?.remoteAddress ?? 'unknown'
}
