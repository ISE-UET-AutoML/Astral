import { useState, useEffect, useCallback, useRef } from 'react'
import {
	runModify,
	getPipelineStatus,
	getMessages,
	saveMessage,
	triageMessage,
	streamChatReply,
} from 'src/api/amta'

// ---------------------------------------------------------------------------
// Real messages hook — fetches from GET /workspace/{appId}/messages
// ---------------------------------------------------------------------------

export const useAmtaMessages = (appId) => {
	const [items, setItems] = useState([])
	const [total, setTotal] = useState(0)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const fetchMessages = useCallback(async () => {
		if (!appId) {
			setItems([])
			setTotal(0)
			return
		}
		setLoading(true)
		setError(null)
		try {
			const data = await getMessages(appId)
			setItems(data.items ?? [])
			setTotal(data.total ?? 0)
		} catch (err) {
			setError(err)
		} finally {
			setLoading(false)
		}
	}, [appId])

	useEffect(() => {
		fetchMessages()
	}, [fetchMessages])

	return { items, total, loading, error, refetch: fetchMessages }
}

// ---------------------------------------------------------------------------
// Modify & redeploy hook — with Gemini triage + streaming chat guardrail
// ---------------------------------------------------------------------------

const POLL_INTERVAL_MS = 3000
const POLL_TIMEOUT_MS = 15 * 60 * 1000

/**
 * Hook for chat-driven code modification and redeployment.
 *
 * Flow:
 *   1. User sends message
 *   2. /triage → fast classify: "chat" | "modify"
 *   3a. "chat"   → call /chat/stream, stream tokens into assistant bubble
 *   3b. "modify" → call /pipeline/run, poll, show result
 */
export function useAmtaModify({
	appId,
	instanceId,
	modelId,
	taskType,
	metadata,
	projectId,
	name,
	onSuccess,
}) {
	const [chatInput, setChatInput] = useState('')
	const [isRunning, setIsRunning] = useState(false)
	const [runStatus, setRunStatus] = useState(null)
	const [currentRunId, setCurrentRunId] = useState(null)
	const [liveMessages, setLiveMessages] = useState([])
	const abortRef = useRef(false)

	const sendMessage = useCallback(async () => {
		const text = chatInput.trim()
		if (!text || isRunning) return

		// 1. Optimistic user bubble
		const userMsg = {
			role: 'user',
			content: text,
			id: `user-${Date.now()}`,
			created_at: new Date().toISOString(),
		}
		setLiveMessages((prev) => [...prev, userMsg])
		setChatInput('')
		setIsRunning(true)
		setRunStatus('pending')
		abortRef.current = false

		// Persist user message
		if (appId) {
			saveMessage(appId, { role: 'user', content: text }).catch((e) =>
				console.warn('[useAmtaModify] save user msg failed:', e)
			)
		}

		// 2. Build history context (last 6 turns before this message)
		const recentHistory = [...liveMessages, userMsg]
			.slice(-7, -1)
			.map(({ role, content }) => ({ role, content }))

		// 3. Triage — fast classify
		let triageResult = { action: 'modify' }
		if (appId) {
			try {
				triageResult = await triageMessage(appId, text, recentHistory)
			} catch (e) {
				console.warn(
					'[useAmtaModify] triage failed, defaulting to modify:',
					e
				)
			}
		}

		// 4a. CHAT — stream reply token-by-token
		if (triageResult.action === 'chat') {
			const placeholderId = `chat-${Date.now()}`
			setLiveMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content: '',
					id: placeholderId,
					created_at: new Date().toISOString(),
				},
			])

			let fullReply = ''
			try {
				fullReply = await streamChatReply(
					appId,
					text,
					recentHistory,
					(token) => {
						// Incrementally append each token to the bubble
						setLiveMessages((prev) =>
							prev.map((m) =>
								m.id === placeholderId
									? { ...m, content: m.content + token }
									: m
							)
						)
					}
				)
			} catch (e) {
				console.warn('[useAmtaModify] streamChatReply error:', e)
				fullReply = '(Error generating reply)'
				setLiveMessages((prev) =>
					prev.map((m) =>
						m.id === placeholderId
							? { ...m, content: fullReply }
							: m
					)
				)
			}

			setIsRunning(false)
			setRunStatus('chat')

			// Persist assistant reply
			if (appId && fullReply) {
				saveMessage(appId, {
					role: 'assistant',
					content: fullReply,
				}).catch((e) =>
					console.warn('[useAmtaModify] save chat reply failed:', e)
				)
			}
			return
		}

		// 4b. MODIFY — check instance, run pipeline
		if (!instanceId) {
			setLiveMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content:
						'❌ Cannot modify: this app has no deployed instance yet. Please generate the app first.',
					id: `err-${Date.now()}`,
					created_at: new Date().toISOString(),
				},
			])
			setIsRunning(false)
			setRunStatus('failed')
			return
		}

		const placeholderId = `assistant-${Date.now()}`
		setLiveMessages((prev) => [
			...prev,
			{
				role: 'assistant',
				content: '⏳ Modifying and redeploying your app…',
				id: placeholderId,
				created_at: new Date().toISOString(),
				isPlaceholder: true,
			},
		])

		try {
			const { run_id } = await runModify({
				instanceId,
				modelId,
				taskType,
				requirements: text,
				projectId,
				name,
				metadata,
				appId,
			})

			setCurrentRunId(run_id)
			setRunStatus('running')

			const deadline = Date.now() + POLL_TIMEOUT_MS
			let finalStatus = null

			while (!abortRef.current && Date.now() < deadline) {
				await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
				if (abortRef.current) break
				const statusData = await getPipelineStatus(run_id)
				setRunStatus(statusData.status)
				if (
					statusData.status === 'completed' ||
					statusData.status === 'failed'
				) {
					finalStatus = statusData
					break
				}
			}

			const isSuccess = finalStatus?.status === 'completed'
			const versionNumber = finalStatus?.result?.version_number
			const finalContent = isSuccess
				? `✅ Done! Your app has been updated to Version ${versionNumber || '?'} and redeployed.\n\n_Run ID: ${run_id}_`
				: `❌ Modification failed: ${finalStatus?.error ?? 'Unknown error'}\n\n_Run ID: ${run_id}_`

			setLiveMessages((prev) =>
				prev.map((m) =>
					m.id === placeholderId
						? {
								...m,
								content: finalContent,
								isPlaceholder: false,
								version_number: versionNumber,
							}
						: m
				)
			)
			setRunStatus(finalStatus?.status ?? 'failed')

			if (appId) {
				const messageToSave = {
					role: 'assistant',
					content: finalContent,
					adapt_id: run_id,
				}
				if (isSuccess && versionNumber) {
					messageToSave.version_number = versionNumber
				}
				saveMessage(appId, messageToSave).catch((e) =>
					console.warn(
						'[useAmtaModify] save assistant msg failed:',
						e
					)
				)
			}

			if (isSuccess && typeof onSuccess === 'function') {
				onSuccess()
			}
		} catch (err) {
			console.error('[useAmtaModify] pipeline error:', err)
			const errContent = `❌ Error: ${err.message}`
			setLiveMessages((prev) =>
				prev.map((m) =>
					m.id === placeholderId
						? { ...m, content: errContent, isPlaceholder: false }
						: m
				)
			)
			setRunStatus('failed')
		} finally {
			setIsRunning(false)
		}
	}, [
		chatInput,
		isRunning,
		liveMessages,
		appId,
		instanceId,
		modelId,
		taskType,
		metadata,
		projectId,
		name,
		onSuccess,
	])

	const cancelRun = useCallback(() => {
		abortRef.current = true
		setIsRunning(false)
	}, [])

	return {
		chatInput,
		setChatInput,
		isRunning,
		get isStreaming() {
			return isRunning
		},
		runStatus,
		currentRunId,
		liveMessages,
		sendMessage,
		cancelRun,
	}
}

/** @deprecated Use useAmtaModify */
export const useAmtaChat = useAmtaModify

export default useAmtaMessages
