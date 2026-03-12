import { useState, useEffect, useCallback } from 'react'
import { workspaceApi } from 'src/api/workspace'

const ChevronDown = ({ open }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 20"
		fill="currentColor"
		className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
	>
		<path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
	</svg>
)

const formatDate = (d) => {
	if (!d) return '-'
	try {
		return new Date(d).toLocaleString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	} catch {
		return String(d)
	}
}

const VersionRow = ({ version, isCurrent, onDeploy }) => {
	const [expanded, setExpanded] = useState(false)
	const hasChangelog = Boolean(version?.changelog?.trim())

	return (
		<div
			className={`rounded-xl border transition-colors ${
				isCurrent
					? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-500'
					: 'border-gray-200 dark:border-[#444] bg-white dark:bg-[#2d2d2d] hover:bg-gray-50 dark:hover:bg-[#333]'
			}`}
		>
			<div
				className="flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer"
				onClick={() => hasChangelog && setExpanded((e) => !e)}
			>
				<div className="flex items-center gap-5 min-w-0">
					<span className={`text-sm font-semibold ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-[#cccccc]'}`}>
						Version {version.version_number}
						{isCurrent && (
							<span className="ml-1.5 text-[10px] font-normal px-1.5 py-0.5 rounded bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
								Deployed
							</span>
						)}
					</span>
					<span className="text-[11px] text-gray-500 dark:text-[#888] shrink-0">
						{formatDate(version.last_modified_at || version.created_at)}
					</span>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					{!isCurrent && onDeploy && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								onDeploy(version.version_number)
							}}
							className="text-[11px] px-2 py-1 rounded bg-gray-200 dark:bg-[#444] hover:bg-gray-300 dark:hover:bg-[#555] text-gray-700 dark:text-[#ccc]"
						>
							Revert
						</button>
					)}
					{hasChangelog && (
						<span className="p-1 text-gray-500 dark:text-[#888]">
							<ChevronDown open={expanded} />
						</span>
					)}
				</div>
			</div>
			{expanded && hasChangelog && (
				<div className="px-3 pb-3 pt-0 border-t border-gray-100 dark:border-[#444]">
					<p className="text-[11px] font-medium text-gray-500 dark:text-[#888] uppercase tracking-wide mb-1 mt-3">Changelog</p>
					<p className="text-sm text-gray-700 dark:text-[#aaa] whitespace-pre-wrap pl-0">
						{version.changelog}
					</p>
				</div>
			)}
		</div>
	)
}

/**
 * Manage Version panel – list versions, show changelog on expand, current version in blue.
 */
const ManageVersionPanel = ({ appId, onDeployVersion }) => {
	const [data, setData] = useState({ versions: [], current_version: null })
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchVersions = useCallback(async () => {
		if (!appId) return
		setLoading(true)
		setError(null)
		try {
			const res = await workspaceApi.getVersionsSummary(appId)
			setData({
				versions: res.versions ?? [],
				current_version: res.current_version ?? null,
			})
		} catch (err) {
			setError(err?.message || 'Failed to load versions')
		} finally {
			setLoading(false)
		}
		console.log('data', data)
	}, [appId])

	useEffect(() => {
		fetchVersions()
	}, [fetchVersions])

	if (loading) {
		return (
			<div className="flex items-center justify-center h-32 text-sm text-gray-500 dark:text-[#888]">
				Loading versions...
			</div>
		)
	}

	if (error) {
		return (
			<div className="p-4 text-sm text-red-500 dark:text-red-400">
				{error}
			</div>
		)
	}

	const { versions, current_version } = data
	if (!versions?.length) {
		return (
			<div className="p-4 text-sm text-gray-500 dark:text-[#888]">
				No versions yet. Deploy to create your first version.
			</div>
		)
	}

	return (
		<div className="flex flex-col flex-1 min-h-0 overflow-hidden">
			<div className="shrink-0 px-3 py-2 border-b border-gray-200 dark:border-[#333] flex justify-between items-center gap-2">
				<span className="text-xs font-medium text-gray-500 dark:text-[#888]">
					{versions.length} version{versions.length !== 1 ? 's' : ''}
				</span>
				<button
					type="button"
					onClick={fetchVersions}
					className="text-[11px] text-gray-500 hover:text-gray-700 dark:text-[#888] dark:hover:text-[#ccc]"
				>
					Refresh
				</button>
			</div>
			<div className="flex-1 min-h-0 overflow-auto p-3 space-y-2">
				{versions.map((v) => (
					<VersionRow
						key={v.id ?? v.version_number}
						version={v}
						isCurrent={v.version_number === current_version}
						onDeploy={onDeployVersion}
					/>
				))}
			</div>
		</div>
	)
}

export default ManageVersionPanel
