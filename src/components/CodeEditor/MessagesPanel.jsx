import { useMemo } from 'react'
import { useAmtaMessages } from 'src/hooks'

const RevertIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
		<path fillRule="evenodd" d="M7.793 2.232a.75.75 0 0 1-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 0 1 0 10.75H10.75a.75.75 0 0 1 0-1.5h2.875a3.875 3.875 0 0 0 0-7.75H3.622l4.146 3.957a.75.75 0 0 1-1.036 1.085l-5.5-5.25a.75.75 0 0 1 0-1.085l5.5-5.25a.75.75 0 0 1 1.06.025Z" clipRule="evenodd" />
	</svg>
)

/**
 * Messages panel – renders chat history from the App messages API.
 * Agent messages include a version box inside the card.
 * Old versions (not the latest) show a revert button.
 *
 * @param {{ appId?: string }} props
 */
const MessagesPanel = ({ appId }) => {
	const { items } = useAmtaMessages(appId)

	const sortedItems = useMemo(
		() =>
			[...(items || [])].sort(
				(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
			),
		[items]
	)

	const lastVersionNumber = useMemo(() => {
		for (let i = sortedItems.length - 1; i >= 0; i--) {
			if (sortedItems[i].version_number) return sortedItems[i].version_number
		}
		return null
	}, [sortedItems])

	return (
		<div className="flex flex-col h-full min-h-0 bg-white dark:bg-[#1e1e1e] overflow-hidden [&_::-webkit-scrollbar]:w-1.5 [&_::-webkit-scrollbar-track]:bg-transparent [&_::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&_::-webkit-scrollbar-thumb]:bg-[#555] [&_::-webkit-scrollbar-thumb]:rounded-full">
			<div className="shrink-0 px-4 py-3 border-b border-gray-200 dark:border-[#333] flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-gray-900 dark:text-[#cccccc]">
						Messages
					</span>
					<span className="text-xs text-gray-500 dark:text-[#888]">
						{sortedItems.length} messages
					</span>
				</div>
			</div>

			<div className="flex-1 min-h-0 overflow-auto p-4 space-y-4">
				{sortedItems.map((msg) => {
					const isAssistant = msg.role === 'assistant'
					const initials = isAssistant ? 'H' : 'U'
					const isOldVersion =
						isAssistant &&
						msg.version_number &&
						lastVersionNumber &&
						msg.version_number < lastVersionNumber

					return (
						<div
							key={msg.id}
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
										{msg.created_at && (
											<span className="text-[11px] text-gray-500 dark:text-[#888]">
												{new Date(msg.created_at).toLocaleString()}
											</span>
										)}
									</div>
									<div className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
										{msg.content}
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

							{/* Version box – inside agent card, all versions */}
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
				})}

				{sortedItems.length === 0 && (
					<div className="text-xs text-gray-500 dark:text-[#888] text-center py-8">
						No messages yet. Run an adaptation to see history here.
					</div>
				)}
			</div>
		</div>
	)
}

export default MessagesPanel
