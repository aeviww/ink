import { meetsDifficulty, proofInput } from '#shared/pow'

const BATCH_SIZE = 512

export async function solveChallenge(challenge: string, difficulty: number): Promise<string> {
  const encoder = new TextEncoder()

  for (let start = 0; ; start += BATCH_SIZE) {
    const nonces = Array.from({ length: BATCH_SIZE }, (_, index) => String(start + index))
    const hashes = await Promise.all(
      nonces.map(nonce => crypto.subtle.digest('SHA-256', encoder.encode(proofInput(challenge, nonce)))),
    )
    const index = hashes.findIndex(hash => meetsDifficulty(new Uint8Array(hash), difficulty))
    if (index !== -1) return nonces[index]!
  }
}
