// Phase 4: show connected users with colored presence dots
export function PresenceBar() {
  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-2 text-xs text-gray-400">
      <span className="text-gray-500">No collaborators online</span>
    </div>
  )
}
