const STATUS_MESSAGES: Record<number, string> = {
  413: 'публикация слишком большая',
  429: 'слишком много запросов. попробуйте позже.',
  502: 'сервер временно недоступен',
  503: 'сервер временно недоступен',
}

interface FetchErrorLike {
  statusCode?: number
  data?: { message?: unknown, data?: { code?: unknown } }
}

export function getApiErrorStatus(error: unknown): number | undefined {
  return (error as FetchErrorLike | null)?.statusCode
}

export function getApiErrorMessage(error: unknown, fallback = 'что-то пошло не так. попробуйте ещё раз.'): string {
  const { statusCode, data } = (error ?? {}) as FetchErrorLike

  if (statusCode === undefined) return 'нет соединения с сервером'
  if (STATUS_MESSAGES[statusCode]) return STATUS_MESSAGES[statusCode]
  if (data?.data?.code && typeof data.message === 'string') return data.message

  return fallback
}
