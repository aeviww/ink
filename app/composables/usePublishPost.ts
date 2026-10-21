import type { ChallengeResponse, CreatePostResponse } from '#shared/types/api'

export type PublishStatus = 'idle' | 'verifying' | 'publishing'

export function usePublishPost() {
  const status = ref<PublishStatus>('idle')
  const error = ref<string | null>(null)
  const isBusy = computed(() => status.value !== 'idle')

  async function publish(input: { title: string, content: string }): Promise<CreatePostResponse | null> {
    if (isBusy.value) return null
    error.value = null

    try {
      status.value = 'verifying'
      const { challenge, difficulty } = await $fetch<ChallengeResponse>('/api/challenge')
      const nonce = await solveChallenge(challenge, difficulty)

      status.value = 'publishing'
      return await $fetch<CreatePostResponse>('/api/posts', {
        method: 'POST',
        body: { ...input, challenge, nonce },
      })
    }
    catch (cause) {
      error.value = getApiErrorMessage(cause, 'не удалось опубликовать. попробуйте ещё раз.')
      return null
    }
    finally {
      status.value = 'idle'
    }
  }

  return { status, error, isBusy, publish }
}
