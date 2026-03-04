import Cookies from 'universal-cookie'

const ADAPTIVE_URL = 'http://localhost:4005/api/service/adaptive_model_to_app'

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
 *
 * POST {ADAPTIVE_URL}/chat/completions
 * Body: { "text": "<user message>" }
 *
 * Server sends SSE lines:
 *   data: {"content": "X"}
 *   data: [DONE]
 *
 * @param {string} text                      - User message to send
 * @param {(chunk: string) => void} onChunk  - Called for each content chunk
 * @param {AbortSignal} [signal]             - Optional AbortController signal
 * @returns {Promise<string>}                - Resolves with full accumulated response
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
		throw new Error(`LLM request failed: ${response.status} ${response.statusText}`)
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
