import type Database from 'better-sqlite3'
import { migrations as defaultMigrations, type Migration } from './migrations'

export function getSchemaVersion(db: Database.Database): number {
  return db.pragma('user_version', { simple: true }) as number
}

export function runMigrations(db: Database.Database, migrations: Migration[] = defaultMigrations): number[] {
  const current = getSchemaVersion(db)
  const pending = migrations
    .filter(migration => migration.version > current)
    .sort((a, b) => a.version - b.version)

  const apply = db.transaction((migration: Migration) => {
    db.exec(migration.up)
    db.pragma(`user_version = ${Math.trunc(migration.version)}`)
  })

  for (const migration of pending) apply(migration)

  return pending.map(migration => migration.version)
}
