import { Outlet, useParams } from 'react-router-dom'
import ProjectSidebar from 'src/layouts/ProjectSidebar'
import { useTheme } from 'src/theme/ThemeProvider'

export default function ProjectLayout() {
	const params = useParams()
	const { theme } = useTheme()

	return (
		<div className="relative min-h-screen bg-gray-50 dark:bg-[#111111]">
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
			<div className="mx-auto w-[calc(100%)] pl-[120px] lg:pl-[140px] pt-12 pr-4 lg:pr-6 flex-grow lg:flex mt-4 min-h-[calc(100dvh)] overflow-hidden transition-all duration-300">
				{/* Thêm margin-left để content không bị khuất bởi sidebar */}
				<div className="ml-0 min-w-0 flex-1 w-full py-4">
					{/* Card với padding để con không bị border đè */}
					<div className="border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm bg-white dark:bg-[var(--surface)] lg:min-w-0 lg:flex-1 min-h-[calc(100dvh-100px)] overflow-y-auto overflow-x-hidden p-4 lg:p-6">
						<Outlet className="outlet h-max" />
					</div>
				</div>
			</div>
		</div>
	)
}
