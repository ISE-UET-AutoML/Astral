import { useEffect, useRef, useState } from 'react'
import { StopCircleIcon } from 'lucide-react'
import { History as HistoryOutlined } from 'lucide-react'
import MessagesPanel from './MessagesPanel'
import ManageVersionPanel from './ManageVersionPanel'
import { Send as SendOutlined } from 'lucide-react'

const TABS = { chat: 'chat', history: 'history' }

const ChatPanel = ({
	appId,
	input,
	onInputChange,
	onSendMessage,
	isStreaming,
	streamingContent,
	liveMessages,
	onDeployVersion,
}) => {
	const textareaRef = useRef(null)
	const [activeTab, setActiveTab] = useState(TABS.chat)

	useEffect(() => {
		const el = textareaRef.current
		if (!el) return
		el.style.height = 'auto'
		el.style.height = el.scrollHeight + 'px'
	}, [input])

	return (
		<div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-gray-50 dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-[#333]">
			{/* Tabs: Chat | History – cùng hàng, bấm History thay nội dung Chat AI bằng Version */}
			<div className="shrink-0 h-14 flex border-b border-gray-200 dark:border-[#333] bg-gray-100 dark:bg-[#252526]">
				<button
					type="button"
					onClick={() => setActiveTab(TABS.chat)}
					className={`flex-1 h-full px-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
						activeTab === TABS.chat
							? 'text-blue-600 dark:text-white bg-white dark:bg-[#1e1e1e] border-blue-500 dark:border-white'
							: 'text-gray-500 dark:text-[#888] hover:text-gray-700 dark:hover:text-[#aaa] border-transparent'
					}`}
				>
					Chat
				</button>
				<button
					type="button"
					onClick={() => setActiveTab(TABS.history)}
					className={`flex-1 h-full px-4 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 border-b-2 -mb-px ${
						activeTab === TABS.history
							? 'text-blue-600 dark:text-white bg-white dark:bg-[#1e1e1e] border-blue-500 dark:border-white'
							: 'text-gray-500 dark:text-[#888] hover:text-gray-700 dark:hover:text-[#aaa] border-transparent'
					}`}
				>
					<HistoryOutlined className="w-4 h-4" />
					History
				</button>
			</div>

			{activeTab === TABS.chat && (
				<>
					<div className="flex-1 min-h-0 min-w-0 overflow-hidden flex flex-col">
						<MessagesPanel
							appId={appId}
							liveMessages={liveMessages}
							streamingContent={streamingContent}
							isStreaming={isStreaming}
							onDeployVersion={onDeployVersion}
						/>
					</div>
				</>
			)}

			{activeTab === TABS.history && (
				<div className="flex-1 min-h-0 min-w-0 overflow-hidden flex flex-col">
					<ManageVersionPanel
						appId={appId}
						onDeployVersion={onDeployVersion}
					/>
				</div>
			)}

			{activeTab === TABS.chat && (
				<div className="shrink-0 p-3 border-t border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252526] text-gray-900 dark:text-[#cccccc]">
					<div className="flex items-end gap-2 bg-white dark:bg-[#3c3c3c] border border-gray-300 dark:border-[#555] rounded-xl px-1 mb-2">
						<textarea
							ref={textareaRef}
							value={input}
							onChange={(e) => onInputChange(e.target.value)}
							onKeyDown={(e) => {
								if (
									e.key === 'Enter' &&
									!e.shiftKey &&
									!isStreaming
								) {
									e.preventDefault()
									onSendMessage()
								}
							}}
							placeholder={
								isStreaming
									? 'Waiting for response...'
									: 'Enter message...'
							}
							disabled={isStreaming}
							rows={1}
							style={{ overflowY: 'hidden', maxHeight: '160px' }}
							className="mx-2 flex-1 px-3 py-2 text-sm resize-none bg-transparent outline-none border-0 placeholder:text-gray-400 dark:placeholder:text-[#888] disabled:opacity-50"
						/>
						<button
							onClick={onSendMessage}
							className="p-1 w-8 h-8 flex items-center justify-center shrink-0"
							disabled={isStreaming}
						>
							{isStreaming ? (
								<StopCircleIcon className="w-5 h-5" />
							) : (
								<SendOutlined className="dark:text-white text-gray-500" />
							)}
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default ChatPanel
