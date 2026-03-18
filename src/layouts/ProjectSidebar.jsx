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
			<div className="h-full flex flex-col">
				<div className="flex-1 min-h-0" />
				<div className="px-2 flex flex-col items-center w-full shrink-0">
					<nav className="flex flex-col gap-5 w-full">
						{navigation.map((item) => (
							<NavLink
								key={item.name}
								to={item.href}
								className={({ isActive }) =>
									clsx(
										'group flex flex-col items-center justify-center text-xs font-medium w-full',
										'relative rounded-2xl py-3 transition-all duration-300',
										isActive
											? 'bg-blue-50 dark:bg-white/15 border border-blue-200 dark:border-white/40 shadow-sm dark:shadow-[0_0_12px_rgba(255,255,255,0.08)]'
											: 'hover:bg-gray-100/50 dark:hover:bg-white/5 border border-transparent'
									)
								}
							>
								{({ isActive }) => (
									<>
										<div className="flex justify-center w-full">
											<item.icon
												className={clsx(
													'flex-shrink-0 w-7 h-7 mb-2 transition-all duration-300',
												isActive
													? 'text-blue-600 dark:text-white'
													: 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 group-hover:scale-110'
											)}
											/>
										</div>
										<span
											className={clsx(
												'text-[11px] text-center font-medium transition-all duration-300 leading-tight block w-full',
												isActive
													? 'text-blue-600 dark:text-white font-semibold'
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
				</div>
				<div className="flex-1 min-h-0" />
				<div className="px-2 pb-6 shrink-0">
					<NavLink
						to={PATHS.PROJECT_SETTINGS(projectID)}
						className={({ isActive }) =>
							clsx(
								'group flex flex-col items-center justify-center text-xs font-medium w-full py-3 rounded-2xl transition-all duration-300',
								isActive
									? 'bg-blue-50 dark:bg-white/15 border border-blue-200 dark:border-white/40 shadow-sm dark:shadow-[0_0_12px_rgba(255,255,255,0.08)] text-blue-600 dark:text-white'
									: 'hover:bg-gray-100/50 dark:hover:bg-white/5 border border-transparent text-gray-500 dark:text-gray-400'
							)
						}
					>
						{({ isActive }) => (
							<>
								<div className="flex justify-center w-full">
									<SettingIcon
										className={clsx(
											"flex-shrink-0 w-7 h-7 mb-2 transition-transform duration-300 group-hover:scale-110",
											isActive
												? "text-blue-600 dark:text-white"
												: "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
										)}
									/>
								</div>
								<span className="text-[11px] text-center leading-tight block w-full">Settings</span>
							</>
						)}
					</NavLink>
				</div>
			</div>
		</div >
	)
}

export default ProjectSidebar
