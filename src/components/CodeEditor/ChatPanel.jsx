import { useEffect, useRef } from 'react'
import { StopCircleIcon } from '@heroicons/react/20/solid'
import MessagesPanel from './MessagesPanel'
import { SendOutlined } from '@ant-design/icons'

const ChatPanel = ({ appId, input, onInputChange, onSendMessage, isStreaming, streamingContent, liveMessages }) => {
	const textareaRef = useRef(null)

	useEffect(() => {
		const el = textareaRef.current
		if (!el) return
		el.style.height = 'auto'
		el.style.height = el.scrollHeight + 'px'
	}, [input])

	return (
		<div className="flex flex-col h-full min-h-0 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-[#333] justify-between">
			<div className="shrink-0 px-4 py-3 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252526] font-semibold text-gray-700 dark:text-[#cccccc]">
				Chat
			</div>

			<div className="flex-1 min-h-0 overflow-hidden">
				<MessagesPanel
					appId={appId}
					liveMessages={liveMessages}
					streamingContent={streamingContent}
					isStreaming={isStreaming}
				/>
			</div>

			<div className="shrink-0 p-3 border-t border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252526] text-gray-900 dark:text-[#cccccc]">
				<div className="flex items-end gap-2 bg-white dark:bg-[#3c3c3c] border border-gray-300 dark:border-[#555] rounded-xl px-1 mb-2">
					<textarea
						ref={textareaRef}
						value={input}
						onChange={(e) => onInputChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey && !isStreaming) {
								e.preventDefault()
								onSendMessage()
							}
						}}
						placeholder={isStreaming ? 'Waiting for response...' : 'Enter message...'}
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
						{isStreaming
							? <StopCircleIcon className="w-5 h-5" />
							: <SendOutlined className="dark:text-white text-blue-500" />}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ChatPanel
