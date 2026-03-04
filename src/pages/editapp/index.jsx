import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { workspaceApi, initDraft } from 'src/api/workspace'
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

const EditAppPage = () => {
	const { appId, id: projectId } = useParams()
	const navigate = useNavigate()
	const [currentFile, setCurrentFile] = useState('')
	const [originalCode, setOriginalCode] = useState('')
	const [isAdapting, setIsAdapting] = useState(false)
	const [isSnapshotting, setIsSnapshotting] = useState(false)
	const [isDeploying, setIsDeploying] = useState(false)

	// All hooks must be called before any conditional returns
	const { tree, refetch: refetchTree } = useFileTree(appId)
	const { code, setCode, isSaving } = useFileEditor(appId, currentFile, originalCode)
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
		for (const [name, child] of Object.entries(node.children)) {
			if (name === 'index.html' && child.type === 'file') {
				return currentPath ? `${currentPath}/index.html` : 'index.html'
			}
		}
		const sortedEntries = Object.entries(node.children)
			.filter(([_, child]) => child.type === 'dir')
			.sort(([nameA], [nameB]) => {
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

	// Auto-save vào Redis sau khi dừng gõ 1.5s
	const handleCodeChange = useCallback((newCode) => {
		setCode(newCode)
		if (!currentFile || !appId) return
		clearTimeout(autoSaveTimerRef.current)
		autoSaveTimerRef.current = setTimeout(() => {
			workspaceApi.saveFile(appId, currentFile, newCode).catch(() => {})
		}, AUTOSAVE_DEBOUNCE_MS)
	}, [appId, currentFile, setCode])

	// Ctrl+S: save Redis + Git snapshot
	const handleSaveFile = useCallback(async () => {
		if (!currentFile) {
			message.warning('No file opened!')
			return
		}
		clearTimeout(autoSaveTimerRef.current)
		try {
			await workspaceApi.saveFile(appId, currentFile, code)
			await workspaceApi.saveDraftSnapshot(appId)
			setOriginalCode(code)
			message.success('Saved!')
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

	// Init draft workspace when entering edit page (covers: Details click + direct URL)
	useEffect(() => {
		if (!appId) return
		initDraft(appId).catch((err) => {
			console.warn('[EditAppPage] initDraft failed:', err)
		})
	}, [appId])

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

	useEffect(() => {
		if (!tree || currentFile || hasAutoLoadedRef.current) return
		const indexHtmlPath = findIndexHtml(tree)
		if (indexHtmlPath) {
			hasAutoLoadedRef.current = true
			loadFile(indexHtmlPath)
		}
	}, [tree, currentFile, findIndexHtml, loadFile])

	// sendChatMessage from useAmtaChat handles the LLM streaming

	if (!appId) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<p className="text-gray-600 mb-4">Invalid app ID</p>
					<Button onClick={() => navigate(`/app/project/${projectId}/my-apps`)}>
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
