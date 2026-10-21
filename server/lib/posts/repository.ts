import type Database from 'better-sqlite3'

export interface PostRecord {
  id: string
  title: string
  content: string
  createdOn: string
}

export interface PostRepository {
  insert: (post: PostRecord) => void
  findById: (id: string) => PostRecord | undefined
}

export function createPostRepository(db: Database.Database): PostRepository {
  const insertPost = db.prepare<[string, string, string, string]>(
    'INSERT INTO posts (id, title, content, created_on) VALUES (?, ?, ?, ?)',
  )
  const selectPost = db.prepare<[string], PostRecord>(
    'SELECT id, title, content, created_on AS createdOn FROM posts WHERE id = ?',
  )
  return {
    insert(post) {
      insertPost.run(post.id, post.title, post.content, post.createdOn)
    },
    findById(id) {
      return selectPost.get(id)
    },
  }
}
