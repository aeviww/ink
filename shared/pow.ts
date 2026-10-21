export function proofInput(challenge: string, nonce: string): string {
  return `${challenge}:${nonce}`
}

export function countLeadingZeroBits(bytes: Uint8Array): number {
  let bits = 0
  for (const byte of bytes) {
    if (byte === 0) {
      bits += 8
      continue
    }
    return bits + Math.clz32(byte) - 24
  }
  return bits
}

export function meetsDifficulty(hash: Uint8Array, difficulty: number): boolean {
  return countLeadingZeroBits(hash) >= difficulty
}
