import { Router, Response } from 'express'
import express from 'express'
import { query } from '../db/index.js'
import { AuthRequest, internalAuth, requireAuth } from '../middleware/auth.js'
import type { FileRecord } from '../types/index.js'

const router = Router()

interface FileRow {
  id: string
  name: string
  project_id: string
  language: string
  created_at: string
  updated_at: string
}

interface YdocRow {
  ydoc_state: Buffer | null
}

function toFile(row: FileRow): FileRecord {
  return {
    id: row.id,
    name: row.name,
    project_id: row.project_id,
    language: row.language,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function isProjectMember(userId: string, projectId: string): Promise<boolean> {
  const rows = await query<{ ok: number }>(
    'SELECT 1 AS ok FROM project_members WHERE user_id = $1 AND project_id = $2',
    [userId, projectId],
  )
  return rows.length > 0
}

router.get('/projects/:projectId/files', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const { projectId } = req.params
    if (!projectId) {
      res.status(400).json({ error: 'Project id is required' })
      return
    }

    const member = await isProjectMember(req.user.id, projectId)
    if (!member) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    const rows = await query<FileRow>(
      `SELECT id, name, project_id, language, created_at, updated_at
       FROM files WHERE project_id = $1 ORDER BY created_at ASC`,
      [projectId],
    )

    res.json({ files: rows.map(toFile) })
  } catch {
    res.status(500).json({ error: 'Failed to load files' })
  }
})

router.post('/projects/:projectId/files', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const { projectId } = req.params
    const { name, language } = req.body as { name?: string; language?: string }

    if (!projectId) {
      res.status(400).json({ error: 'Project id is required' })
      return
    }
    if (!name?.trim()) {
      res.status(400).json({ error: 'File name is required' })
      return
    }

    const member = await isProjectMember(req.user.id, projectId)
    if (!member) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    const rows = await query<FileRow>(
      `INSERT INTO files (name, project_id, language)
       VALUES ($1, $2, $3)
       RETURNING id, name, project_id, language, created_at, updated_at`,
      [name.trim(), projectId, language ?? 'plaintext'],
    )

    const file = rows[0]
    if (!file) {
      res.status(500).json({ error: 'Failed to create file' })
      return
    }

    res.status(201).json({ file: toFile(file) })
  } catch {
    res.status(500).json({ error: 'Failed to create file' })
  }
})

router.delete(
  '/projects/:projectId/files/:fileId',
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const projectId = routeParam(req.params.projectId)
      const fileId = routeParam(req.params.fileId)
      if (!projectId || !fileId) {
        res.status(400).json({ error: 'Project and file id are required' })
        return
      }

      const member = await isProjectMember(req.user.id, projectId)
      if (!member) {
        res.status(403).json({ error: 'Access denied' })
        return
      }

      const deleted = await query<{ id: string }>(
        'DELETE FROM files WHERE id = $1 AND project_id = $2 RETURNING id',
        [fileId, projectId],
      )

      if (deleted.length === 0) {
        res.status(404).json({ error: 'File not found' })
        return
      }

      res.json({ ok: true })
    } catch {
      res.status(500).json({ error: 'Failed to delete file' })
    }
  },
)

router.get('/files/:fileId/ydoc', internalAuth, async (req, res: Response) => {
  try {
    const fileId = routeParam(req.params.fileId)
    if (!fileId) {
      res.status(400).json({ error: 'File id is required' })
      return
    }

    const rows = await query<YdocRow>('SELECT ydoc_state FROM files WHERE id = $1', [fileId])
    const row = rows[0]
    if (!row) {
      res.status(404).json({ error: 'File not found' })
      return
    }

    if (!row.ydoc_state) {
      res.status(204).send()
      return
    }

    res.set('Content-Type', 'application/octet-stream')
    res.send(row.ydoc_state)
  } catch {
    res.status(500).json({ error: 'Failed to load document' })
  }
})

router.put(
  '/files/:fileId/ydoc',
  internalAuth,
  express.raw({ type: 'application/octet-stream', limit: '10mb' }),
  async (req, res: Response) => {
    try {
      const fileId = routeParam(req.params.fileId)
      if (!fileId) {
        res.status(400).json({ error: 'File id is required' })
        return
      }

      const body = req.body
      if (!Buffer.isBuffer(body)) {
        res.status(400).json({ error: 'Expected binary body' })
        return
      }

      const rows = await query<{ id: string }>(
        'UPDATE files SET ydoc_state = $1 WHERE id = $2 RETURNING id',
        [body, fileId],
      )

      if (rows.length === 0) {
        res.status(404).json({ error: 'File not found' })
        return
      }

      res.json({ ok: true })
    } catch {
      res.status(500).json({ error: 'Failed to save document' })
    }
  },
)

export default router
