import { createHmac, randomBytes } from 'node:crypto'

export type ClientKeyFn = (address: string) => string

export function createClientKeyFn(secret: Buffer = randomBytes(32)): ClientKeyFn {
  return (address) => createHmac('sha256', secret).update(address).digest('base64url').slice(0, 22)
}
