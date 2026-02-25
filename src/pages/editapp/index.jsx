import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { workspaceApi } from 'src/api/workspace'
import {
	ChatPanel,
	TreePanel,
	CodeEditorPanel,
} from 'src/components/features/codeeditor'
import { useFileTree, useFileEditor, useSaveShortcut } from 'src/hooks'
import { Button } from 'src/components/shared/ui/button'
import {
	ArrowLeftIcon,
	ArrowUpTrayIcon,
	ArrowPathIcon,
	BookmarkIcon,
} from '@heroicons/react/24/outline'

/**
 * Code Editor Page for editing generated apps
 * Uses AI-assisted editing and file navigation
 */
const EditAppPage = () => {
	const { appId, id: projectId } = useParams()
	const navigate = useNavigate()
	const [currentFile, setCurrentFile] = useState('')
	const [originalCode, setOriginalCode] = useState('')
	const [messages, setMessages] = useState([])
	const [chatInput, setChatInput] = useState('')
	const [isAdapting, setIsAdapting] = useState(false)
	const [isSnapshotting, setIsSnapshotting] = useState(false)
	const [isDeploying, setIsDeploying] = useState(false)

	// All hooks must be called before any conditional returns
	const { tree, refetch: refetchTree } = useFileTree(appId)
	const { code, setCode, isSaving } = useFileEditor(
		appId,
		currentFile,
		originalCode
	)
	const hasAutoLoadedRef = useRef(false)

	// Ensure draft is initialized in versioning backend (idempotent)
	useEffect(() => {
		if (!appId) {
			console.warn('[EditAppPage] No appId, skipping draft init')
			return
		}

		console.log('[EditAppPage] Initializing draft for appId:', appId)
		workspaceApi
			.initDraft(appId)
			.then((result) => {
				console.log('[EditAppPage] Draft initialized successfully:', result)
			})
			.catch((err) => {
				console.error('[EditAppPage] Failed to init draft:', err)
				message.error('Failed to initialize draft. Check console for details.')
			})
	}, [appId])

	// Helper functions (must be defined before conditional return)
	const findIndexHtml = useCallback((node, currentPath = '') => {
		if (!node.children) return null

		// Check current level first
		for (const [name, child] of Object.entries(node.children)) {
			if (name === 'index.html' && child.type === 'file') {
				return currentPath ? `${currentPath}/index.html` : 'index.html'
			}
		}

		// Then search in directories (prefer frontend directory)
		const sortedEntries = Object.entries(node.children)
			.filter(([_, child]) => child.type === 'dir')
			.sort(([nameA], [nameB]) => {
				// Prefer frontend directory
				if (nameA === 'frontend') return -1
				if (nameB === 'frontend') return 1
				return nameA.localeCompare(nameB)
			})

		for (const [name, child] of sortedEntries) {
			const path = currentPath ? `${currentPath}/${name}` : name
			const found = findIndexHtml(child, path)
			if (found) return found
		}

		return null
	}, [])

	const handleSaveFile = useCallback(async () => {
		if (!currentFile) {
			message.warning('No file opened!')
			return
		}

		try {
			await workspaceApi.saveFile(appId, currentFile, code)
			setOriginalCode(code)
			message.success('Saved successfully!')
		} catch (error) {
			console.error('Failed to save file:', error)
			message.error('Failed to save file!')
		}
	}, [appId, currentFile, code])

	const handleSaveSnapshot = useCallback(async () => {
		if (!appId) {
			message.error('Invalid app ID, cannot save snapshot')
			return
		}

		const description = window.prompt('Snapshot description (optional):')
		if (description === null) return

		setIsSnapshotting(true)
		const hide = message.loading('Saving draft snapshot to S3...', 0)
		try {
			const result = await workspaceApi.saveSnapshot(appId, description || undefined)
			console.log('[EditAppPage] Snapshot saved:', result)
			message.success('Draft snapshot saved to S3')
		} catch (err) {
			console.error('[EditAppPage] Failed to save snapshot:', err)
			message.error('Failed to save draft snapshot')
		} finally {
			hide()
			setIsSnapshotting(false)
		}
	}, [appId])

	const handleDeployDraft = useCallback(async () => {
		if (!appId) {
			message.error('Invalid app ID, cannot deploy')
			return
		}

		const description = window.prompt('Version description (optional):')
		if (description === null) return

		if (!window.confirm('Deploy this draft as a new version and push to Vast.ai?')) {
			return
		}

		setIsDeploying(true)
		const hide = message.loading('Deploying draft as new version...', 0)
		try {
			const result = await workspaceApi.deployDraft(appId, description || undefined)
			console.log('[EditAppPage] Draft deployed:', result)
			message.success(
				result?.version_number
					? `Deployed as version v${result.version_number}`
					: 'Draft deployed successfully'
			)
		} catch (err) {
			console.error('[EditAppPage] Failed to deploy draft:', err)
			message.error('Failed to deploy draft')
		} finally {
			hide()
			setIsDeploying(false)
		}
	}, [appId])

	useSaveShortcut(currentFile, code, handleSaveFile)

	const loadFile = useCallback(
		async (path) => {
			try {
				const data = await workspaceApi.getFile(appId, path)
				setCode(data.content)
				setOriginalCode(data.content)
				setCurrentFile(path)
			} catch (error) {
				console.error('Failed to load file:', error)
				message.error('Failed to load file')
			}
		},
		[appId, setCode]
	)

	// Auto-load index.html when tree is ready and no file is open
	useEffect(() => {
		if (!tree || currentFile || hasAutoLoadedRef.current) return

		const indexHtmlPath = findIndexHtml(tree)
		if (indexHtmlPath) {
			hasAutoLoadedRef.current = true
			loadFile(indexHtmlPath)
		}
	}, [tree, currentFile, findIndexHtml, loadFile])

	const sendMessage = useCallback(async () => {
		if (!chatInput.trim() || isAdapting) return

		const userMessage = { role: 'user', content: chatInput }
		setMessages((prev) => [...prev, userMessage])
		const prompt = chatInput
		setChatInput('')
		setIsAdapting(true)

		try {
			// Add "thinking" message
			setMessages((prev) => [
				...prev,
				{ role: 'assistant', content: '🔄 Starting adaptation...' },
			])

			// Start adapt operation
			const adaptResponse = await workspaceApi.startAdapt(appId, prompt)

			// Poll for completion with status updates
			const finalResult = await workspaceApi.pollAdaptCompletion(
				appId,
				adaptResponse.adapt_id,
				(status) => {
					// Update the last assistant message with current status
					setMessages((prev) => {
						const newMessages = [...prev]
						const lastIdx = newMessages.length - 1
						if (newMessages[lastIdx]?.role === 'assistant') {
							newMessages[lastIdx] = {
								role: 'assistant',
								content: `🔄 ${status.message}`,
							}
						}
						return newMessages
					})
				}
			)

			// Update with final result
			if (finalResult.status === 'completed') {
				setMessages((prev) => {
					const newMessages = [...prev]
					const lastIdx = newMessages.length - 1
					if (newMessages[lastIdx]?.role === 'assistant') {
						newMessages[lastIdx] = {
							role: 'assistant',
							content:
								finalResult.result ||
								'✅ Adaptation completed successfully!',
						}
					}
					return newMessages
				})
				message.success('Adaptation completed!')

				// Refresh file tree and current file to show changes
				if (refetchTree) refetchTree()
				if (currentFile) loadFile(currentFile)
			} else {
				setMessages((prev) => {
					const newMessages = [...prev]
					const lastIdx = newMessages.length - 1
					if (newMessages[lastIdx]?.role === 'assistant') {
						newMessages[lastIdx] = {
							role: 'assistant',
							content: `❌ Adaptation failed: ${finalResult.error || 'Unknown error'}`,
						}
					}
					return newMessages
				})
				message.error('Adaptation failed')
			}
		} catch (error) {
			console.error('Adapt error:', error)
			setMessages((prev) => [
				...prev.slice(0, -1), // Remove "thinking" message
				{
					role: 'assistant',
					content: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
				},
			])
			message.error('Failed to adapt')
		} finally {
			setIsAdapting(false)
		}
	}, [chatInput, isAdapting, appId, refetchTree, currentFile, loadFile])

	// Conditional return after all hooks
	if (!appId) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<p className="text-gray-600 mb-4">Invalid app ID</p>
					<Button
						onClick={() =>
							navigate(`/app/project/${projectId}/my-apps`)
						}
					>
						Go Back
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full w-full bg-gray-100 overflow-hidden min-w-0">
			<div className="flex items-center justify-between gap-2 px-4 py-2 bg-white border-b">
				<div className="flex items-center gap-2 flex-wrap justify-end">
					<Button
						variant="ghost"
						size="sm"
						onClick={() =>
							navigate(`/app/project/${projectId}/my-apps`)
						}
					>
						<ArrowLeftIcon className="h-4 w-4 mr-2" />
						Back to Apps
					</Button>
					{isAdapting && (
						<span className="text-sm text-orange-600 ml-4">
							🔄 Adapting...
						</span>
					)}
				</div>
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						variant="outline"
						onClick={handleSaveFile}
						disabled={!currentFile}
					>
						<BookmarkIcon className="h-4 w-4 mr-2" />
						Save file
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={handleSaveSnapshot}
						disabled={isSnapshotting}
					>
						{isSnapshotting ? (
							<ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<BookmarkIcon className="h-4 w-4 mr-2" />
						)}
						{isSnapshotting ? 'Saving snapshot...' : 'Save snapshot'}
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={handleDeployDraft}
						disabled={isDeploying}
						className="border-green-500 text-green-600 hover:bg-green-50"
					>
						{isDeploying ? (
							<ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<ArrowUpTrayIcon className="h-4 w-4 mr-2" />
						)}
						{isDeploying ? 'Deploying...' : 'Deploy'}
					</Button>
				</div>
			</div>
			<div className="grid grid-cols-[360px_240px_1fr] flex-1 min-h-0 overflow-hidden">
				<div className="min-w-0 min-h-0 overflow-hidden">
					<ChatPanel
						messages={messages}
						input={chatInput}
						onInputChange={setChatInput}
						onSendMessage={sendMessage}
					/>
				</div>
				<div className="min-w-0 min-h-0 overflow-hidden">
					<TreePanel tree={tree} onOpen={loadFile} />
				</div>
				<div className="min-w-0 min-h-0 overflow-hidden">
					<CodeEditorPanel
						currentFile={currentFile}
						code={code}
						originalCode={originalCode}
						isSaving={isSaving}
						onCodeChange={setCode}
						onSave={handleSaveFile}
					/>
				</div>
			</div>
		</div>
	)
}

export default EditAppPage
