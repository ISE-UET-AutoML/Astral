import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'src/components/ui/button'
import { ArrowLeftOutlined } from '@ant-design/icons'

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
export default function CodeEditorLayout({ chatSlot, treeSlot, editorSlot, isAdapting }) {
	const { id: projectId } = useParams()
	const navigate = useNavigate()

	return (
		<div className="fixed inset-0 z-50 flex flex-col bg-gray-100 dark:bg-[#1e1e1e]">
			{/* Top bar – always visible */}
			<div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#252526] border-b border-gray-200 dark:border-[#333]">
				<Button
					variant="ghost"
					size="sm"
					className="dark:text-[#cccccc] dark:hover:text-white dark:hover:bg-white/10"
					onClick={() => navigate(`/app/project/${projectId}/my-apps`)}
				>
					<ArrowLeftOutlined className="h-4 w-4 mr-2" />
					Back to Apps
				</Button>
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
