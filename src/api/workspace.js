import axiosClient from './axios'

// Workspace API for interacting with generated apps.
// NOTE: tree / files / adapt are now backed by the versioning
// draft APIs behind the gateway.
const AMTA_PREFIX = '/api/service/adaptive_model_to_app'

export const workspaceApi = {
	// Initialize draft for an app (idempotent)
	async initDraft(appId) {
		const response = await axiosClient.post(
			`${AMTA_PREFIX}/apps/${appId}/draft/init`
		)
		return response.data
	},

	/**
	 * Get file tree structure for a generated app (from draft)
	 * @param {string} appId - Generated app ID (run_id)
	 * @returns {Promise<TreeNode>} File tree structure
	 */
	async getTree(appId) {
		const response = await axiosClient.get(
			`${AMTA_PREFIX}/apps/${appId}/draft/tree`
		)
		return response.data
	},

	/**
	 * Get file content from draft
	 * @param {string} appId - Generated app ID
	 * @param {string} path - File path relative to project root
	 * @returns {Promise<{content: string}>} File content
	 */
	async getFile(appId, path) {
		const response = await axiosClient.get(
			`${AMTA_PREFIX}/apps/${appId}/draft/files/${path}`
		)
		return response.data
	},

	/**
	 * Save file content into draft (persists to Redis + S3)
	 * @param {string} appId - Generated app ID
	 * @param {string} path - File path relative to project root
	 * @param {string} content - New file content
	 * @returns {Promise<void>}
	 */
	async saveFile(appId, path, content) {
		await axiosClient.put(
			`${AMTA_PREFIX}/apps/${appId}/draft/files/${path}`,
			{
				content,
				user_id: 'default',
			}
		)
	},

	// Save a full draft snapshot (tarball) to S3
	async saveSnapshot(appId, description) {
		const response = await axiosClient.post(
			`${AMTA_PREFIX}/apps/${appId}/draft/save`,
			{
				description,
			}
		)
		return response.data
	},

	// Deploy current draft as a new version (and trigger Vast deploy)
	async deployDraft(appId, versionDescription) {
		const response = await axiosClient.post(
			`${AMTA_PREFIX}/apps/${appId}/draft/deploy`,
			{
				version_description: versionDescription,
			}
		)
		return response.data
	},

	/**
	 * Start an adapt operation to modify the generated app (over draft).
	 * Returns immediately with an adapt_id for polling.
	 * @param {string} appId - Generated app ID
	 * @param {string} prompt - User prompt describing desired changes
	 * @returns {Promise<AdaptResponse>}
	 */
	async startAdapt(appId, prompt) {
		const response = await axiosClient.post(
			`${AMTA_PREFIX}/apps/${appId}/draft/adapt`,
			{
				prompt,
			}
		)
		return response.data
	},

	/**
	 * Get the status of an adapt operation.
	 * @param {string} appId - Generated app ID
	 * @param {string} adaptId - Adapt operation ID
	 * @returns {Promise<AdaptResponse>}
	 */
	async getAdaptStatus(appId, adaptId) {
		const response = await axiosClient.get(
			`${AMTA_PREFIX}/apps/${appId}/draft/adapt/${adaptId}`
		)
		return response.data
	},

	/**
	 * Poll for adapt completion with exponential backoff.
	 * Returns the final response when completed or failed.
	 * @param {string} appId - Generated app ID
	 * @param {string} adaptId - Adapt operation ID
	 * @param {Function} onStatusUpdate - Callback for status updates
	 * @param {number} maxAttempts - Maximum polling attempts (default: 120)
	 * @param {number} initialDelayMs - Initial delay between polls (default: 1000ms)
	 * @returns {Promise<AdaptResponse>}
	 */
	async pollAdaptCompletion(
		appId,
		adaptId,
		onStatusUpdate,
		maxAttempts = 120,
		initialDelayMs = 1000
	) {
		let attempts = 0
		let delay = initialDelayMs

		while (attempts < maxAttempts) {
			const status = await this.getAdaptStatus(appId, adaptId)

			if (onStatusUpdate) {
				onStatusUpdate(status)
			}

			if (status.status === 'completed' || status.status === 'failed') {
				return status
			}

			// Wait before next poll
			await new Promise((resolve) => setTimeout(resolve, delay))

			// Exponential backoff, max 5 seconds
			delay = Math.min(delay * 1.5, 5000)
			attempts++
		}

		throw new Error('Adapt operation timed out')
	},
}
