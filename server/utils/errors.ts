const STATUS_TEXT: Record<number, string> = {
  400: 'Bad Request',
  403: 'Forbidden',
  404: 'Not Found',
  413: 'Payload Too Large',
  415: 'Unsupported Media Type',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
}

export function apiError(statusCode: number, code: string, message: string) {
  return createError({
    statusCode,
    statusMessage: STATUS_TEXT[statusCode] ?? 'Error',
    message,
    data: { code },
  })
}

export function describeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`
  return 'Unknown error'
}
