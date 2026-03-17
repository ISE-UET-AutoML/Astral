import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { workspaceApi, initDraft } from 'src/api/workspace'
import {
	ChatPanel,
	TreePanel,
	CodeEditorPanel,
} from 'src/components/features/codeeditor'
import {
	useFileTree,
	useFileEditor,
	useSaveShortcut,
	useAmtaModify,
} from 'src/hooks'
import { Button } from 'src/components/shared/ui/button'
import {
	ArrowLeftIcon,
	ArrowUpTrayIcon,
	ArrowPathIcon,
	CodeBracketSquareIcon,
	ComputerDesktopIcon,
	FolderIcon,
	ExclamationTriangleIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline'

const AUTOSAVE_DEBOUNCE_MS = 1500

const EditAppPage = () => {
	const { appId, id: projectId } = useParams()
	const navigate = useNavigate()
	const [currentFile, setCurrentFile] = useState('')
	const [originalCode, setOriginalCode] = useState('')
	const [isAdapting, setIsAdapting] = useState(false)
	const [isSnapshotting, setIsSnapshotting] = useState(false)
	const [isDeploying, setIsDeploying] = useState(false)
	const [streamingContent, setStreamingContent] = useState('')
	/** Figma-style: 'code' | 'app' – bấm icon Code hiện editor, icon App hiện iframe. */
	const [activeMainView, setActiveMainView] = useState('app')
	const [errors, setErrors] = useState([])
	const [app, setApp] = useState(null)
	const [previewKey, setPreviewKey] = useState(0)
	const [currentVersionNumber, setCurrentVersionNumber] = useState(null)

	const autoSaveTimerRef = useRef(null)
	const addError = useCallback((message, type = 'error') => {
		setErrors((prev) => [
			...prev,
			{ id: Date.now() + Math.random(), message, type },
		])
	}, [])
	const dismissError = useCallback((id) => {
		setErrors((prev) => prev.filter((e) => e.id !== id))
	}, [])
	const clearAllErrors = useCallback(() => setErrors([]), [])

	const hasAutoLoadedRef = useRef(false)

	// Disable global page scroll while edit app workspace is open
	useEffect(() => {
		const prevOverflow = document.documentElement.style.overflow
		document.documentElement.style.overflow = 'hidden'
		return () => {
			document.documentElement.style.overflow = prevOverflow
		}
	}, [])

	// All hooks must be called before any conditional returns
	const { tree, refetch: refetchTree } = useFileTree(appId)
	const { code, setCode, isSaving } = useFileEditor(
		appId,
		currentFile,
		originalCode
	)

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
				addError('Failed to load file')
			}
		},
		[appId, setCode, addError]
	)

	const currentFileRef = useRef(currentFile)
	useEffect(() => {
		currentFileRef.current = currentFile
	}, [currentFile])

	const handleModificationSuccess = useCallback(() => {
		refetchTree()
		// Defer slightly to ensure Redis is fully populated before reading
		setTimeout(() => {
			if (currentFileRef.current) {
				loadFile(currentFileRef.current)
			}
		}, 800)
	}, [refetchTree, loadFile])

	// --- AMTA Modify Hook ---
	const { chatInput, setChatInput, isStreaming, liveMessages, sendMessage } =
		useAmtaModify({
			appId,
			instanceId: app?.instance_id,
			modelId: app?.model_id,
			taskType: app?.task_type,
			metadata: app?.metadata,
			projectId: app?.project_id,
			name: app?.name,
			onSuccess: handleModificationSuccess,
		})
	// ------------------------

	const refreshCurrentVersion = useCallback(async () => {
		if (!appId) return
		try {
			const res = await workspaceApi.getVersionsSummary(appId)
			setCurrentVersionNumber(res?.current_version ?? null)
		} catch {
			setCurrentVersionNumber(null)
		}
	}, [appId])

	// Ensure draft is initialized in versioning backend (idempotent)
	useEffect(() => {
		if (!appId) {
			console.warn('[EditAppPage] No appId, skipping draft init')
			return
		}

		console.log(
			'[EditAppPage] Initializing draft and fetching app info for appId:',
			appId
		)

		// Fetch app info for dynamic URL
		workspaceApi
			.getApp(appId)
			.then(setApp)
			.catch((err) => {
				console.error('[EditAppPage] Failed to fetch app info:', err)
			})

		workspaceApi
			.initDraft(appId)
			.then((result) => {
				console.log(
					'[EditAppPage] Draft initialized successfully:',
					result
				)
			})
			.catch((err) => {
				console.error('[EditAppPage] Failed to init draft:', err)
				message.error(
					'Failed to initialize draft. Check console for details.'
				)
				addError(
					'Failed to initialize draft. Check console for details.'
				)
			})
	}, [appId, addError])

	useEffect(() => {
		refreshCurrentVersion()
	}, [refreshCurrentVersion])

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
	const handleCodeChange = useCallback(
		(newCode) => {
			setCode(newCode)
			if (!currentFile || !appId) return
			clearTimeout(autoSaveTimerRef.current)
			autoSaveTimerRef.current = setTimeout(() => {
				workspaceApi
					.saveFile(appId, currentFile, newCode)
					.catch(() => {})
			}, AUTOSAVE_DEBOUNCE_MS)
		},
		[appId, currentFile, setCode]
	)

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
			addError('Failed to save file!')
		}
	}, [appId, currentFile, code, addError])

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
			const result = await workspaceApi.saveDraftSnapshot(
				appId,
				description || undefined
			)
			console.log('[EditAppPage] Snapshot saved:', result)
			message.success('Draft snapshot saved to S3')
		} catch (err) {
			console.error('[EditAppPage] Failed to save snapshot:', err)
			message.error('Failed to save draft snapshot')
			addError('Failed to save draft snapshot')
		} finally {
			hide()
			setIsSnapshotting(false)
		}
	}, [appId, addError])

	const handleDeploy = useCallback(
		async (versionNumber) => {
			if (!appId) {
				message.error('Invalid app ID, cannot deploy')
				return
			}

			const isRedeploy = versionNumber !== undefined
			let description = ''

			if (isRedeploy) {
				if (
					!window.confirm(
						`Redeploy version v${versionNumber} to Vast.ai?`
					)
				) {
					return
				}
			} else {
				description = window.prompt('Version description (optional):')
				if (description === null) return

				if (
					!window.confirm(
						'Deploy this draft as a new version and push to Vast.ai?'
					)
				) {
					return
				}
			}

			setIsDeploying(true)
			const hide = message.loading(
				isRedeploy
					? `Redeploying version v${versionNumber}...`
					: 'Deploying draft as new version...',
				0
			)
			try {
				const result = isRedeploy
					? await workspaceApi.deployVersion(appId, versionNumber)
					: await workspaceApi.deployDraft(
							appId,
							description || undefined
						)

				console.log('[EditAppPage] Deployment successful:', result)
				message.success(
					result?.version_number
						? `Deployed as version v${result.version_number}`
						: 'Deployed successfully'
				)
				refreshCurrentVersion()

				if (isRedeploy) {
					refetchTree()
					// We need to defer loadFile slightly since the backend might take a moment to clear Redis
					setTimeout(() => {
						if (currentFile) {
							loadFile(currentFile)
						}
					}, 500)
				}
			} catch (err) {
				console.error('[EditAppPage] Failed to deploy:', err)
				message.error('Failed to deploy')
				addError('Failed to deploy')
			} finally {
				hide()
				setIsDeploying(false)
			}
		},
		[
			appId,
			addError,
			currentFile,
			refetchTree,
			loadFile,
			refreshCurrentVersion,
		]
	)

	useSaveShortcut(currentFile, code, handleSaveFile)

	// Init draft workspace when entering edit page (covers: Details click + direct URL)
	useEffect(() => {
		if (!appId) return
		initDraft(appId).catch((err) => {
			console.warn('[EditAppPage] initDraft failed:', err)
		})
	}, [appId])

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
		<div className="flex flex-col h-full min-h-0 bg-gray-100 dark:bg-[#1e1e1e] overflow-hidden">
			<div className="grid grid-cols-[360px_1fr] flex-1 min-h-0 overflow-hidden">
				{/* Cột 1: Chat – flex để panel có chiều cao cố định, scroll bên trong */}
				<div className="min-w-0 min-h-0 overflow-hidden flex flex-col">
					<ChatPanel
						appId={appId}
						input={chatInput}
						onInputChange={setChatInput}
						onSendMessage={sendMessage}
						isStreaming={isStreaming}
						streamingContent={streamingContent}
						liveMessages={liveMessages}
						onDeployVersion={handleDeploy}
					/>
				</div>
				{/* Cột 2: Workspace – bấm Code hiện Tree + Editor cùng khu vực (Figma-style), bấm App chỉ hiện preview */}
				<div className="min-w-0 min-h-0 overflow-hidden flex flex-col bg-gray-50 dark:bg-[#1e1e1e]">
					{/* Một hàng: Code, App bên trái; Save, Deploy cố định ở cuối bên phải */}
					<div className="shrink-0 h-14 flex items-center justify-between gap-2 px-2 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252526]">
						<div className="flex items-center gap-2">
							{/* Segmented control – App / Code */}
							<div className="relative grid grid-cols-2 rounded-full bg-gray-100 dark:bg-[#2d2d2d] w-[178px] h-11 border border-gray-200/80 dark:border-[#404040] overflow-hidden">
								<button
									type="button"
									onClick={() => {
										setActiveMainView('app')
										setPreviewKey((k) => k + 1)
									}}
									title="App"
									className={`relative z-10 flex items-center justify-center gap-2 h-full rounded-full text-sm font-medium transition-colors duration-200 ${activeMainView === 'app' ? 'text-blue-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
								>
									<ComputerDesktopIcon className="w-4 h-4 shrink-0" />
									<span>App</span>
								</button>
								<button
									type="button"
									onClick={() => setActiveMainView('code')}
									title="Code"
									className={`relative z-10 flex items-center justify-center gap-2 h-full rounded-full text-sm font-medium transition-colors duration-200 ${activeMainView === 'code' ? 'text-blue-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
								>
									<CodeBracketSquareIcon className="w-4 h-4 shrink-0" />
									<span>Code</span>
								</button>
								{/* Sliding pill */}
								<div
									className={`absolute top-0.5 bottom-0.5 rounded-full bg-white dark:bg-[#404040] shadow-sm ring-1 ring-gray-200/60 dark:ring-[#555] transition-all duration-200 ease-out ${
										activeMainView === 'app'
											? 'left-0.5 right-[calc(50%+0.5px)]'
											: 'left-[calc(50%+0.5px)] right-0.5'
									}`}
									aria-hidden
								/>
							</div>
							{currentVersionNumber !== null && (
								<span className="ml-14 text-sm font-semibold px-3 py-1.5 rounded-full border border-green-600 dark:text-white bg-green-500/20 text-green-900">
									Current v{currentVersionNumber}
								</span>
							)}
						</div>
						<div className="flex items-center gap-2 shrink-0">
							<button
								type="button"
								onClick={() => handleDeploy()}
								disabled={isDeploying}
								className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
							>
								{isDeploying ? (
									<ArrowPathIcon className="w-4 h-4 shrink-0 animate-spin" />
								) : (
									<ArrowUpTrayIcon className="w-4 h-4 shrink-0" />
								)}
								{isDeploying ? 'Deploying...' : 'Deploy'}
							</button>
						</div>
					</div>
					{/* Khi Code: TreePanel + Editor cạnh nhau trong cùng workspace */}
					{activeMainView === 'code' && (
						<div className="flex-1 min-h-0 flex overflow-hidden">
							{/* Tree: scroll riêng bên trong TreePanel, không scroll theo layout */}
							<div className="w-[240px] shrink-0 min-h-0 flex flex-col overflow-hidden border-r border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252526]">
								<TreePanel tree={tree} onOpen={loadFile} />
							</div>
							<div className="flex-1 min-w-0 min-h-0 overflow-hidden flex flex-col">
								<CodeEditorPanel
									currentFile={currentFile}
									code={code}
									originalCode={originalCode}
									isSaving={isSaving}
									onCodeChange={handleCodeChange}
									onSave={handleSaveFile}
								/>
							</div>
						</div>
					)}
					{activeMainView === 'app' && (
						<div className="flex flex-col flex-1 min-h-0">
							<div className="shrink-0 px-3 py-2 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252526]">
								{app?.host && app?.ports?.frontend && (
									<div className="w-full flex items-center rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#444] hover:border-gray-300 dark:hover:border-[#555] hover:shadow-sm transition-all">
										<button
											type="button"
											onClick={() =>
												setPreviewKey((k) => k + 1)
											}
											className="shrink-0 ml-1 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#2f2f2f] text-gray-500 dark:text-[#888] transition-colors"
											title="Reload Preview"
										>
											<ArrowPathIcon className="w-4 h-4" />
										</button>
										<a
											href={`http://${app.host}:${app.ports.frontend}`}
											target="_blank"
											rel="noreferrer"
											className="min-w-0 flex-1 flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300"
										>
											<span className="truncate">{`http://${app.host}:${app.ports.frontend}`}</span>
										</a>
									</div>
								)}
							</div>
							<div className="flex-1 min-h-0 relative">
								{app?.host && app?.ports?.frontend ? (
									<iframe
										key={previewKey}
										title="App Preview"
										src={`http://${app.host}:${app.ports.frontend}`}
										className="absolute inset-0 w-full h-full border-0 bg-white dark:bg-[#1e1e1e]"
										sandbox="allow-scripts allow-same-origin allow-forms"
										referrerPolicy="no-referrer"
									/>
								) : (
									<div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
										{app ? (
											<>
												<ExclamationTriangleIcon className="w-10 h-10 text-yellow-500 mb-3" />
												<p className="text-gray-600 dark:text-gray-400 font-medium">
													Instance scaling or not yet
													available
												</p>
												<p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
													Please wait a moment while
													the instance starts up.
												</p>
											</>
										) : (
											<>
												<ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin mb-3" />
												<p className="text-gray-600 dark:text-gray-400">
													Fetching instance info...
												</p>
											</>
										)}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
			{/* Thanh lỗi ngang kiểu Figma – hiển thị ngang phía dưới */}
			{errors.length > 0 && (
				<div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-950/30 border-t border-red-200 dark:border-red-900/50 overflow-x-auto">
					<span className="text-xs font-medium text-red-700 dark:text-red-400 shrink-0 flex items-center gap-1">
						<ExclamationTriangleIcon className="w-4 h-4" />
						{errors.length} Errors
					</span>
					<div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto mt-5">
						{errors.map((e) => (
							<div
								key={e.id}
								className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-sm"
							>
								<span
									className="max-w-[280px] truncate"
									title={e.message}
								>
									{e.message}
								</span>
								<button
									type="button"
									onClick={() => dismissError(e.id)}
									className="p-0.5 rounded hover:bg-red-200 dark:hover:bg-red-800/60 text-red-600 dark:text-red-400"
									title="Đóng"
								>
									<XMarkIcon className="w-4 h-4" />
								</button>
							</div>
						))}
					</div>
					<button
						type="button"
						onClick={clearAllErrors}
						className="shrink-0 text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
					>
						Xóa tất cả
					</button>
				</div>
			)}
		</div>
	)
}

export default EditAppPage
