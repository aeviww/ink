import type { PostView } from '#shared/types/api'
import { renderMarkdown } from '../../lib/markdown/render'

export default defineApiHandler((event): PostView => {
  const post = usePosts().find(requirePostId(event))
  if (!post) throw apiError(404, 'not_found', 'публикация не найдена')

  return {
    id: post.id,
    title: post.title,
    html: renderMarkdown(post.content),
    createdOn: post.createdOn,
  }
})
