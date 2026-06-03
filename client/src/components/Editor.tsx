import MonacoEditor from '@monaco-editor/react'
import { languageFromFilename } from '../types'

interface EditorProps {
  filename: string
  content: string
  onChange: (value: string) => void
}

export function Editor({ filename, content, onChange }: EditorProps) {
  const language = languageFromFilename(filename)

  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        language={language}
        theme="vs-dark"
        value={content}
        onChange={(value) => onChange(value ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}
