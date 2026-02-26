import { Button } from '../ui/button'
import MessagesPanel from './MessagesPanel'

/**
 * Chat panel shell.
 * - "Chat" header: pinned top (shrink-0)
 * - MessagesPanel: scrollable middle (flex-1 min-h-0)
 * - Input bar: pinned bottom (shrink-0)
 *
 * @param {{ appId?: string, input: string, onInputChange: Function, onSendMessage: Function }} props
 */
const ChatPanel = ({ appId, input, onInputChange, onSendMessage }) => {
	return (
		<div className="flex flex-col h-full min-h-0 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-[#333]">
			<div className="shrink-0 px-4 py-3 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252526] font-semibold text-gray-700 dark:text-[#cccccc]">
				Chat
			</div>

			<div className="flex-1 min-h-0 overflow-hidden">
				<MessagesPanel appId={appId} />
			</div>

			<div className="shrink-0 p-3 border-t border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252526] flex gap-2">
				<input
					type="text"
					value={input}
					onChange={(e) => onInputChange(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
					placeholder="Enter message..."
					className="flex-1 px-3 py-2 bg-white dark:bg-[#3c3c3c] border border-gray-300 dark:border-[#555] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#007acc] text-gray-900 dark:text-[#cccccc] placeholder:text-gray-400 dark:placeholder:text-[#888]"
				/>
				<Button onClick={onSendMessage} size="sm" className="px-4">
					Send
				</Button>
			</div>
		</div>
	)
}

export default ChatPanel
