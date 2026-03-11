import { useMemo, useEffect, useRef } from 'react'
import { Bot } from 'lucide-react'
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

	return (
		<div
			className={`relative rounded-2xl border shadow-sm transition-colors ${isAssistant
					? 'bg-gray-50 dark:bg-[#252526] text-gray-900 dark:text-[#cccccc] border-gray-200 dark:border-[#444]'
					: 'bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-[#cccccc] border-gray-200 dark:border-[#444]'
				}`}
		>
			<div className="flex items-start gap-3 px-4 pt-4 pb-4">
				<div className="flex-1">
					<div className="flex items-center justify-between gap-3">
						<span className="flex items-center gap-2 text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-[#888]">
							{isAssistant && (
								<span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 shrink-0">
									<Bot className="w-6 h-6 text-blue-500 dark:text-blue-400" />
								</span>
							)}
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
			</div>

			{/* Version box – inside agent card (hard-coded history only) */}
			{isAssistant && msg.version_number && (
				<div className="mx-4 my-3 rounded-xl border border-gray-200 dark:border-[#444] bg-white dark:bg-[#2d2d2d] px-4 py-3">
					<div className="flex items-start justify-between gap-3">
						<div className="flex flex-col gap-1.5 min-w-0 flex-1">
							<span className="text-sm font-medium text-gray-900 dark:text-[#cccccc]">
								Version {msg.version_number}
							</span>
							{msg.adapt_id && (
								<span className="text-[11px] text-gray-500 dark:text-[#888]">
									{msg.adapt_id}
								</span>
							)}
							{/* Summary of changes – like Git commit, for non-tech users */}
							{msg.version_summary && Array.isArray(msg.version_summary) && msg.version_summary.length > 0 && (
								<div className="mt-2 pt-2 border-t border-gray-100 dark:border-[#444]">
									<span className="text-[11px] font-medium text-gray-500 dark:text-[#888] uppercase tracking-wide">
										Changes
									</span>
									<ul className="mt-1.5 space-y-1 text-[13px] text-gray-700 dark:text-[#aaa]">
										{msg.version_summary.map((item, i) => (
											<li key={i} className="flex items-start gap-2">
												<span className="text-gray-400 dark:text-[#666] mt-0.5">•</span>
												<span>{item}</span>
											</li>
										))}
									</ul>
								</div>
							)}
							{msg.version_summary && typeof msg.version_summary === 'string' && (
								<p className="mt-2 pt-2 border-t border-gray-100 dark:border-[#444] text-[13px] text-gray-700 dark:text-[#aaa]">
									{msg.version_summary}
								</p>
							)}
						</div>
						{isOldVersion && (
							<button
								type="button"
								title={`Revert to Version ${msg.version_number}`}
								className="shrink-0 p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-[#888] dark:hover:text-white dark:hover:bg-[#3c3c3c] transition-colors"
							>
								<RevertIcon />
							</button>
						)}
					</div>
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

	const scrollContainerRef = useRef(null)

	// Auto-scroll to bottom whenever content changes – scroll only the Messages panel,
	// not the parent page (scrollIntoView can scroll ancestor containers and cause top to be clipped)
	useEffect(() => {
		const el = scrollContainerRef.current
		if (!el) return
		el.scrollTop = el.scrollHeight
	}, [liveMessages.length, streamingContent])

	return (
		<div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-gray-50 dark:bg-[#1e1e1e] [&_::-webkit-scrollbar]:w-1.5 [&_::-webkit-scrollbar-track]:bg-transparent [&_::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&_::-webkit-scrollbar-thumb]:bg-[#555] [&_::-webkit-scrollbar-thumb]:rounded-full">
			<div className="shrink-0 px-4 py-3 border-b border-gray-200 dark:border-[#333] flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-gray-900 dark:text-[#cccccc]">
						Messages
					</span>
					
				</div>
			</div>

			<div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-auto p-4 space-y-4">
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
