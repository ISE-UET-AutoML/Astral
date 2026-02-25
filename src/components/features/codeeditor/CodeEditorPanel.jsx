import Editor from '@monaco-editor/react'
import { Button } from 'src/components/shared/ui/button'
import { ArrowPathIcon, BookmarkIcon } from '@heroicons/react/24/outline'

/**
 * Get monaco editor language from filename
 * @param {string} filename - File name with extension
 * @returns {string} Monaco language identifier
 */
const getLanguageFromFile = (filename) => {
	const extension = filename.split('.').pop()?.toLowerCase()
	switch (extension) {
		case 'py':
			return 'python'
		case 'js':
		case 'jsx':
			return 'javascript'
		case 'ts':
		case 'tsx':
			return 'typescript'
		case 'json':
			return 'json'
		case 'html':
			return 'html'
		case 'css':
			return 'css'
		case 'scss':
			return 'scss'
		case 'md':
			return 'markdown'
		case 'yaml':
		case 'yml':
			return 'yaml'
		case 'xml':
			return 'xml'
		case 'sql':
			return 'sql'
		case 'sh':
		case 'bash':
			return 'shell'
		default:
			return 'plaintext'
	}
}

/**
 * Code editor panel with Monaco editor
 * @param {{currentFile: string, code: string, originalCode: string, isSaving: boolean, onCodeChange: Function, onSave: Function}} props
 */
const CodeEditorPanel = ({ currentFile, code, originalCode, isSaving, onCodeChange, onSave }) => {
	const hasUnsavedChanges = code !== originalCode

	return (
		<div className="flex flex-col h-full bg-white">
			{currentFile && (
				<div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
					<span className="text-sm text-gray-600">{currentFile}</span>
					<div className="flex gap-2 items-center">
						{isSaving && <span className="text-xs text-gray-500">Saving...</span>}
						{!isSaving && hasUnsavedChanges && <span className="text-orange-500 text-sm">●</span>}
						<Button onClick={onSave} disabled={isSaving} size="sm" variant={isSaving ? 'secondary' : 'default'}>
							{isSaving ? (
								<ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<BookmarkIcon className="h-4 w-4 mr-2" />
							)}
							Save
						</Button>
					</div>
				</div>
			)}
			<div className="flex-1">
				<Editor
					height="100%"
					language={getLanguageFromFile(currentFile)}
					theme="vs-light"
					value={code}
					onChange={(v) => onCodeChange(v ?? '')}
					options={{
						readOnly: false,
						minimap: { enabled: true },
						automaticLayout: true,
						fontSize: 14
					}}
				/>
			</div>
		</div>
	)
}

export default CodeEditorPanel
