import type { Migration } from './types'

export const removeDeleteToken: Migration = {
  version: 2,
  name: 'remove_delete_token',
  up: `
    ALTER TABLE posts DROP COLUMN delete_token_hash;
  `,
}