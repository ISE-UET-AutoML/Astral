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
				'bg-white dark:bg-[#141821] border-r border-gray-200 dark:border-white/10 backdrop-blur-sm',
				'w-[120px] fixed top-[60px] left-0 bottom-0 h-[calc(100vh-60px)] overflow-hidden',
				'duration-300',
				className
			)}
		>
			<div className="h-full flex flex-grow flex-col">
				<div className="py-6 flex flex-grow flex-col justify-between">
					<nav className="flex flex-col gap-2 px-2 pb-4">
						{navigation.map((item) => (
							<NavLink
								key={item.name}
								to={item.href}
								className={({ isActive }) =>
									clsx(
										'group flex flex-col items-center justify-center text-sm font-medium',
										'relative rounded-2xl mx-2 my-1.5 px-2 py-3 transition-all duration-300',
										isActive
											? 'bg-blue-500/10 dark:bg-blue-400/20 border border-blue-500/40 dark:border-blue-400/40 shadow-md'
											: 'hover:bg-blue-500/5 dark:hover:bg-blue-400/10 hover:translate-x-0.5'
									)
								}
							>
								{({ isActive }) => (
									<>
										<item.icon
											className={clsx(
												'mx-auto flex-shrink-0 rounded-xl w-10 h-10 p-2 transition-all duration-300',
												isActive
													? 'text-blue-500 dark:text-blue-400'
													: 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:scale-110'
											)}
										/>
										<span
											className={clsx(
												'text-xs mt-1 font-medium transition-all duration-300',
												isActive
													? 'text-blue-500 dark:text-blue-400 font-semibold'
													: 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
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
								'group flex flex-col items-center text-sm font-medium px-2 py-3 rounded-lg transition-all duration-300',
								'border-t border-gray-200 dark:border-white/10 mt-4 pt-4 mx-2',
								isActive
									? 'text-blue-500 dark:text-blue-400'
									: 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:translate-x-0.5'
							)
						}
					>
						<SettingIcon
							className="flex-shrink-0 rounded-xl w-10 h-10 px-2 py-2 group-hover:scale-110 transition-transform duration-300"
						/>
						<span className="text-xs mt-1">Settings</span>
					</NavLink>
				</div>
			</div>
		</div>
	)
}

export default ProjectSidebar
