import axiosClient from 'src/api/axios'
import {
	USE_GEN_APP_MOCKS,
	getMockAppVersionsSummary,
	mockFileTree,
	mockFilesByPath,
	mockGeneratedApp,
	mockGeneratedAppsById,
} from 'src/features/gen-apps/mocks'

/**
 * Init draft workspace – call when entering edit page or clicking Details
 */
export async function initDraft(appId) {
	if (USE_GEN_APP_MOCKS) {
		return { status: 'ready', app_id: appId }
	}

	const res = await axiosClient.post(
		`/api/service/adaptive_model_to_app/apps/${appId}/draft/init`
	)
	return res.data
}

/**
 * Workspace API for interacting with generated apps.
 * Maps to backend gateway endpoint: /api/service/adaptive_model_to_app/workspace/
 */
export const workspaceApi = {
	// Initialize draft for an app (idempotent)
	async initDraft(appId) {
		if (USE_GEN_APP_MOCKS) {
			return { status: 'ready', app_id: appId }
		}

		const response = await axiosClient.post(
			`/api/service/adaptive_model_to_app/apps/${appId}/draft/init`
		)
		return response.data
	},

	/**
	 * Get file tree structure for a generated app (from draft)
	 * @param {string} appId - Generated app ID (run_id)
	 * @returns {Promise<TreeNode>} File tree structure
	 */
	async getTree(appId) {
		if (USE_GEN_APP_MOCKS) {
			return mockFileTree
		}

		const response = await axiosClient.get(
			`/api/service/adaptive_model_to_app/apps/${appId}/draft/tree`
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
		if (USE_GEN_APP_MOCKS) {
			return {
				content:
					mockFilesByPath[appId]?.[path] ||
					mockFilesByPath[mockGeneratedApp.id]?.[path] ||
					`// File not found: ${path}\n`,
			}
		}

		const response = await axiosClient.get(
			`/api/service/adaptive_model_to_app/apps/${appId}/draft/files/${path}`,
		)
		console.log(response.data)
		return response.data;
	},

	/**
	 * Save file content into draft (persists to Redis + S3)
	 * @param {string} appId - Generated app ID
	 * @param {string} path - File path relative to project root
	 * @param {string} content - New file content
	 * @returns {Promise<void>}
	 */
	async saveFile(appId, path, content) {
		if (USE_GEN_APP_MOCKS) {
			return
		}

		await axiosClient.put(
			`/api/service/adaptive_model_to_app/apps/${appId}/draft/files/${path.split('/').map(encodeURIComponent).join('/')}`,
			{ content, user_id: 'default' }
		)
	},

	/** Save draft snapshot (commit to Git) */
	async saveDraftSnapshot(appId, description) {
		if (USE_GEN_APP_MOCKS) {
			return {
				status: 'saved',
				app_id: appId,
				description: description || 'Draft snapshot',
			}
		}

		const res = await axiosClient.post(
			`/api/service/adaptive_model_to_app/apps/${appId}/draft/save`,
			{ description: description || 'Draft snapshot' }
		)
		return res.data
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
			`/api/service/adaptive_model_to_app/apps/${appId}/adapt`,
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
			`/api/service/adaptive_model_to_app/apps/${appId}/draft/adapt/${adaptId}`
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

	/** List versions for app */
	async getVersions(appId) {
		const res = await axiosClient.get(
			`/api/service/adaptive_model_to_app/apps/${appId}/versions`
		)
		return res.data
	},

	/** List versions + current_version (deployed). Use when displaying version selector. */
	async getVersionsSummary(appId) {
		if (USE_GEN_APP_MOCKS) {
			return getMockAppVersionsSummary(appId)
		}

		const res = await axiosClient.get(
			`/api/service/adaptive_model_to_app/apps/${appId}/versions/summary`
		)
		return res.data
	},

	/** Deploy a specific version via versions/{version_number}/deploy */
	async deployVersion(appId, versionNumber) {
		if (USE_GEN_APP_MOCKS) {
			return {
				status: 'deployed',
				app_id: appId,
				version_number: versionNumber,
			}
		}

		const res = await axiosClient.post(
			`/api/service/adaptive_model_to_app/apps/${appId}/versions/${versionNumber}/deploy`
		)
		return res.data
	},

	/**
	 * Deploy draft as NEW version (latest + 1). Creates version from current draft, then deploys.
	 * @param {string} appId
	 * @param {Object} [files] - Optional: { [path]: content } to merge unsaved editor content
	 */
	async deployDraft(appId, files = {}) {
		if (USE_GEN_APP_MOCKS) {
			const versionsSummary = getMockAppVersionsSummary(appId)
			return {
				status: 'deployed',
				app_id: appId,
				version_number: versionsSummary.current_version + 1,
			}
		}

		const res = await axiosClient.post(
			`/api/service/adaptive_model_to_app/apps/${appId}/draft/deploy`,
			{ files: Object.keys(files).length ? files : undefined }
		)
		return res.data
	},

	/** Get app details (including host/ports) */
	async getApp(appId) {
		if (USE_GEN_APP_MOCKS) {
			return {
				...(mockGeneratedAppsById[appId] || mockGeneratedApp),
			}
		}

		const res = await axiosClient.get(
			`/api/service/adaptive_model_to_app/generated_app/${appId}`
		)
		return res.data
	},
}
