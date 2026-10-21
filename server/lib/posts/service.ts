import type Database from 'better-sqlite3'
import { generatePostId } from '../security/random'
import { createPostRepository, type PostRecord } from './repository'

const MAX_ID_ATTEMPTS = 5

export interface CreatedPost {
  id: string
}

export interface PostService {
  create: (input: { title: string, content: string }) => CreatedPost
  find: (id: string) => PostRecord | undefined
}

function isPrimaryKeyConflict(error: unknown): boolean {
  return (error as { code?: string } | null)?.code === 'SQLITE_CONSTRAINT_PRIMARYKEY'
}

function currentDay(): string {
  return new Date().toISOString().slice(0, 10)
}

export function createPostService(db: Database.Database): PostService {
  const posts = createPostRepository(db)

  function create(input: { title: string, content: string }): CreatedPost {
    const createdOn = currentDay()

    for (let attempt = 0; attempt < MAX_ID_ATTEMPTS; attempt++) {
      const id = generatePostId()
      try {
        posts.insert({ id, title: input.title, content: input.content, createdOn })
        return { id }
      }
      catch (error) {
        if (!isPrimaryKeyConflict(error)) throw error
      }
    }

    throw new Error('Failed to allocate a unique post id')
  }

  return {
    create,
    find: id => posts.findById(id),
  }
}
