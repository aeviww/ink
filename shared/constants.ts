export const POST_ID_LENGTH = 12
export const POST_ID_PATTERN = /^[0-9A-Za-z]{12}$/

export const TITLE_MAX_LENGTH = 120
export const CONTENT_MAX_LENGTH = 50_000
export const REQUEST_BODY_MAX_BYTES = 256 * 1024

export const PROOF_NONCE_PATTERN = /^\d{1,12}$/
export const PROOF_TTL_MS = 5 * 60 * 1000

export function isValidPostId(value: unknown): value is string {
  return typeof value === 'string' && POST_ID_PATTERN.test(value)
}
