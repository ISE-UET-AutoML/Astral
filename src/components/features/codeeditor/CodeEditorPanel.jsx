import Editor from '@monaco-editor/react'
import { useTheme } from 'src/theme/ThemeProvider'

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
 * Code editor panel with Monaco editor – dark/light aware.
 * @param {{currentFile: string, code: string, originalCode: string, isSaving: boolean, isDeploying?: boolean, onCodeChange: Function, onSave: Function, onDeploy: Function}} props
 */
const CodeEditorPanel = ({ currentFile, code, originalCode, isSaving, isDeploying, onCodeChange, onSave, onDeploy }) => {
	const { theme } = useTheme()
	const isDark = theme === 'dark'
	const hasUnsavedChanges = code !== originalCode

	return (
		<div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-gray-50 dark:bg-[#1e1e1e]">
			{currentFile && (
				<div className="shrink-0 px-4 py-3 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252526] flex items-center gap-2">
					<span className="text-sm text-gray-600 dark:text-[#cccccc]">{currentFile}</span>
					{isSaving && <span className="text-xs text-gray-500 dark:text-[#888]">Saving...</span>}
					{!isSaving && hasUnsavedChanges && <span className="text-orange-500 text-sm" title="Unsaved changes">●</span>}
				</div>
			)}
			<div className="flex-1 min-h-0 overflow-hidden">
				<Editor
					height="100%"
					path={currentFile || 'untitled'}
					language={getLanguageFromFile(currentFile)}
					theme={isDark ? 'vs-dark' : 'vs-light'}
					value={code}
					onChange={(v) => onCodeChange(v ?? '')}
					options={{
						readOnly: false,
						minimap: { enabled: true },
						automaticLayout: true,
						fontSize: 14,
						renderValidationDecorations: 'off',
						tabCompletion: 'on',
						quickSuggestionsDelay: 50,
						suggestOnTriggerCharacters: true,
						suggest: {
							showWords: true,
							showSnippets: true,
						},
						quickSuggestions: {
							other: true,
							comments: false,
							strings: true,
						},
						parameterHints: { enabled: true },
						acceptSuggestionOnCommitCharacter: true,
						acceptSuggestionOnEnter: 'on',
						inlineSuggest: { enabled: true },
						wordBasedSuggestions: 'allDocuments',
						snippetSuggestions: 'inline',
					}}
				/>
			</div>
		</div>
	)
}

export default CodeEditorPanel
