import { useEffect } from 'react'

/**
 * Hook to handle Ctrl+S / Cmd+S keyboard shortcut for saving
 * @param {string} currentFile - Current file path
 * @param {string} code - Current code content
 * @param {Function} onSave - Save callback function
 */
export function useSaveShortcut(currentFile, code, onSave) {
	useEffect(() => {
		const handleKeyDown = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault()
				if (currentFile) onSave()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [currentFile, code, onSave])
}
