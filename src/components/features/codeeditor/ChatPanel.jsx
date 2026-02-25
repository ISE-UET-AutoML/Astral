import { Button } from 'src/components/shared/ui/button'

/**
 * Chat panel for AI-assisted code editing
 * @param {{messages: Array, input: string, onInputChange: Function, onSendMessage: Function}} props
 */
const ChatPanel = ({ messages, input, onInputChange, onSendMessage }) => {
	return (
		<div className="flex flex-col h-full min-h-0 bg-white border-r border-gray-200 overflow-hidden">
			<div className="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Chat</div>
			<div className="flex-1 min-h-0 overflow-auto p-4 space-y-3">
				{messages.map((msg, i) => (
					<div
						key={i}
						className={`p-3 rounded-lg border ${
							msg.role === 'user' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
						}`}
					>
						<strong className={msg.role === 'user' ? 'text-blue-600' : 'text-green-600'}>
							{msg.role === 'user' ? 'User' : 'AI'}:
						</strong>
						<div className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{msg.content}</div>
					</div>
				))}
			</div>
			<div className="p-3 border-t border-gray-200 bg-gray-50 flex gap-2">
				<input
					type="text"
					value={input}
					onChange={(e) => onInputChange(e.target.value)}
					onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
					placeholder="Enter message..."
					className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<Button onClick={onSendMessage} size="sm" className="px-4">
					Send
				</Button>
			</div>
		</div>
	)
}

export default ChatPanel
