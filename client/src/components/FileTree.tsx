import type { EditorFile } from '../types'

interface FileTreeProps {
  files: EditorFile[]
  activeFileId: string | null
  onSelectFile: (fileId: string) => void
  onDeleteFile: (fileId: string) => void
}

export function FileTree({ files, activeFileId, onSelectFile, onDeleteFile }: FileTreeProps) {
  if (files.length === 0) {
    return (
      <p className="px-3 py-2 text-sm text-gray-500">No files yet</p>
    )
  }

  return (
    <ul className="flex flex-col gap-0.5 px-2">
      {files.map((file) => {
        const isActive = file.id === activeFileId

        return (
          <li key={file.id}>
            <div
              className={`group flex items-center justify-between rounded px-2 py-1.5 text-sm ${
                isActive
                  ? 'bg-[#37373d] text-white'
                  : 'text-gray-300 hover:bg-[#2a2d2e]'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectFile(file.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <span className="shrink-0 text-gray-400" aria-hidden="true">
                  📄
                </span>
                <span className="truncate">{file.name}</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteFile(file.id)}
                className="ml-1 shrink-0 rounded px-1 text-gray-500 opacity-0 transition-opacity hover:bg-[#4a4a4a] hover:text-red-400 group-hover:opacity-100"
                aria-label={`Delete ${file.name}`}
              >
                ×
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
