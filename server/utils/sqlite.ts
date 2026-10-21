import type Database from 'better-sqlite3'
import { openDatabase } from '../lib/db/connection'
import { createPostService, type PostService } from '../lib/posts/service'

let database: Database.Database | undefined
let postService: PostService | undefined

export function useSqlite(): Database.Database {
  database ??= openDatabase(useRuntimeConfig().databasePath)
  return database
}

export function usePosts(): PostService {
  postService ??= createPostService(useSqlite())
  return postService
}

export function closeSqlite(): void {
  database?.close()
  database = undefined
  postService = undefined
}
