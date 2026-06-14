export interface User {
  id: string
  name: string
  email: string
  auth_provider: 'local' | 'google'
  created_at: string
}

export interface Project {
  id: string
  name: string
  owner_id: string
  created_at: string
}

export interface FileRecord {
  id: string
  name: string
  project_id: string
  language: string
  created_at: string
  updated_at: string
}
