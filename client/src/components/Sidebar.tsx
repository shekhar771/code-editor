import type { EditorFile } from '../types'
import { FileTree } from './FileTree'
import { PresenceBar } from './PresenceBar'

interface SidebarProps {
  projectName: string
  files: EditorFile[]
  activeFileId: string | null
  userName: string
  onSelectFile: (fileId: string) => void
  onDeleteFile: (fileId: string) => void
  onNewFile: () => void
  onLogout: () => void
}

export function Sidebar({
  projectName,
  files,
  activeFileId,
  userName,
  onSelectFile,
  onDeleteFile,
  onNewFile,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-[#1e1e1e] text-white">
      <div className="border-b border-[#3c3c3c] px-4 py-3">
        <h1 className="truncate text-sm font-semibold text-gray-200">{projectName}</h1>
      </div>

      <div className="border-b border-[#3c3c3c] px-3 py-2">
        <button
          type="button"
          onClick={onNewFile}
          className="w-full rounded bg-[#0e639c] px-3 py-1.5 text-left text-sm font-medium text-white transition-colors hover:bg-[#1177bb]"
        >
          + New File
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <FileTree
          files={files}
          activeFileId={activeFileId}
          onSelectFile={onSelectFile}
          onDeleteFile={onDeleteFile}
        />
      </div>

      <div className="border-t border-[#3c3c3c]">
        <PresenceBar />
      </div>

      <div className="border-t border-[#3c3c3c] px-4 py-3">
        <p className="truncate text-xs text-gray-400">
          Logged in as: <span className="text-gray-200">{userName}</span>
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 w-full rounded border border-[#3c3c3c] px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-[#2a2d2e] hover:text-white"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
