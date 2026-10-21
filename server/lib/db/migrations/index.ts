import { createPosts } from './001-create-posts'
import { removeDeleteToken } from './002-remove-delete-token'
import type { Migration } from './types'

export type { Migration }

export const migrations: Migration[] = [createPosts, removeDeleteToken]
