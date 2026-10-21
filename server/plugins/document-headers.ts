import { buildDocumentPolicy } from '../lib/security/content-security-policy'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response) => {
    if (!response.headers) return
    delete response.headers['x-powered-by']

    if (import.meta.dev || typeof response.body !== 'string') return
    response.headers['content-security-policy'] = buildDocumentPolicy(response.body)
  })
})
