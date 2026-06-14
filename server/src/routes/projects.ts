import { Router, Response } from 'express'
import { query } from '../db/index.js'
import { AuthRequest, requireAuth } from '../middleware/auth.js'
import type { Project } from '../types/index.js'

const router = Router()

interface ProjectRow {
  id: string
  name: string
  owner_id: string
  created_at: string
}

function toProject(row: ProjectRow): Project {
  return { id: row.id, name: row.name, owner_id: row.owner_id, created_at: row.created_at }
}

async function isProjectOwner(userId: string, projectId: string): Promise<boolean> {
  const rows = await query<{ role: string }>(
    'SELECT role FROM project_members WHERE user_id = $1 AND project_id = $2',
    [userId, projectId],
  )
  return rows[0]?.role === 'owner'
}

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const rows = await query<ProjectRow>(
      `SELECT p.id, p.name, p.owner_id, p.created_at
       FROM projects p
       INNER JOIN project_members pm ON pm.project_id = p.id
       WHERE pm.user_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id],
    )

    res.json({ projects: rows.map(toProject) })
  } catch (err) {
    console.error('[projects] list:', err instanceof Error ? err.message : err)
    res.status(500).json({ error: 'Failed to load projects' })
  }
})

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const { name } = req.body as { name?: string }
    if (!name?.trim()) {
      res.status(400).json({ error: 'Project name is required' })
      return
    }

    const projects = await query<ProjectRow>(
      `INSERT INTO projects (name, owner_id) VALUES ($1, $2)
       RETURNING id, name, owner_id, created_at`,
      [name.trim(), req.user.id],
    )

    const project = projects[0]
    if (!project) {
      res.status(500).json({ error: 'Failed to create project' })
      return
    }

    await query(
      'INSERT INTO project_members (user_id, project_id, role) VALUES ($1, $2, $3)',
      [req.user.id, project.id, 'owner'],
    )

    res.status(201).json({ project: toProject(project) })
  } catch {
    res.status(500).json({ error: 'Failed to create project' })
  }
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const projectId = req.params.id
    if (!projectId) {
      res.status(400).json({ error: 'Project id is required' })
      return
    }

    const owner = await isProjectOwner(req.user.id, projectId)
    if (!owner) {
      res.status(403).json({ error: 'Only the project owner can delete this project' })
      return
    }

    await query('DELETE FROM projects WHERE id = $1', [projectId])
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

export default router
