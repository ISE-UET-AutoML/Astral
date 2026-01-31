import { useEffect, useState, useCallback } from 'react'
import { workspaceApi } from '../api/workspace'

/**
 * Hook to manage file tree for a generated app
 * @param {string} appId - Generated app ID (run_id)
 * @returns {{tree: object|null, loading: boolean, error: string|null, refetch: Function}}
 */
export function useFileTree(appId) {
	const [tree, setTree] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchTree = useCallback(async () => {
		if (!appId) {
			setLoading(false)
			return
		}

		setLoading(true)
		try {
			const data = await workspaceApi.getTree(appId)
			setTree(data)
			setError(null)
		} catch (err) {
			console.error('Failed to load tree:', err)
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [appId])

	useEffect(() => {
		fetchTree()
	}, [fetchTree])

	return { tree, loading, error, refetch: fetchTree }
}
