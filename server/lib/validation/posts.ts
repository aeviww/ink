import {
  CONTENT_MAX_LENGTH,
  PROOF_NONCE_PATTERN,
  TITLE_MAX_LENGTH,
} from '#shared/constants'
import type { CreatePostRequest } from '#shared/types/api'
import { normalizeContent, normalizeTitle } from './text'

export interface ValidationError {
  code: string
  message: string
}

export type ValidationResult<T> =
  | { ok: true, value: T }
  | { ok: false, error: ValidationError }

function fail(code: string, message: string): { ok: false, error: ValidationError } {
  return { ok: false, error: { code, message } }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseCreatePostInput(body: unknown): ValidationResult<CreatePostRequest> {
  if (!isRecord(body)) return fail('invalid_body', 'некорректное тело запроса')

  const { title, content, challenge, nonce } = body
  if (typeof title !== 'string' || typeof content !== 'string') {
    return fail('invalid_body', 'заголовок и текст должны быть строками')
  }
  if (typeof challenge !== 'string' || challenge.length > 256 || typeof nonce !== 'string' || !PROOF_NONCE_PATTERN.test(nonce)) {
    return fail('invalid_proof', 'отсутствует или повреждено подтверждение публикации')
  }

  const normalizedTitle = normalizeTitle(title)
  const normalizedContent = normalizeContent(content)

  if (!normalizedTitle) return fail('title_required', 'добавьте заголовок')
  if (normalizedTitle.length > TITLE_MAX_LENGTH) {
    return fail('title_too_long', `заголовок длиннее ${TITLE_MAX_LENGTH} символов`)
  }
  if (!normalizedContent) return fail('content_required', 'текст публикации пуст')
  if (normalizedContent.length > CONTENT_MAX_LENGTH) {
    return fail('content_too_long', `текст длиннее ${CONTENT_MAX_LENGTH.toLocaleString('ru-RU')} символов`)
  }

  return { ok: true, value: { title: normalizedTitle, content: normalizedContent, challenge, nonce } }
}
