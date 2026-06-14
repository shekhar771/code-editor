import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import authRoutes from './routes/auth.js'
import fileRoutes from './routes/files.js'
import projectRoutes from './routes/projects.js'
import { checkDb } from './db/index.js'

// .env loaded in db/index.ts (before Pool) — root .env is shared by server + client

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
    ],
    credentials: true,
  }),
)
app.use(express.json())

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/health') {
    next()
    return
  }
  const t0 = Date.now()
  res.on('finish', () => {
    console.log(`${req.method} ${req.path} → ${res.statusCode} (${Date.now() - t0}ms)`)
  })
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api', fileRoutes)

async function start(): Promise<void> {
  try {
    await checkDb()
    console.log(
      `[db] connected as ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[db] connection failed:', msg)
    console.error('[db] is postgres running? run start_postgres.bat first')
    process.exit(1)
  }

  app.listen(port, () => {
    console.log(`[server] http://127.0.0.1:${port}`)
  })
}

start()
