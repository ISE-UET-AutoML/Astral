import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from 'src/components/ui/card'
import { Button } from 'src/components/ui/button'

const StatusBadge = ({ status }) => {
	const statusConfig = {
		pending: {
			bg: 'bg-yellow-100 dark:bg-yellow-900/30',
			text: 'text-yellow-800 dark:text-yellow-300',
			label: 'Pending',
		},
		running: {
			bg: 'bg-blue-100 dark:bg-blue-900/30',
			text: 'text-blue-800 dark:text-blue-300',
			label: 'Running',
		},
		generating: {
			bg: 'bg-purple-100 dark:bg-purple-900/30',
			text: 'text-purple-800 dark:text-purple-300',
			label: 'Generating',
		},
		generated: {
			bg: 'bg-indigo-100 dark:bg-indigo-900/30',
			text: 'text-indigo-800 dark:text-indigo-300',
			label: 'Generated',
		},
		deploying: {
			bg: 'bg-orange-100 dark:bg-orange-900/30',
			text: 'text-orange-800 dark:text-orange-300',
			label: 'Deploying',
		},
		deployed: {
			bg: 'bg-green-100 dark:bg-green-900/30',
			text: 'text-green-800 dark:text-green-300',
			label: 'Deployed',
		},
		completed: {
			bg: 'bg-green-100 dark:bg-green-900/30',
			text: 'text-green-800 dark:text-green-300',
			label: 'Completed',
		},
		failed: {
			bg: 'bg-red-100 dark:bg-red-900/30',
			text: 'text-red-800 dark:text-red-300',
			label: 'Failed',
		},
	}

	const config = statusConfig[status] || statusConfig.pending

	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
		>
			<span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
			{config.label}
		</span>
	)
}

const AppIcon = ({ taskType }) => {
	if (taskType?.includes('object')) {
		return (
			<svg
				className="h-5 w-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
			>
				<rect
					x="3"
					y="3"
					width="18"
					height="18"
					rx="2"
					strokeWidth="2"
				/>
				<circle cx="12" cy="12" r="3" strokeWidth="2" />
			</svg>
		)
	}
	if (taskType?.includes('text')) {
		return (
			<svg
				className="h-5 w-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
			>
				<path
					d="M4 7h16M4 12h16M4 17h10"
					strokeWidth="2"
					strokeLinecap="round"
				/>
			</svg>
		)
	}
	// Default: image classification
	return (
		<svg
			className="h-5 w-5"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
		>
			<rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
			<circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
			<path
				d="M21 15l-5-5L5 21"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function AppCard({ app, onViewDetails }) {
	const hasInstance = app?.instance_id && app?.host
	const frontendUrl =
		hasInstance && app?.ports?.frontend
			? `http://${app.host}:${app.ports.frontend}`
			: null

	const formatDate = (dateStr) => {
		if (!dateStr) return 'N/A'
		try {
			return new Date(dateStr).toLocaleString('vi-VN', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
			})
		} catch {
			return dateStr
		}
	}

	return (
		<Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1" style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)' }}>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex items-center gap-2 flex-1 min-w-0">
						<div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-[#2a2a2c] dark:to-[#252527] text-blue-600 dark:text-gray-300 flex-shrink-0">
							<AppIcon taskType={app?.task_type} />
						</div>
						<CardTitle
							className="text-lg text-gray-900 dark:text-white truncate"
							title={app?.name}
						>
							{app?.name || `App #${app?.id}`}
						</CardTitle>
					</div>
					<StatusBadge status={app?.status} />
				</div>
			</CardHeader>

			<CardContent className="space-y-3">
				{/* Task Type */}
				<div className="flex items-center gap-2 text-sm">
					<span className="text-gray-500 dark:text-gray-400 font-medium">
						Task:
					</span>
					<span className="text-gray-900 dark:text-white capitalize">
						{app?.task_type?.replace(/_/g, ' ') || 'N/A'}
					</span>
				</div>

				{/* Model ID */}
				{app?.model_id != null && (
					<div className="flex items-center gap-2 text-sm">
						<span className="text-gray-500 dark:text-gray-400 font-medium">
							Model ID:
						</span>
						<span className="text-gray-900 dark:text-white font-mono">
							{app.model_id}
						</span>
					</div>
				)}

				{/* Created At */}
				{app?.created_at && (
					<div className="flex items-center gap-2 text-sm">
						<span className="text-gray-500 dark:text-gray-400 font-medium">
							Created:
						</span>
						<span className="text-gray-900 dark:text-white text-xs">
							{formatDate(app.created_at)}
						</span>
					</div>
				)}

				{/* Instance Info */}
				{hasInstance && (
					<div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--border)' }}>
						<div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
							<div className="flex justify-between">
								<span>Instance:</span>
								<span className="font-mono text-gray-700 dark:text-gray-300">
									{String(app.instance_id ?? '').substring(
										0,
										8
									)}
									...
								</span>
							</div>
							{app.ports?.frontend && (
								<div className="flex justify-between">
									<span>Port:</span>
									<span className="font-mono text-gray-700 dark:text-gray-300">
										{app.ports.frontend}
									</span>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Error Message */}
				{app?.error_message && (
					<div className="mt-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
						<p
							className="text-xs text-red-600 dark:text-red-400 line-clamp-2"
							title={app.error_message}
						>
							{app.error_message}
						</p>
					</div>
				)}

				{/* Actions */}
				<div className="flex gap-2 pt-2">
					{frontendUrl && (
						<Button
							size="sm"
							onClick={() => window.open(frontendUrl, '_blank')}
							className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
						>
							<svg
								className="h-4 w-4 mr-1"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
							>
								<path
									d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							Open App
						</Button>
					)}
					{onViewDetails && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => onViewDetails(app)}
							className="flex-1 app-card-details-btn text-xs"
						>
							Details
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

export default AppCard
