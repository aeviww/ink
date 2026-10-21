import type { CreatePostResponse } from '#shared/types/api'
import { parseCreatePostInput } from '../../lib/validation/posts'

export default defineApiHandler(async (event): Promise<CreatePostResponse> => {
  enforceRateLimit(event)

  const input = validated(parseCreatePostInput(await readJsonBody(event)))
  assertProofOfWork(input.challenge, input.nonce)

  const { id } = usePosts().create(input)

  setResponseStatus(event, 201)
  return { id, path: `/${id}` }
})
