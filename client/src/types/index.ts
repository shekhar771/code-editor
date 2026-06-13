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
  savedContent: string
}

export interface EditorViewSettings {
  lineNumbers: boolean
  minimap: boolean
  wordWrap: boolean
  showWhitespace: boolean
  fontSize: number
}

export const DEFAULT_EDITOR_VIEW_SETTINGS: EditorViewSettings = {
  lineNumbers: true,
  minimap: false,
  wordWrap: true,
  showWhitespace: false,
  fontSize: 14,
}

export function isFileDirty(file: EditorFile): boolean {
  return file.content !== file.savedContent
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
function sampleFile(
  id: string,
  name: string,
  content: string,
): EditorFile {
  return { id, name, content, savedContent: content }
}

export const SAMPLE_FILES: EditorFile[] = [
  sampleFile('1', 'index.ts', `export function greet(name: string): string {
  return \`Hello, \${name}!\`
}

const message = greet('CodeSync')
`),
  sampleFile('2', 'app.tsx', `import { useState } from 'react'

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
`),
  sampleFile('3', 'styles.css', `body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background-color: #1e1e1e;
  color: #d4d4d4;
}

.sidebar {
  width: 240px;
  background-color: #252526;
}
`),
]

