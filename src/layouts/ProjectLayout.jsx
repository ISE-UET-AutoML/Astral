import { Outlet, useParams } from 'react-router-dom'
import ProjectSidebar from 'src/layouts/ProjectSidebar'
import { useTheme } from 'src/theme/ThemeProvider'

export default function ProjectLayout() {
	const params = useParams()
	const { theme } = useTheme()

	return (
		<div className="relative min-h-screen bg-white dark:bg-[#01000A]">
			{/* Full-viewport background fill */}
			<div className="fixed inset-0 bg-white dark:bg-[#01000A] -z-50" />

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
				className="fixed h-[calc(100vh-60px)] w-[80px] top-[60px] z-50"
			/>
			<div className="mx-auto w-[calc(100%-80px)] pl-[60px] pt-12 ml-[80px] mr-4 flex-grow lg:flex mt-4 min-h-[calc(100dvh-60px)] overflow-hidden">
				{/* Left sidebar & main wrapper */}
				<div className="min-w-0 flex-1 w-max xl:flex rounded-md">
					<div className="backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-[20px] shadow-lg bg-white dark:bg-[#141821] lg:min-w-0 lg:flex-1 min-h-[calc(100dvh-60px)]">
						<Outlet className="outlet h-max" />
					</div>
				</div>
			</div>
		</div>
	)
}
