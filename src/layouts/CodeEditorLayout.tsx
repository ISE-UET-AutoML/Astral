import { useNavigate, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'

/**
 * Full-viewport layout for the code-editor page.
 *
 *  ┌─ topBar (shrink-0) ──────────────────────────────┐
 *  │  ← Back to Apps                    🔄 Adapting... │
 *  ├──────────┬──────────┬────────────────────────────┤
 *  │  chat    │  files   │  editor                    │
 *  │  scroll  │  scroll  │  Monaco scroll             │
 *  └──────────┴──────────┴────────────────────────────┘
 *
 * @param {{ chatSlot, treeSlot, editorSlot, isAdapting?: boolean }} props
 */
type CodeEditorLayoutProps = {
	chatSlot: ReactNode
	treeSlot: ReactNode
	editorSlot: ReactNode
	isAdapting?: boolean
}

export default function CodeEditorLayout({ chatSlot, treeSlot, editorSlot, isAdapting }: CodeEditorLayoutProps) {
	const { id: projectId } = useParams()
	const navigate = useNavigate()

	return (
		<div className="fixed inset-0 z-50 flex flex-col bg-gray-100 dark:bg-[#1e1e1e]">
			{/* Top bar – always visible */}
			<div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#252526] border-b border-gray-200 dark:border-[#333]">
				<div className="text-sm text-gray-600 dark:text-[#cccccc] bg-gray-100 dark:bg-[#252526] rounded-full px-4 py-2">
					Animal Classification (current version: 5.0)
				</div>
				{isAdapting && (
					<span className="text-sm text-orange-600 dark:text-orange-400 ml-4">
						🔄 Adapting...
					</span>
				)}
			</div>

			{/* 3-column body – each slot handles its own scroll */}
			<div className="flex-1 min-h-0 grid grid-cols-[360px_240px_1fr]">
				<div className="min-w-0 min-h-0 overflow-hidden">{chatSlot}</div>
				<div className="min-w-0 min-h-0 overflow-hidden">{treeSlot}</div>
				<div className="min-w-0 min-h-0 overflow-hidden">{editorSlot}</div>
			</div>
		</div>
	)
}
