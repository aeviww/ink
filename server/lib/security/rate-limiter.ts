export interface RateLimitResult {
  allowed: boolean
  retryAfterSeconds: number
}

export interface RateLimiterOptions {
  limit: number
  windowMs: number
  now?: () => number
}

export interface RateLimiter {
  consume: (key: string) => RateLimitResult
}

interface Bucket {
  count: number
  resetAt: number
}

export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const now = options.now ?? Date.now
  const buckets = new Map<string, Bucket>()
  let lastSweep = 0

  function sweep(currentTime: number): void {
    if (currentTime - lastSweep < options.windowMs) return
    lastSweep = currentTime
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= currentTime) buckets.delete(key)
    }
  }

  function consume(key: string): RateLimitResult {
    if (options.limit <= 0) return { allowed: true, retryAfterSeconds: 0 }

    const currentTime = now()
    sweep(currentTime)

    let bucket = buckets.get(key)
    if (!bucket || bucket.resetAt <= currentTime) {
      bucket = { count: 0, resetAt: currentTime + options.windowMs }
      buckets.set(key, bucket)
    }

    bucket.count += 1
    const retryAfterSeconds = Math.ceil((bucket.resetAt - currentTime) / 1000)
    return { allowed: bucket.count <= options.limit, retryAfterSeconds }
  }

  return { consume }
}
