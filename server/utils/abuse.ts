import type { H3Event } from 'h3'
import { PROOF_TTL_MS } from '#shared/constants'
import { createClientKeyFn } from '../lib/security/client-key'
import { createProofOfWork, type ProofOfWork, type ProofResult } from '../lib/security/proof-of-work'
import { createRateLimiter, type RateLimiter, type RateLimitResult } from '../lib/security/rate-limiter'

interface Limiters {
  createPerClient: RateLimiter
  createGlobal: RateLimiter
}

const PROOF_MESSAGES: Record<Exclude<ProofResult, 'ok'>, string> = {
  invalid: 'подтверждение публикации недействительно. попробуйте ещё раз.',
  expired: 'подтверждение устарело. попробуйте ещё раз.',
  reused: 'подтверждение уже использовано. попробуйте ещё раз.',
  insufficient: 'подтверждение не прошло проверку. попробуйте ещё раз.',
}

const clientKey = createClientKeyFn()
let proofOfWork: ProofOfWork | undefined
let limiters: Limiters | undefined

export function useProofOfWork(): ProofOfWork {
  if (!proofOfWork) {
    const difficulty = Math.min(Math.max(Math.trunc(Number(useRuntimeConfig().powDifficulty)) || 0, 0), 28)
    proofOfWork = createProofOfWork({ difficulty, ttlMs: PROOF_TTL_MS })
  }
  return proofOfWork
}

export function assertProofOfWork(challenge: string, nonce: string): void {
  const result = useProofOfWork().verify(challenge, nonce)
  if (result !== 'ok') throw apiError(400, `proof_${result}`, PROOF_MESSAGES[result])
}

function useLimiters(): Limiters {
  if (!limiters) {
    const { windowSeconds, createPerClient, createGlobal } = useRuntimeConfig().rateLimit
    const windowMs = Number(windowSeconds) * 1000
    limiters = {
      createPerClient: createRateLimiter({ limit: Number(createPerClient), windowMs }),
      createGlobal: createRateLimiter({ limit: Number(createGlobal), windowMs }),
    }
  }
  return limiters
}

function rejectIfExceeded(event: H3Event, result: RateLimitResult): void {
  if (result.allowed) return
  setResponseHeader(event, 'Retry-After', result.retryAfterSeconds)
  throw apiError(429, 'rate_limited', 'слишком много запросов. попробуйте позже.')
}

export function enforceRateLimit(event: H3Event): void {
  const { createPerClient, createGlobal } = useLimiters()
  const key = clientKey(getClientAddress(event))

  rejectIfExceeded(event, createPerClient.consume(key))
  rejectIfExceeded(event, createGlobal.consume('global'))
}
