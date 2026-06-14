import bcrypt from 'bcryptjs'
import { Router, Response } from 'express'
import jwt from 'jsonwebtoken'
import { query } from '../db/index.js'
import { AuthRequest, requireAuth } from '../middleware/auth.js'
import type { User } from '../types/index.js'

const router = Router()

interface UserRow {
  id: string
  name: string
  email: string
  password_hash: string | null
  created_at: string
}

function publicUser(row: UserRow): User {
  return { id: row.id, name: row.name, email: row.email, created_at: row.created_at }
}

function signToken(user: UserRow): string {
  const secret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d'
  if (!secret) throw new Error('JWT_SECRET not set')
  return jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    secret,
    { expiresIn },
  )
}

router.post('/register', async (req, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name?: string
      email?: string
      password?: string
    }

    if (!name?.trim() || !email?.trim() || !password) {
      res.status(400).json({ error: 'Name, email and password are required' })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' })
      return
    }

    const existing = await query<UserRow>('SELECT id FROM users WHERE email = $1', [
      email.trim().toLowerCase(),
    ])
    if (existing.length > 0) {
      res.status(409).json({ error: 'Email already registered' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const rows = await query<UserRow>(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, password_hash, created_at`,
      [name.trim(), email.trim().toLowerCase(), passwordHash],
    )

    const user = rows[0]
    if (!user) {
      res.status(500).json({ error: 'Failed to create user' })
      return
    }

    res.status(201).json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    console.error('[auth] register:', err instanceof Error ? err.message : err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string }

    if (!email?.trim() || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    const rows = await query<UserRow>(
      'SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1',
      [email.trim().toLowerCase()],
    )

    const user = rows[0]
    if (!user?.password_hash) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    res.json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    console.error('[auth] login:', err instanceof Error ? err.message : err)
    res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  res.json({ user: req.user })
})

export default router
