import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthRequest extends Request {
  user?: AuthUser
}

interface JwtPayload {
  userId: string
  name: string
  email: string
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const token = header.slice(7)
  const secret = process.env.JWT_SECRET
  if (!secret) {
    res.status(500).json({ error: 'Server misconfigured' })
    return
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload
    req.user = { id: payload.userId, name: payload.name, email: payload.email }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

export function internalAuth(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env.INTERNAL_API_TOKEN
  if (!expected) {
    res.status(500).json({ error: 'Server misconfigured' })
    return
  }

  if (req.headers.authorization !== expected) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}
