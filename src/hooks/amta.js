import { useState, useCallback, useRef } from 'react'
import { streamChat } from 'src/api/amta'

const DUMP_APP_MESSAGES = {
    total: 4,
    items: [
        {
            id: '55555555-5555-5555-5555-555555555555',
            app_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            role: 'user',
            content: 'The image upload preview is broken on mobile screens, and the prediction confidence scores aren\'t showing up after the model finishes running.',
            adapt_id: '',
            version_number: 4,
            created_at: '2026-02-28T09:00:00.000Z',
        },
        {
            id: '66666666-6666-6666-6666-666666666666',
            app_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            role: 'assistant',
            content: "I see the issue. The CSS Grid in `ImageUploader.tsx` was overflowing on smaller screens, and the state mapping for the model's output array was misaligned. I'll fix the responsive layout and ensure the results render properly.\n\nDone! The Animal Classifier app is now updated with:\n\n✅ Responsive image preview that scales perfectly on mobile and desktop.\n✅ A new `PredictionResults` component that clearly displays the Top-3 confidence scores with progress bars.\n✅ Camera capture support directly from mobile browsers.\n✅ Error handling for unsupported formats (non-JPEG/PNG) or images that are too large.\n✅ Mapped dictionary for over 100+ animal classes (e.g., returning 'Golden Retriever' instead of just a class ID).\n\nThe app is ready to use. You can upload a photo of an animal, and the results will display correctly formatted.",
            adapt_id: 'adapt-run-1',
            version_number: 4,
            version_summary: [
                'Fixed image preview on mobile',
                'Added Top-3 prediction scores with progress bars',
                'Camera capture support on mobile',
                'Error handling for invalid formats and oversized images',
                'Display animal names instead of class IDs',
            ],
            created_at: '2026-02-28T09:02:45.000Z',
        },
        {
            id: '77777777-7777-7777-7777-777777777777',
            app_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            role: 'user',
            content: 'Looks great. Now, please add a loading spinner while the ONNX inference is running, and modify the upload component to support batch uploads (multiple images at once).',
            adapt_id: 'adapt-run-2',
            version_number: 5,
            created_at: '2026-02-28T09:15:00.000Z',
        },
        {
            id: '88888888-8888-8888-8888-888888888888',
            app_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            role: 'assistant',
            content: "I've implemented a global loading overlay with a custom spinner that activates during the model's inference phase so the UI doesn't freeze. For batch uploads, I updated the input attribute to `multiple` and created a `ResultsGrid` component. The app now queues the images, processes them via the classification model asynchronously, and displays a gallery of predictions side-by-side.",
            adapt_id: 'adapt-run-2',
            version_number: 5,
            version_summary: [
                'Loading spinner while processing images',
                'Batch upload (multiple images at once)',
                'Results displayed in a grid per image',
            ],
            created_at: '2026-02-28T09:18:20.000Z',
        },
    ],
}

/**
 * Returns the static hard-coded message list (version history, etc.).
 * Replace with a real API call when the backend is ready.
 *
 * @param {string} appId
 * @returns {{ total: number, items: Array }}
 */
export const useAmtaMessages = (appId) => {
	void appId
	return DUMP_APP_MESSAGES
}

// ---------------------------------------------------------------------------
// LLM streaming chat hook
// ---------------------------------------------------------------------------

export const useAmtaChat = () => {
	const [chatInput, setChatInput] = useState('')
	const [isStreaming, setIsStreaming] = useState(false)
	const [streamingContent, setStreamingContent] = useState('')
	const [liveMessages, setLiveMessages] = useState([])
	const abortRef = useRef(null)

	const sendMessage = useCallback(async () => {
		const text = chatInput.trim()
		if (!text || isStreaming) return

		// Add user message immediately
		const userMsg = { role: 'user', content: text, id: `user-${Date.now()}`, created_at: new Date().toISOString() }
		setLiveMessages((prev) => [...prev, userMsg])
		setChatInput('')
		setIsStreaming(true)
		setStreamingContent('')

		// Cancel any previous in-flight request
		if (abortRef.current) abortRef.current.abort()
		const controller = new AbortController()
		abortRef.current = controller

		try {
			let accumulated = ''
			await streamChat(
				text,
				(chunk) => {
					accumulated += chunk
					setStreamingContent(accumulated)
				},
				controller.signal
			)

			// Commit the completed assistant message
			const assistantMsg = {
				role: 'assistant',
				content: accumulated,
				id: `assistant-${Date.now()}`,
				created_at: new Date().toISOString(),
			}
			setLiveMessages((prev) => [...prev, assistantMsg])
		} catch (err) {
			if (err.name !== 'AbortError') {
				console.error('[useAmtaChat] stream error:', err)
				const errMsg = {
					role: 'assistant',
					content: `❌ Error: ${err.message}`,
					id: `err-${Date.now()}`,
					created_at: new Date().toISOString(),
				}
				setLiveMessages((prev) => [...prev, errMsg])
			}
		} finally {
			setIsStreaming(false)
			setStreamingContent('')
			abortRef.current = null
		}
	}, [chatInput, isStreaming])

	return {
		chatInput,
		setChatInput,
		isStreaming,
		streamingContent,
		liveMessages,
		sendMessage,
	}
}

export default useAmtaMessages
