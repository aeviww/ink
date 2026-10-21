import { chmodSync, existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import Database from 'better-sqlite3'
import { runMigrations } from './migrate'

const IN_MEMORY = ':memory:'
const DATABASE_FILE_SUFFIXES = ['', '-wal', '-shm']

function restrictPermissions(path: string): void {
  for (const suffix of DATABASE_FILE_SUFFIXES) {
    const file = `${path}${suffix}`
    if (existsSync(file)) chmodSync(file, 0o600)
  }
}

export function openDatabase(path: string): Database.Database {
  const isFile = path !== IN_MEMORY

  if (isFile) {
    const directory = dirname(path)
    mkdirSync(directory, { recursive: true, mode: 0o700 })
    chmodSync(directory, 0o700)
  }

  const db = new Database(path)
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')
  db.pragma('secure_delete = ON')
  db.pragma('busy_timeout = 5000')
  db.pragma('trusted_schema = OFF')

  runMigrations(db)

  if (isFile) restrictPermissions(path)

  return db
}
