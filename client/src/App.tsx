import { useCallback, useMemo, useState } from 'react'
import { AuthForm } from './components/AuthForm'
import { Editor } from './components/Editor'
import { Sidebar } from './components/Sidebar'
import { useAuth } from './hooks/useAuth'
import { SAMPLE_FILES, type EditorFile } from './types'

function App() {
  const { isAuthenticated, logout } = useAuth()
  const [files, setFiles] = useState<EditorFile[]>(SAMPLE_FILES)
  const [activeFileId, setActiveFileId] = useState<string | null>(SAMPLE_FILES[0]?.id ?? null)

  const activeFile = useMemo(
    () => files.find((file) => file.id === activeFileId) ?? null,
    [files, activeFileId],
  )

  const handleSelectFile = useCallback((fileId: string) => {
    setActiveFileId(fileId)
  }, [])

  const handleDeleteFile = useCallback((fileId: string) => {
    setFiles((current) => {
      const next = current.filter((file) => file.id !== fileId)
      setActiveFileId((currentActiveId) => {
        if (currentActiveId !== fileId) {
          return currentActiveId
        }
        return next[0]?.id ?? null
      })
      return next
    })
  }, [])

  const handleContentChange = useCallback((value: string) => {
    if (!activeFileId) {
      return
    }
    setFiles((current) =>
      current.map((file) =>
        file.id === activeFileId ? { ...file, content: value } : file,
      ),
    )
  }, [activeFileId])

  const handleNewFile = useCallback(() => {
    const newFile: EditorFile = {
      id: crypto.randomUUID(),
      name: `untitled-${files.length + 1}.ts`,
      content: '',
    }
    setFiles((current) => [...current, newFile])
    setActiveFileId(newFile.id)
  }, [files.length])

  if (!isAuthenticated) {
    return <AuthForm />
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#1e1e1e]">
      <Sidebar
        projectName="My Project"
        files={files}
        activeFileId={activeFileId}
        userName="Developer"
        onSelectFile={handleSelectFile}
        onDeleteFile={handleDeleteFile}
        onNewFile={handleNewFile}
        onLogout={logout}
      />
      <main className="min-w-0 flex-1">
        {activeFile ? (
          <Editor
            filename={activeFile.name}
            content={activeFile.content}
            onChange={handleContentChange}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select a file or create a new one
          </div>
        )}
      </main>
    </div>
  )
}

export default App
