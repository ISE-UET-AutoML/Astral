import Cookies from 'universal-cookie'
import { API_BASE_URL } from 'src/constants/api'

const ADAPTIVE_URL = `${API_BASE_URL}/api/service/adaptive_model_to_app`

/**
 * Build auth headers the same way the axios interceptor does,
 * so Bearer token + x-user-id are always sent.
 */
function getAuthHeaders() {
	const cookies = new Cookies()
	const headers = { 'Content-Type': 'application/json' }
	const accessToken = cookies.get('accessToken')
	const userId = cookies.get('x-user-id')
	if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
	if (userId) headers['x-user-id'] = userId
	return headers
}

/**
 * Stream chat completions from the LLM endpoint.
 */
export async function streamChat(text, onChunk, signal) {
	const url = `${ADAPTIVE_URL}/chat/completions`

	const response = await fetch(url, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify({ text }),
		signal,
	})

	if (!response.ok) {
		throw new Error(
			`LLM request failed: ${response.status} ${response.statusText}`
		)
	}

	const reader = response.body.getReader()
	const decoder = new TextDecoder()
	let accumulated = ''
	let buffer = ''

	while (true) {
		const { done, value } = await reader.read()
		if (done) break

		buffer += decoder.decode(value, { stream: true })

		const lines = buffer.split('\n')
		buffer = lines.pop() ?? ''

		for (const line of lines) {
			const trimmed = line.trim()
			if (!trimmed || !trimmed.startsWith('data:')) continue

			const data = trimmed.slice('data:'.length).trim()
			if (data === '[DONE]') return accumulated

			try {
				const parsed = JSON.parse(data)
				if (typeof parsed.content === 'string') {
					accumulated += parsed.content
					onChunk(parsed.content)
				}
			} catch {
				// ignore malformed lines
			}
		}
	}

	return accumulated
}

/**
 * Trigger a code-modify + redeploy pipeline run for an existing app.
 *
 * Key difference from first-time gen:
 *   - skip_rent: true  → reuse the already-provisioned Vast.ai instance
 *   - instance_id: <existing>  → which instance to deploy to
 *   - requirements: <user prompt>  → what to change
 *   - skip_generate: false, skip_deploy: false  → re-gen code and redeploy
 *
 * @param {object} params
 * @param {string} params.instanceId  - Vast.ai instance_id from the existing app
 * @param {string} params.modelId     - model_id of the app
 * @param {string} params.taskType    - e.g. "image_classification"
 * @param {string} params.requirements - user's modification prompt
 * @param {string|null} params.projectId
 * @param {string|null} params.name
 * @param {object|null} params.metadata
 * @returns {Promise<{ run_id: string, status: string, message: string }>}
 */
export async function runModify({
	instanceId,
	modelId,
	taskType,
	requirements,
	projectId = null,
	name = null,
	metadata = null,
	appId = null,
}) {
	const url = `${ADAPTIVE_URL}/pipeline/run`

	const payload = {
		task: taskType || 'image_classification',
		name: name || null,
		project_id: projectId || null,
		model_id: String(modelId),
		requirements: requirements || '',
		skip_rent: true, // instance already exists
		instance_id: instanceId, // reuse this instance
		skip_deploy: false, // redeploy after code is generated
		skip_generate: false, // re-generate code with new requirements
		skip_copy: !!appId, // don't copy template over existing files
		metadata: metadata || null,
		run_id: appId || undefined, // pass existing app UUID
	}

	const response = await fetch(url, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify(payload),
	})

	if (!response.ok) {
		throw new Error(
			`runModify failed: ${response.status} ${response.statusText}`
		)
	}

	return response.json()
}

/**
 * Get the current status of a pipeline run.
 *
 * @param {string} runId
 * @returns {Promise<{ run_id: string, status: string, message: string, error?: string }>}
 */
export async function getPipelineStatus(runId) {
	const url = `${ADAPTIVE_URL}/pipeline/status/${runId}`

	const response = await fetch(url, {
		method: 'GET',
		headers: getAuthHeaders(),
	})

	if (!response.ok) {
		throw new Error(
			`getPipelineStatus failed: ${response.status} ${response.statusText}`
		)
	}

	return response.json()
}

/**
 * Fetch persisted chat messages for an app.
 *
 * @param {string} appId
 * @param {number} [limit=200]
 * @returns {Promise<{ items: Array, total: number }>}
 */
export async function getMessages(appId, limit = 200) {
	const url = `${ADAPTIVE_URL}/workspace/${appId}/messages?limit=${limit}`

	const response = await fetch(url, { headers: getAuthHeaders() })

	if (!response.ok) {
		throw new Error(`getMessages failed: ${response.status} ${response.statusText}`)
	}

	return response.json() // { items, total }
}

/**
 * Persist a single chat message.
 *
 * @param {string} appId
 * @param {{ role: string, content: string, adapt_id?: string, version_number?: number }} msg
 * @returns {Promise<object>} Saved message
 */
export async function saveMessage(appId, msg) {
	const url = `${ADAPTIVE_URL}/workspace/${appId}/messages`

	const response = await fetch(url, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify(msg),
	})

	if (!response.ok) {
		throw new Error(`saveMessage failed: ${response.status} ${response.statusText}`)
	}

	return response.json()
}

/**
 * Classify whether the message is "chat" or "modify".
 * Fast call — no reply generated.
 *
 * @param {string} appId
 * @param {string} message
 * @param {Array<{role:string, content:string}>} [history=[]]
 * @returns {Promise<{ action: "chat"|"modify" }>}
 */
export async function triageMessage(appId, message, history = []) {
	const url = `${ADAPTIVE_URL}/workspace/${appId}/triage`

	const response = await fetch(url, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify({ message, conversation_history: history }),
	})

	if (!response.ok) return { action: 'modify' }
	return response.json()
}

/**
 * Stream a conversational reply from the /chat/stream SSE endpoint.
 * Calls onToken(tokenStr) for each received chunk, resolves with full text.
 *
 * @param {string} appId
 * @param {string} message
 * @param {Array<{role:string, content:string}>} history
 * @param {(token: string) => void} onToken
 * @param {AbortSignal} [signal]
 * @returns {Promise<string>} full accumulated text
 */
export async function streamChatReply(appId, message, history = [], onToken, signal) {
	const url = `${ADAPTIVE_URL}/workspace/${appId}/chat/stream`

	const response = await fetch(url, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify({ message, conversation_history: history }),
		signal,
	})

	if (!response.ok) {
		throw new Error(`streamChatReply failed: ${response.status}`)
	}

	const reader = response.body.getReader()
	const decoder = new TextDecoder()
	let accumulated = ''
	let buffer = ''

	while (true) {
		const { done, value } = await reader.read()
		if (done) break

		buffer += decoder.decode(value, { stream: true })
		const lines = buffer.split('\n')
		buffer = lines.pop() ?? ''

		for (const line of lines) {
			const trimmed = line.trim()
			if (!trimmed.startsWith('data:')) continue
			const data = trimmed.slice('data:'.length).trim()
			if (data === '[DONE]') return accumulated
			try {
				const { content } = JSON.parse(data)
				if (typeof content === 'string') {
					accumulated += content
					onToken(content)
				}
			} catch {
				// skip malformed lines
			}
		}
	}

	return accumulated
}


