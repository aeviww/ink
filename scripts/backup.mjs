import { existsSync, mkdirSync, chmodSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function loadDatabaseDriver() {
  const candidates = [
    createRequire(join(root, 'package.json')),
    createRequire(join(root, '.output/server/index.mjs')),
  ]

  for (const require of candidates) {
    try {
      return require('better-sqlite3')
    }
    catch {}
  }

  throw new Error('better-sqlite3 не найден. Сначала выполните npm install или npm run build.')
}

function absolutePath(value) {
  return isAbsolute(value) ? value : resolve(root, value)
}

const source = absolutePath(process.argv[2] ?? process.env.NUXT_DATABASE_PATH ?? './data/ink.db')
const timestamp = new Date().toISOString().replaceAll(':', '-').replace(/\.\d{3}Z$/, 'Z')
const destination = absolutePath(process.argv[3] ?? `./backups/ink-${timestamp}.db`)

if (!existsSync(source)) throw new Error(`База данных не найдена: ${source}`)
if (existsSync(destination)) throw new Error(`Файл уже существует: ${destination}`)

mkdirSync(dirname(destination), { recursive: true, mode: 0o700 })

const Database = loadDatabaseDriver()
const database = new Database(source, { readonly: true, fileMustExist: true })

try {
  database.prepare('VACUUM INTO ?').run(destination)
  chmodSync(destination, 0o600)
}
catch (error) {
  try {
    if (existsSync(destination)) chmodSync(destination, 0o600)
  }
  catch {}
  throw error
}
finally {
  database.close()
}

console.log(destination)