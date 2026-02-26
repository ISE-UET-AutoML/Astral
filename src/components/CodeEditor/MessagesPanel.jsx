import { useMemo, useEffect, useRef } from 'react'
import { useAmtaMessages } from 'src/hooks'

const RevertIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
		<path fillRule="evenodd" d="M7.793 2.232a.75.75 0 0 1-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 0 1 0 10.75H10.75a.75.75 0 0 1 0-1.5h2.875a3.875 3.875 0 0 0 0-7.75H3.622l4.146 3.957a.75.75 0 0 1-1.036 1.085l-5.5-5.25a.75.75 0 0 1 0-1.085l5.5-5.25a.75.75 0 0 1 1.06.025Z" clipRule="evenodd" />
	</svg>
)

const Cursor = () => (
	<span className="inline-block w-0.5 h-4 bg-current align-middle ml-0.5 animate-pulse" />
)

/**
 * A single message card.
 * @param {{ msg: object, isOldVersion?: boolean, streaming?: boolean }} props
 */
const MessageCard = ({ msg, isOldVersion, streaming }) => {
	const isAssistant = msg.role === 'assistant'
	const initials = isAssistant ? 'H' : 'U'

	return (
		<div
			className={`relative rounded-2xl border shadow-sm transition-colors ${
				isAssistant
					? 'bg-gray-50 dark:bg-[#252526] text-gray-900 dark:text-[#cccccc] border-gray-200 dark:border-[#444]'
					: 'bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-[#cccccc] border-gray-200 dark:border-[#444]'
			}`}
		>
			<div className="flex items-start gap-3 px-4 pt-4">
				<div className="flex-1">
					<div className="flex items-center justify-between gap-3">
						<span className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-[#888]">
							{isAssistant ? 'Agent' : 'User'}
						</span>
						{msg.created_at && !streaming && (
							<span className="text-[11px] text-gray-500 dark:text-[#888]">
								{new Date(msg.created_at).toLocaleString()}
							</span>
						)}
						{streaming && (
							<span className="text-[11px] text-gray-400 dark:text-[#666] animate-pulse">
								typing...
							</span>
						)}
					</div>
					<div className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
						{msg.content}
						{streaming && <Cursor />}
					</div>
				</div>
				<div
					className={`shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
						isAssistant
							? 'bg-pink-500 text-white'
							: 'bg-gray-200 text-gray-800 dark:bg-[#555] dark:text-[#cccccc]'
					}`}
				>
					{initials}
				</div>
			</div>

			{/* Version box – inside agent card (hard-coded history only) */}
			{isAssistant && msg.version_number && (
				<div className="mx-4 my-3 flex items-center justify-between rounded-xl border border-gray-200 dark:border-[#444] bg-white dark:bg-[#2d2d2d] px-4 py-3">
					<div className="flex flex-col gap-0.5">
						<span className="text-sm font-medium text-gray-900 dark:text-[#cccccc]">
							Version {msg.version_number}
						</span>
						{msg.adapt_id && (
							<span className="text-[11px] text-gray-500 dark:text-[#888]">
								{msg.adapt_id}
							</span>
						)}
					</div>
					{isOldVersion && (
						<button
							type="button"
							title={`Revert to Version ${msg.version_number}`}
							className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-[#888] dark:hover:text-white dark:hover:bg-[#3c3c3c] transition-colors"
						>
							<RevertIcon />
						</button>
					)}
				</div>
			)}
		</div>
	)
}

/**
 * Messages panel – renders:
 *   1. Hard-coded version history (dump data, with version boxes)
 *   2. Live in-memory conversation from LLM streaming (no version boxes)
 *   3. A streaming bubble while the LLM is replying
 *
 * @param {{
 *   appId?: string,
 *   liveMessages?: Array,
 *   streamingContent?: string,
 *   isStreaming?: boolean
 * }} props
 */
const MessagesPanel = ({ appId, liveMessages = [], streamingContent = '', isStreaming = false }) => {
	const { items } = useAmtaMessages(appId)
	const bottomRef = useRef(null)

	const sortedHistory = useMemo(
		() =>
			[...(items || [])].sort(
				(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
			),
		[items]
	)

	const lastVersionNumber = useMemo(() => {
		for (let i = sortedHistory.length - 1; i >= 0; i--) {
			if (sortedHistory[i].version_number) return sortedHistory[i].version_number
		}
		return null
	}, [sortedHistory])

	const totalCount = sortedHistory.length + liveMessages.length + (isStreaming ? 1 : 0)

	// Auto-scroll to bottom whenever content changes
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [liveMessages.length, streamingContent])

	return (
		<div className="flex flex-col h-full min-h-0 bg-white dark:bg-[#1e1e1e] overflow-hidden [&_::-webkit-scrollbar]:w-1.5 [&_::-webkit-scrollbar-track]:bg-transparent [&_::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&_::-webkit-scrollbar-thumb]:bg-[#555] [&_::-webkit-scrollbar-thumb]:rounded-full">
			<div className="shrink-0 px-4 py-3 border-b border-gray-200 dark:border-[#333] flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-gray-900 dark:text-[#cccccc]">
						Messages
					</span>
					<span className="text-xs text-gray-500 dark:text-[#888]">
						{totalCount} messages
					</span>
				</div>
			</div>

			<div className="flex-1 min-h-0 overflow-auto p-4 space-y-4">
				{/* Hard-coded version history */}
				{sortedHistory.map((msg) => {
					const isOldVersion =
						msg.role === 'assistant' &&
						msg.version_number &&
						lastVersionNumber &&
						msg.version_number < lastVersionNumber
					return <MessageCard key={msg.id} msg={msg} isOldVersion={isOldVersion} />
				})}

				{/* Live in-memory messages from this session */}
				{liveMessages.map((msg) => (
					<MessageCard key={msg.id} msg={msg} />
				))}

				{/* Streaming bubble – shown while LLM is responding */}
				{isStreaming && (
					<MessageCard
						msg={{
							id: '__streaming__',
							role: 'assistant',
							content: streamingContent,
							created_at: null,
						}}
						streaming
					/>
				)}

				{sortedHistory.length === 0 && liveMessages.length === 0 && !isStreaming && (
					<div className="text-xs text-gray-500 dark:text-[#888] text-center py-8">
						No messages yet. Send a message to get started.
					</div>
				)}

				<div ref={bottomRef} />
			</div>
		</div>
	)
}

export default MessagesPanel
