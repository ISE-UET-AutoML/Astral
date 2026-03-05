import {
	BuildIcon,
	SettingIcon,
	ModelIcon,
	DeployIcon,
	TasksIcon,
	InfoIcon,
	MyAppIcon,
} from 'src/components/shared/utilities/icons'
import clsx from 'clsx'
import { PATHS } from 'src/constants/paths'
import { NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const ProjectSidebar = ({ projectID, className }) => {
	const location = useLocation()

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'auto' })
	}, [location.pathname])

	const navigation = [
		{ name: 'Info', href: PATHS.PROJECT_INFO(projectID), icon: InfoIcon },
		{ name: 'Build', href: PATHS.PROJECT_BUILD(projectID), icon: BuildIcon },
		{ name: 'Experiment', href: PATHS.PROJECT_EXPERIMENT(projectID), icon: TasksIcon },
		{ name: 'Model', href: PATHS.PROJECT_MODEL(projectID), icon: ModelIcon },
		{ name: 'Deploy', href: PATHS.PROJECT_DEPLOY(projectID), icon: DeployIcon },
		{ name: 'My Apps', href: PATHS.PROJECT_MY_APPS(projectID), icon: MyAppIcon },
	]

	return (
		<div
			className={clsx(
				'bg-[var(--surface)] border-r border-gray-200 dark:border-white/10 z-50',
				'w-[120px] fixed top-[60px] left-0 bottom-0 h-[calc(100vh-60px)] overflow-hidden',
				'duration-300',
				className
			)}
		>
			<div className="h-full flex flex-grow flex-col">
				<div className="py-6 flex flex-grow flex-col justify-between items-center">
					<nav className="flex flex-col gap-2 px-3 pb-4 w-full">
						{navigation.map((item) => (
							<NavLink
								key={item.name}
								to={item.href}
								className={({ isActive }) =>
									clsx(
										'group flex flex-col items-center justify-center text-xs font-medium w-full',
										'relative rounded-2xl py-3 transition-all duration-300',
										isActive
											? 'bg-transparent border border-gray-200 dark:border-white/20'
											: 'hover:bg-gray-100/50 dark:hover:bg-white/5 border border-transparent'
									)
								}
							>
								{({ isActive }) => (
									<>
										<item.icon
											className={clsx(
												'mx-auto flex-shrink-0 w-7 h-7 mb-2 transition-all duration-300',
												isActive
													? 'text-gray-800 dark:text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
													: 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 group-hover:scale-110'
											)}
										/>
										<span
											className={clsx(
												'text-[11px] text-center font-medium transition-all duration-300 leading-tight',
												isActive
													? 'text-gray-800 dark:text-white font-semibold'
													: 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
											)}
										>
											{item.name}
										</span>
									</>
								)}
							</NavLink>
						))}
					</nav>

					<NavLink
						to={PATHS.PROJECT_SETTINGS(projectID)}
						className={({ isActive }) =>
							clsx(
								'group flex flex-col items-center justify-center text-xs font-medium w-[calc(100%-24px)] py-3 rounded-2xl transition-all duration-300',
								'mt-auto',
								isActive
									? 'bg-transparent border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white'
									: 'hover:bg-gray-100/50 dark:hover:bg-white/5 border border-transparent text-gray-500 dark:text-gray-400'
							)
						}
					>
						<SettingIcon
							className={clsx(
								"flex-shrink-0 w-7 h-7 mb-2 transition-transform duration-300 group-hover:scale-110",
								"group-hover:text-gray-700 dark:group-hover:text-gray-200"
							)}
						/>
						<span className="text-[11px] leading-tight">Settings</span>
					</NavLink>
				</div>
			</div >
		</div >
	)
}

export default ProjectSidebar
