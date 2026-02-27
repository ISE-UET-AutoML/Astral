import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { workspaceApi, initDraft } from 'src/api/workspace'
import {
	ChatPanel,
	TreePanel,
	CodeEditorPanel,
} from 'src/components/CodeEditor'
import { useFileTree, useFileEditor, useSaveShortcut, useAmtaChat } from 'src/hooks'
import { Button } from 'src/components/ui/button'
import CodeEditorLayout from 'src/layouts/CodeEditorLayout'

const AUTOSAVE_DEBOUNCE_MS = 1500

const EditAppPage = () => {
	const { appId, id: projectId } = useParams()
	const navigate = useNavigate()
	const [currentFile, setCurrentFile] = useState('')
	const [originalCode, setOriginalCode] = useState('')
	const [isAdapting, setIsAdapting] = useState(false)

	const {
		chatInput,
		setChatInput,
		isStreaming,
		streamingContent,
		liveMessages,
		sendMessage: sendChatMessage,
	} = useAmtaChat()

	const { tree, refetch: refetchTree } = useFileTree(appId)
	const { code, setCode, isSaving } = useFileEditor(appId, currentFile, originalCode)
	const hasAutoLoadedRef = useRef(false)
	const autoSaveTimerRef = useRef(null)
	// Track latest code/file for beforeunload (avoid stale closure)
	const latestRef = useRef({ code, currentFile, appId })
	useEffect(() => {
		latestRef.current = { code, currentFile, appId }
	}, [code, currentFile, appId])

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

	// Deploy: create NEW version (latest + 1) from draft and deploy via draft/deploy
	const [isDeploying, setIsDeploying] = useState(false)
	const handleDeploy = useCallback(async () => {
		if (!appId || isDeploying) return
		setIsDeploying(true)
		try {
			// Pass current file if unsaved so it's included in deploy
			const files = currentFile && code !== originalCode
				? { [currentFile]: code }
				: {}
			const result = await workspaceApi.deployDraft(appId, files)
			message.success(`Deploying version ${result?.version_number ?? '?'}...`)
		} catch (error) {
			console.error('Deploy failed:', error)
			message.error(error?.response?.data?.detail || 'Deploy failed!')
		} finally {
			setIsDeploying(false)
		}
	}, [appId, isDeploying, currentFile, code, originalCode])

	// Git snapshot khi rời trang
	useEffect(() => {
		const handleBeforeUnload = () => {
			const { code: c, currentFile: f, appId: id } = latestRef.current
			if (!f || !id) return
			// save Redis sync (best-effort, navigator.sendBeacon không support PUT nên dùng fetch keepalive)
			fetch(`/api/service/adaptive_model_to_app/apps/${id}/draft/save`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ description: 'Auto-save on exit' }),
				keepalive: true,
			}).catch(() => {})
		}
		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [])

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
		<CodeEditorLayout
			isAdapting={isAdapting || isStreaming}
			chatSlot={
				<ChatPanel
					appId={appId}
					input={chatInput}
					onInputChange={setChatInput}
					onSendMessage={sendChatMessage}
					isStreaming={isStreaming}
					streamingContent={streamingContent}
					liveMessages={liveMessages}
				/>
			}
			treeSlot={<TreePanel tree={tree} onOpen={loadFile} />}
			editorSlot={
				<CodeEditorPanel
					currentFile={currentFile}
					code={code}
					originalCode={originalCode}
					isSaving={isSaving}
					isDeploying={isDeploying}
					onCodeChange={handleCodeChange}
					onSave={handleSaveFile}
					onDeploy={handleDeploy}
				/>
			}
		/>
	)
}

export default EditAppPage
