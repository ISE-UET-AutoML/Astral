import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { workspaceApi } from 'src/api/workspace'
import {
	ChatPanel,
	TreePanel,
	CodeEditorPanel,
} from 'src/components/CodeEditor'
import { useFileTree, useFileEditor, useSaveShortcut, useAmtaChat } from 'src/hooks'
import { Button } from 'src/components/ui/button'
import CodeEditorLayout from 'src/layouts/CodeEditorLayout'

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
					onCodeChange={setCode}
					onSave={handleSaveFile}
				/>
			}
		/>
	)
}

export default EditAppPage
