import { API_POLICY } from '../lib/security/content-security-policy'

const COMMON_HEADERS = {
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-DNS-Prefetch-Control': 'off',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'accelerometer=(), browsing-topics=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
}

export default defineEventHandler((event) => {
  setResponseHeaders(event, COMMON_HEADERS)

  if (event.path.startsWith('/_nuxt/')) return

  setResponseHeader(event, 'Cache-Control', 'no-store')

  if (event.path.startsWith('/api/')) {
    setResponseHeader(event, 'Content-Security-Policy', API_POLICY)
  }
})
