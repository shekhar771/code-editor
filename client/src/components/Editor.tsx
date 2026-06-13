import MonacoEditor, { type OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import * as monaco from 'monaco-editor'
import { useCallback, useEffect, useRef, useState } from 'react'
import { languageFromFilename, type EditorViewSettings } from '../types'
import { EditorToolbar } from './EditorToolbar'

interface EditorProps {
  filename: string
  content: string
  isDirty: boolean
  settings: EditorViewSettings
  onChange: (value: string) => void
  onSave: () => void
  onUpdateSettings: (patch: Partial<EditorViewSettings>) => void
  onZoomIn: () => void
  onZoomOut: () => void
}

export function Editor({
  filename,
  content,
  isDirty,
  settings,
  onChange,
  onSave,
  onUpdateSettings,
  onZoomIn,
  onZoomOut,
}: EditorProps) {
  const language = languageFromFilename(filename)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const onSaveRef = useRef(onSave)
  const isDirtyRef = useRef(isDirty)
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null)

  onSaveRef.current = onSave
  isDirtyRef.current = isDirty

  useEffect(() => {
    if (!saveFeedback) {
      return
    }
    const timer = window.setTimeout(() => setSaveFeedback(null), 2000)
    return () => window.clearTimeout(timer)
  }, [saveFeedback])

  const handleSave = useCallback(() => {
    if (!isDirtyRef.current) {
      return
    }
    onSaveRef.current()
    setSaveFeedback('Saved')
  }, [])

  const handleMount: OnMount = useCallback((editorInstance) => {
    editorRef.current = editorInstance
    editorInstance.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => handleSave(),
    )
  }, [handleSave])

  useEffect(() => {
    const editorInstance = editorRef.current
    if (!editorInstance) {
      return
    }
    editorInstance.updateOptions({
      fontSize: settings.fontSize,
      lineNumbers: settings.lineNumbers ? 'on' : 'off',
      minimap: { enabled: settings.minimap },
      wordWrap: settings.wordWrap ? 'on' : 'off',
      renderWhitespace: settings.showWhitespace ? 'boundary' : 'none',
    })
  }, [settings])

  return (
    <div className="flex h-full w-full flex-col">
      <EditorToolbar
        filename={filename}
        isDirty={isDirty}
        saveFeedback={saveFeedback}
        settings={settings}
        onSave={handleSave}
        onUpdateSettings={onUpdateSettings}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
      />
      <div className="min-h-0 flex-1">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          value={content}
          onChange={(value) => onChange(value ?? '')}
          onMount={handleMount}
          options={{
            minimap: { enabled: settings.minimap },
            fontSize: settings.fontSize,
            lineNumbers: settings.lineNumbers ? 'on' : 'off',
            wordWrap: settings.wordWrap ? 'on' : 'off',
            renderWhitespace: settings.showWhitespace ? 'boundary' : 'none',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  )
}
