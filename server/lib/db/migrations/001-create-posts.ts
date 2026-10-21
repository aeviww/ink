import type { Migration } from './types'

export const createPosts: Migration = {
  version: 1,
  name: 'create_posts',
  up: `
    CREATE TABLE posts (
      id TEXT PRIMARY KEY NOT NULL CHECK (length(id) = 12),
      title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 120),
      content TEXT NOT NULL CHECK (length(content) > 0),
      delete_token_hash BLOB NOT NULL CHECK (length(delete_token_hash) = 32),
      created_on TEXT NOT NULL CHECK (created_on GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]')
    ) STRICT;
  `,
}
