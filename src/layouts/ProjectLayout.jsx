import { Outlet, useMatches, useParams } from 'react-router-dom'
import ProjectSidebar from 'src/layouts/ProjectSidebar'
import { useTheme } from 'src/theme/ThemeProvider'

export default function ProjectLayout() {
	const params = useParams()
	const matches = useMatches()
	const { theme } = useTheme()
	const defaultLayoutConfig = {
		overflow: 'auto',
		padding: 'default',
		height: 'min',
	}
	const layoutConfig = matches.reduce((config, match) => {
		if (!match.handle?.projectLayout) return config
		return { ...config, ...match.handle.projectLayout }
	}, defaultLayoutConfig)
	const contentHeightClass =
		layoutConfig.height === 'full'
			? 'h-[calc(100dvh-100px)]'
			: layoutConfig.height === 'auto'
				? ''
			: 'min-h-0'
	const contentOverflowClass =
		layoutConfig.overflow === 'hidden'
			? 'overflow-hidden'
			: layoutConfig.overflow === 'visible'
				? 'overflow-visible'
				: 'overflow-y-auto overflow-x-hidden'
	const contentPaddingClass =
		layoutConfig.padding === 'none' ? 'p-0' : 'p-4 lg:p-6'

	const shellOverflowClass = 'overflow-hidden'

	return (
		<div className="relative h-screen overflow-hidden bg-gray-50 dark:bg-[#111111]">
			{/* Full-viewport background fill */}
			<div className="fixed inset-0 bg-gray-50 dark:bg-[#111111] -z-50" />

			{/* Dark mode decorative background shapes */}
			{theme === 'dark' && (
				<>
					<div
						className="pointer-events-none fixed top-[20%] left-[10%] h-[300px] w-[300px] rounded-full -z-10 bg-[radial-gradient(circle,_rgba(92,141,255,0.10)_0%,_transparent_70%)] animate-[float_6s_ease-in-out_infinite]"
					/>
					<div
						className="pointer-events-none fixed bottom-[20%] right-[10%] h-[200px] w-[200px] rounded-full -z-10 bg-[radial-gradient(circle,_rgba(64,255,255,0.10)_0%,_transparent_70%)] animate-[float_8s_ease-in-out_infinite_reverse]"
					/>
				</>
			)}

			<ProjectSidebar
				projectID={params.id}
				className="fixed h-[calc(100vh)] w-[120px] top-[60px] z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
			/>
			<div className={`mx-auto w-[calc(100%)] pl-[120px] lg:pl-[140px] pt-14 pr-4 lg:pr-6 pb-4 flex-grow lg:flex h-[calc(100vh)] ${shellOverflowClass} transition-all duration-300`}>
				
				<div className="ml-0 min-w-0 flex-1 w-full py-4 mt-2">
					
					<div
						className={`border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-white dark:bg-[var(--surface)] lg:min-w-0 lg:flex-1 ${contentHeightClass} ${contentOverflowClass} ${contentPaddingClass}`}
					>
						<Outlet className="outlet h-max" />
					</div>
				</div>
			</div>
		</div>
	)
}
