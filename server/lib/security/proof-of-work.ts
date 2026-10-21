import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { meetsDifficulty, proofInput } from '#shared/pow'

export type ProofResult = 'ok' | 'invalid' | 'expired' | 'reused' | 'insufficient'

export interface ProofOfWorkOptions {
  difficulty: number
  ttlMs: number
  secret?: Buffer
  now?: () => number
}

export interface ProofOfWork {
  issue: () => { challenge: string, difficulty: number }
  verify: (challenge: string, nonce: string) => ProofResult
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function createProofOfWork(options: ProofOfWorkOptions): ProofOfWork {
  const secret = options.secret ?? randomBytes(32)
  const now = options.now ?? Date.now
  const usedChallenges = new Map<string, number>()

  function sign(payload: string): string {
    return createHmac('sha256', secret).update(payload).digest('base64url')
  }

  function forgetExpired(currentTime: number): void {
    for (const [challenge, expiresAt] of usedChallenges) {
      if (expiresAt <= currentTime) usedChallenges.delete(challenge)
    }
  }

  function issue() {
    const payload = [now(), options.difficulty, randomBytes(12).toString('base64url')].join('.')
    return { challenge: `${payload}.${sign(payload)}`, difficulty: options.difficulty }
  }

  function verify(challenge: string, nonce: string): ProofResult {
    const parts = challenge.split('.')
    if (parts.length !== 4) return 'invalid'

    const [issuedAtPart, difficultyPart, randomPart, signature] = parts as [string, string, string, string]
    if (!safeEqual(signature, sign(`${issuedAtPart}.${difficultyPart}.${randomPart}`))) return 'invalid'

    const currentTime = now()
    const issuedAt = Number(issuedAtPart)
    const age = currentTime - issuedAt
    if (!Number.isFinite(age) || age < 0 || age > options.ttlMs) return 'expired'

    forgetExpired(currentTime)
    if (usedChallenges.has(challenge)) return 'reused'

    const hash = createHash('sha256').update(proofInput(challenge, nonce)).digest()
    if (!meetsDifficulty(hash, Number(difficultyPart))) return 'insufficient'

    usedChallenges.set(challenge, issuedAt + options.ttlMs)
    return 'ok'
  }

  return { issue, verify }
}
