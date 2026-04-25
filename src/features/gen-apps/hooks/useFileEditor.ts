import { useEffect, useState } from 'react'
import { workspaceApi } from '../api/workspace'

/**
 * Hook to manage file editing with auto-save
 * @param {string} appId - Generated app ID
 * @param {string} currentFile - Current file path
 * @param {string} originalCode - Original code for comparison
 * @returns {{code: string, setCode: Function, isSaving: boolean, saveError: string|null, clearSaveError: Function}}
 */
export function useFileEditor(appId, currentFile, originalCode) {
	const [code, setCode] = useState('')
	const [isSaving, setIsSaving] = useState(false)
	const [saveError, setSaveError] = useState(null)

	// Auto-save with debounce
	useEffect(() => {
		if (!appId || !currentFile || code === originalCode || code === '') return

		const timer = setTimeout(() => {
			setIsSaving(true)
			setSaveError(null)
			workspaceApi
				.saveFile(appId, currentFile, code)
				.then(() => setSaveError(null))
				.catch((err) => {
					console.error('Auto-save failed:', err)
					setSaveError(err instanceof Error ? err.message : 'Failed to save file')
				})
				.finally(() => setIsSaving(false))
		}, 50000)

		return () => clearTimeout(timer)
	}, [appId, code, currentFile, originalCode])

	// Clear error when switching files
	useEffect(() => {
		setSaveError(null)
	}, [currentFile])

	return {
		code,
		setCode,
		isSaving,
		saveError,
		clearSaveError: () => setSaveError(null)
	}
}
