import type { ChallengeResponse } from '#shared/types/api'

export default defineApiHandler((): ChallengeResponse => useProofOfWork().issue())
