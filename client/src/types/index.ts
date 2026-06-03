export interface User {
  id: string
  name: string
  email: string
}

export interface Project {
  id: string
  name: string
  ownerId: string
  createdAt: string
}

export interface EditorFile {
  id: string
  name: string
  content: string
}

export function languageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'js':
      return 'javascript'
    case 'ts':
      return 'typescript'
    case 'py':
      return 'python'
    case 'css':
      return 'css'
    case 'html':
      return 'html'
    case 'json':
      return 'json'
    case 'md':
      return 'markdown'
    default:
      return 'plaintext'
  }
}

export const SAMPLE_FILES: EditorFile[] = [
  {
    id: '1',
    name: 'index.ts',
    content: `export function greet(name: string): string {
  return \`Hello, \${name}!\`
}

const message = greet('CodeSync')
`,
  },
  {
    id: '2',
    name: 'app.tsx',
    content: `import { useState } from 'react'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>CodeSync</h1>
      <button onClick={() => setCount((c) => c + 1)}>
        Count: {count}
      </button>
    </div>
  )
}
`,
  },
  {
    id: '3',
    name: 'styles.css',
    content: `body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background-color: #1e1e1e;
  color: #d4d4d4;
}

.sidebar {
  width: 240px;
  background-color: #252526;
}
`,
  },
]
