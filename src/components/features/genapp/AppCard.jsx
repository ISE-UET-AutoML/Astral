import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from 'src/components/shared/ui/card'
import { Button } from 'src/components/shared/ui/button'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

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

function AppCard({ app, onViewDetails, onRetry, isRetrying }) {
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
		<Card className="flex flex-col h-full rounded-2xl shadow-lg bg-white dark:[background:var(--card-gradient)] border border-gray-200 dark:border-[var(--border)] hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex items-center gap-2 flex-1 min-w-0">
						<div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-white/10 dark:to-white/5 text-blue-600 dark:text-[var(--accent-text)] flex-shrink-0">
							<AppIcon taskType={app?.task_type} />
						</div>
						<CardTitle
							className="text-lg text-gray-900 dark:text-[var(--text)] truncate"
							title={app?.name}
						>
							{app?.name || `App #${app?.id}`}
						</CardTitle>
					</div>
					<StatusBadge status={app?.status} />
				</div>
			</CardHeader>

			<CardContent className="flex-1 flex flex-col">
				<div className="flex-1 space-y-3">
					{/* Task Type */}
					<div className="flex items-center gap-2 text-sm">
						<span className="text-gray-500 dark:text-[var(--secondary-text)] font-medium">
							Task:
						</span>
						<span className="text-gray-900 dark:text-[var(--text)] capitalize">
							{app?.task_type?.replace(/_/g, ' ') || 'N/A'}
						</span>
					</div>

					{/* Model ID */}
					{app?.model_id != null && (
						<div className="flex items-center gap-2 text-sm">
							<span className="text-gray-500 dark:text-[var(--secondary-text)] font-medium">
								Model ID:
							</span>
							<span className="text-gray-900 dark:text-[var(--text)] font-mono">
								{app.model_id}
							</span>
						</div>
					)}

					{/* Created At */}
					{app?.created_at && (
						<div className="flex items-center gap-2 text-sm">
							<span className="text-gray-500 dark:text-[var(--secondary-text)] font-medium">
								Created:
							</span>
							<span className="text-gray-900 dark:text-[var(--text)] text-xs">
								{formatDate(app.created_at)}
							</span>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="flex gap-2 pt-4 mt-auto">
					{app?.status === 'failed' && onRetry ? (
						<Button
							size="sm"
							onClick={() => onRetry(app)}
							disabled={isRetrying}
							className="flex-1 bg-amber-400 hover:bg-amber-500 dark:bg-slate-600 dark:hover:bg-slate-500 text-white text-xs focus:ring-0 focus:ring-offset-0 disabled:opacity-50"
						>
							<ArrowPathIcon
								className={`h-4 w-4 mr-1.5 ${isRetrying ? 'animate-spin' : ''}`}
							/>
							Retry
						</Button>
					) : (
						<>
							{frontendUrl && (
								<Button
									size="sm"
									onClick={() =>
										window.open(frontendUrl, '_blank')
									}
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
									disabled={[
										'pending',
										'running',
										'generating',
										'deploying',
									].includes(app?.status)}
									className="flex-1 border-gray-300 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-white text-gray-700 dark:text-[var(--text)] hover:text-gray-900 dark:hover:text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Details
								</Button>
							)}
						</>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

export default AppCard
