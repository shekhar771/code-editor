import dotenv from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { Pool } from 'pg'

// must load before Pool — route imports run before dotenv.config() in index.ts
const rootEnv = join(dirname(fileURLToPath(import.meta.url)), '../../../.env')
dotenv.config({ path: rootEnv })

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
  max: 10,
})

pool.on('error', (err) => {
  console.error('[db] pool error:', err.message)
})

export async function query<T>(sql: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(sql, params)
  return result.rows as T[]
}

export async function checkDb(): Promise<void> {
  await pool.query('SELECT 1')
}

export default pool
