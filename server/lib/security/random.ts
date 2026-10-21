import { randomBytes } from 'node:crypto'
import { POST_ID_LENGTH } from '#shared/constants'

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function randomString(length: number, alphabet: string = BASE62): string {
  const limit = 256 - (256 % alphabet.length)
  let result = ''

  while (result.length < length) {
    for (const byte of randomBytes(length * 2)) {
      if (byte >= limit) continue
      result += alphabet[byte % alphabet.length]
      if (result.length === length) break
    }
  }

  return result
}

export function generatePostId(): string {
  return randomString(POST_ID_LENGTH)
}
