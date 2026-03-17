import { useMemo, useEffect, useRef } from 'react'
import { Bot } from 'lucide-react'
import { useAmtaMessages } from 'src/hooks'

const RevertIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 20"
		fill="currentColor"
		className="w-4 h-4"
	>
		<path
			fillRule="evenodd"
			d="M7.793 2.232a.75.75 0 0 1-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 0 1 0 10.75H10.75a.75.75 0 0 1 0-1.5h2.875a3.875 3.875 0 0 0 0-7.75H3.622l4.146 3.957a.75.75 0 0 1-1.036 1.085l-5.5-5.25a.75.75 0 0 1 0-1.085l5.5-5.25a.75.75 0 0 1 1.06.025Z"
			clipRule="evenodd"
		/>
	</svg>
)

const Cursor = () => (
	<span className="inline-block w-0.5 h-4 bg-current align-middle ml-0.5 animate-pulse" />
)

// ---------------------------------------------------------------------------
// Version card — displayed for assistant messages that have a version_number.
// The message `content` is used as the changelog text.
// ---------------------------------------------------------------------------
const VersionCard = ({ msg, isOldVersion, onDeployVersion }) => (
	<div className="mx-0 rounded-2xl border border-blue-200 dark:border-blue-700/50 bg-blue-50/50 dark:bg-blue-900/10 overflow-hidden">
		{/* Header */}
		<div className="flex items-center justify-between px-4 py-3 border-b border-blue-200 dark:border-blue-700/40">
			<div className="flex items-center gap-2">
				<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold shrink-0">
					v{msg.version_number}
				</span>
				<span className="text-sm font-semibold text-blue-900 dark:text-blue-200">
					Version {msg.version_number}
				</span>
			</div>
			<div className="flex items-center gap-2">
				{msg.created_at && (
					<span className="text-[11px] text-blue-600/70 dark:text-blue-400/60">
						{new Date(msg.created_at).toLocaleString()}
					</span>
				)}
				{isOldVersion && onDeployVersion && (
					<button
						type="button"
						onClick={() => onDeployVersion(msg.version_number)}
						title={`Revert to Version ${msg.version_number}`}
						className="p-1.5 rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-800/40 transition-colors"
					>
						<RevertIcon />
					</button>
				)}
			</div>
		</div>

		{/* Changelog */}
		<div className="px-4 py-3">
			<span className="text-[10px] font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400">
				Changelog
			</span>
			<p className="mt-1.5 text-sm leading-relaxed text-gray-700 dark:text-[#bbb] whitespace-pre-wrap">
				{msg.content}
			</p>
		</div>
	</div>
)

// ---------------------------------------------------------------------------
// Regular chat bubble
// ---------------------------------------------------------------------------
const ChatBubble = ({ msg, streaming }) => {
	const isAssistant = msg.role === 'assistant'

	return (
		<div
			className={`relative rounded-2xl border shadow-sm transition-colors ${
				isAssistant
					? 'bg-gray-50 dark:bg-[#252526] text-gray-900 dark:text-[#cccccc] border-gray-200 dark:border-[#444]'
					: 'bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-[#cccccc] border-gray-200 dark:border-[#444]'
			}`}
		>
			<div className="flex items-start gap-3 px-4 pt-4 pb-4">
				<div className="flex-1 min-w-0">
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
					</div>
					<div className="mt-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
						{msg.content}
						{streaming && <Cursor />}
					</div>
				</div>
			</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// MessageCard — routes to VersionCard or ChatBubble based on version_number
// ---------------------------------------------------------------------------
const MessageCard = ({ msg, isOldVersion, streaming, onDeployVersion }) => {
	if (msg.role === 'assistant' && msg.version_number && !streaming) {
		return <VersionCard msg={msg} isOldVersion={isOldVersion} onDeployVersion={onDeployVersion} />
	}
	return <ChatBubble msg={msg} streaming={streaming} />
}

// ---------------------------------------------------------------------------
// MessagesPanel
// ---------------------------------------------------------------------------
const MessagesPanel = ({
	appId,
	liveMessages = [],
	streamingContent = '',
	isStreaming = false,
	onDeployVersion,
}) => {
	const { items, loading } = useAmtaMessages(appId)
	const scrollContainerRef = useRef(null)

	const sortedHistory = useMemo(
		() =>
			[...(items || [])].sort(
				(a, b) =>
					new Date(a.created_at).getTime() -
					new Date(b.created_at).getTime()
			),
		[items]
	)

	const lastVersionNumber = useMemo(() => {
		for (let i = sortedHistory.length - 1; i >= 0; i--) {
			if (sortedHistory[i].version_number)
				return sortedHistory[i].version_number
		}
		return null
	}, [sortedHistory])

	const totalCount =
		sortedHistory.length + liveMessages.length + (isStreaming ? 1 : 0)

	// Auto-scroll to bottom whenever content changes
	useEffect(() => {
		const el = scrollContainerRef.current
		if (!el) return
		el.scrollTop = el.scrollHeight
	}, [liveMessages.length, streamingContent, items?.length])

	return (
		<div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-gray-50 dark:bg-[#1e1e1e] [&_::-webkit-scrollbar]:w-1.5 [&_::-webkit-scrollbar-track]:bg-transparent [&_::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&_::-webkit-scrollbar-thumb]:bg-[#555] [&_::-webkit-scrollbar-thumb]:rounded-full">
			{/* Scrollable content */}
			<div
				ref={scrollContainerRef}
				className="flex-1 min-h-0 overflow-auto p-4 space-y-4"
			>
				{loading && (
					<div className="flex justify-center py-4">
						<span className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full" />
					</div>
				)}

				{/* DB-persisted messages */}
				{sortedHistory.map((msg) => {
					const isOldVersion =
						msg.role === 'assistant' &&
						msg.version_number &&
						lastVersionNumber &&
						msg.version_number < lastVersionNumber
					return (
						<MessageCard
							key={msg.id}
							msg={msg}
							isOldVersion={isOldVersion}
							onDeployVersion={onDeployVersion}
						/>
					)
				})}

				{/* Optimistic live messages from this session */}
				{liveMessages.map((msg) => (
					<MessageCard key={msg.id} msg={msg} onDeployVersion={onDeployVersion} />
				))}

				{/* Streaming bubble */}
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

				{sortedHistory.length === 0 &&
					liveMessages.length === 0 &&
					!isStreaming &&
					!loading && (
						<div className="text-xs text-gray-500 dark:text-[#888] text-center py-8">
							No messages yet. Send a message to get started.
						</div>
					)}
			</div>
		</div>
	)
}

export default MessagesPanel
