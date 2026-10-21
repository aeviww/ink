const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
const ALLOWED_FETCH_SITES = new Set(['same-origin', 'none'])

function isAllowedOrigin(origin: string, siteUrl: string, host: string | undefined): boolean {
  try {
    const parsed = new URL(origin)
    return siteUrl ? parsed.origin === new URL(siteUrl).origin : parsed.host === host
  }
  catch {
    return false
  }
}

export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/') || SAFE_METHODS.has(event.method)) return

  const fetchSite = getRequestHeader(event, 'sec-fetch-site')
  if (fetchSite && !ALLOWED_FETCH_SITES.has(fetchSite)) {
    throw apiError(403, 'cross_origin', 'запрос с другого сайта отклонён')
  }

  const origin = getRequestHeader(event, 'origin')
  if (origin) {
    const config = useRuntimeConfig(event)
    const host = getRequestHost(event, { xForwardedHost: Boolean(config.trustProxy) })
    if (!isAllowedOrigin(origin, config.public.siteUrl, host)) {
      throw apiError(403, 'cross_origin', 'запрос с другого сайта отклонён')
    }
  }

  const contentType = getRequestHeader(event, 'content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('application/json')) {
    throw apiError(415, 'unsupported_media_type', 'ожидается JSON')
  }
})
