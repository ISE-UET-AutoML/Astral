import React, { useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PATHS } from 'src/constants/paths'
import useAuth from 'src/features/auth/hooks/useAuth'
import clsx from 'clsx'
import { useTheme } from 'src/theme/ThemeProvider'
import { SunIcon, Moon as MoonIcon } from 'lucide-react'

const NavBar = () => {
	const [navbarOpen, setNavbarOpen] = useState(false)
	const [hoveredItem, setHoveredItem] = useState(null)
	const [scrolled, setScrolled] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()
	const { authed, logout: authLogout, user } = useAuth() as {
		authed: boolean
		logout: () => void
		user?: {
			name?: string
			username?: string
			email?: string
			avatarUrl?: string
		}
	}
	const { theme, toggle } = useTheme()
	const logoSrc = theme === 'light' ? '/BlackLogo.svg' : '/PrimaryLogo.svg'

	useEffect(() => {
		const getScrollTop = () => {
			const winY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
			const layoutEl = document.querySelector('.ant-layout')
			const layoutY = layoutEl && typeof layoutEl.scrollTop === 'number' ? layoutEl.scrollTop : 0
			return Math.max(winY, layoutY)
		}
		const handleScroll = () => setScrolled(getScrollTop() > 0)
		const layoutEl = document.querySelector('.ant-layout')
		window.addEventListener('scroll', handleScroll, { passive: true })
		if (layoutEl) layoutEl.addEventListener('scroll', handleScroll, { passive: true })
		handleScroll()
		return () => {
			window.removeEventListener('scroll', handleScroll)
			if (layoutEl) layoutEl.removeEventListener('scroll', handleScroll)
		}
	}, [])

	useEffect(() => {
		const y = window.pageYOffset || document.documentElement.scrollTop || 0
		setScrolled(y > 0)
	}, [location.pathname])

	const logout = () =>
		new Promise<void>((resolve) => {
			authLogout()
			navigate('/', { replace: true })
			resolve()
		})

	const publicNavigationItems = [
		{ name: 'ABOUT', href: '#about' },
		{ name: 'PRICING', href: '#pricing' },
	]
	const authNavigationItems = [
		{ name: 'PROJECTS', href: PATHS.PROJECTS },
		{ name: 'DATASETS', href: PATHS.DATASETS },
	]

	const isActive = (href) => location.pathname === href || location.pathname.startsWith(href)

	const handleNavigation = (href) => {
		if (href.startsWith('#')) {
			document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
		} else {
			navigate(href)
		}
	}

	return (
		<header
			className={clsx(
				'fixed top-0 z-40 w-full border-b transition-[border-color,box-shadow] duration-200',
				'bg-white border-gray-200',
				'dark:bg-[#030712] dark:border-white/10',
				scrolled && 'shadow-sm dark:shadow-none dark:border-white/15'
			)}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Left: Logo */}
					<div className="flex-shrink-0">
						<img
							src={logoSrc}
							alt="ASTRAL"
							className="h-10 w-auto cursor-pointer transition-transform duration-300 hover:scale-105"
							onClick={() => navigate('/')}
						/>
					</div>

					{/* Center: Nav items */}
					<div className="hidden md:block">
						<div className="flex items-baseline space-x-8">
							{(authed ? authNavigationItems : publicNavigationItems).map((item) => (
								<div
									key={item.name}
									className="relative"
									onMouseEnter={() => setHoveredItem(item.name)}
									onMouseLeave={() => setHoveredItem(null)}
								>
									<button
										onClick={() => handleNavigation(item.href)}
										className={clsx(
											'px-3 py-2 text-sm font-bold transition-all duration-200 relative text-gray-900 dark:text-white',
											isActive(item.href) ? 'opacity-100' : 'opacity-75 hover:opacity-100'
										)}
									>
										{item.name}
										{/* Animated underline */}
										<div
											className={clsx(
												'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#5C8DFF] to-[#65FFA0] rounded-full transition-all duration-300',
												hoveredItem === item.name || isActive(item.href)
													? 'w-full opacity-100'
													: 'w-0 opacity-0'
											)}
										/>
									</button>
								</div>
							))}
						</div>
					</div>

					{/* Right: Theme + Login/Profile */}
					<div className="hidden md:flex items-center gap-2">
						{authed ? (
							<Menu as="div" className="relative">
								<div>
									<Menu.Button className="transition flex gap-2 rounded-xl text-sm focus:outline-none py-2 px-3 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/15">
										<span className="font-regular">
											{user?.name || user?.username || user?.email || 'User'}
										</span>
										<img
											className="h-6 w-6 border-2 border-blue-500 rounded-full"
											src={user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
											alt=""
										/>
									</Menu.Button>
								</div>
								<Transition
									as={Fragment}
									enter="transition ease-out duration-200"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
								>
									<Menu.Items className="absolute right-0 z-10 mt-2 w-56 min-w-[14rem] bg-white dark:bg-[#0f172a] rounded-xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden focus:outline-none">
										<Menu.Item>
											{({ active }) => (
												<button
													onClick={() => navigate(PATHS.PROFILE)}
													className={clsx(
														'block w-full text-left px-3 py-3 text-sm transition-all duration-200 rounded-none',
														active
															? 'text-gray-900 dark:text-white bg-gray-200 dark:bg-white/10'
															: 'text-gray-600 dark:text-gray-300'
													)}
												>
													Your Profile
												</button>
											)}
										</Menu.Item>
										<Menu.Item>
											{({ active }) => (
												<button
													onClick={() => navigate(PATHS.SETTINGS)}
													className={clsx(
														'block w-full text-left px-3 py-3 text-sm border-b border-gray-200 dark:border-white/10 transition-all duration-200 rounded-none',
														active
															? 'text-gray-900 dark:text-white bg-gray-200 dark:bg-white/10'
															: 'text-gray-600 dark:text-gray-300'
													)}
												>
													Settings
												</button>
											)}
										</Menu.Item>
										<Menu.Item>
											{({ active }) => (
												<button
													onClick={async () => await logout()}
													className={clsx(
														'block w-full text-left px-3 py-3 text-sm transition-all duration-200 rounded-none',
														active
															? 'text-gray-900 dark:text-white bg-gray-200 dark:bg-white/10'
															: 'text-gray-600 dark:text-gray-300'
													)}
												>
													Sign out
												</button>
											)}
										</Menu.Item>
									</Menu.Items>
								</Transition>
							</Menu>
						) : (
							<button
								onClick={() => navigate('/login')}
								className="px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-400/50 hover:from-blue-600 hover:to-blue-700"
							>
								Login
							</button>
						)}
						<button
							onClick={toggle}
							aria-label="Toggle theme"
							className="ml-2 h-9 w-9 rounded-full grid place-items-center transition bg-gray-100 dark:bg-white/10 border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20"
						>
							{theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
						</button>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setNavbarOpen(!navbarOpen)}
							className="bg-gray-200 dark:bg-white/10 dark:border dark:border-white/10 inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-white/15 focus:outline-none"
						>
							<span className="sr-only">Open main menu</span>
							{navbarOpen ? (
								<svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							) : (
								<svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							)}
						</button>

						{/* Mobile menu panel */}
						{navbarOpen && (
							<div className="absolute top-16 left-0 right-0 bg-white dark:bg-[#030712] border-t border-gray-200 dark:border-white/10">
								<div className="px-2 pt-2 pb-3 space-y-1">
									{(authed ? authNavigationItems : publicNavigationItems).map((item) => (
										<button
											key={item.name}
											onClick={() => {
												handleNavigation(item.href)
												setNavbarOpen(false)
											}}
											className="block w-full text-left px-3 py-2 text-base font-medium opacity-80 hover:opacity-100 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
										>
											{item.name}
										</button>
									))}
									{!authed && (
										<button
											onClick={() => { navigate('/login'); setNavbarOpen(false) }}
											className="block w-full text-center px-3 py-2 text-base font-medium text-white bg-gray-800 hover:bg-gray-700 mt-4 rounded-full"
										>
											Login
										</button>
									)}
									{authed && (
										<button
											onClick={async () => { await logout(); setNavbarOpen(false) }}
											className="block w-full text-center px-3 py-2 text-base font-medium text-white bg-red-800 hover:bg-red-700 mt-4 rounded-full"
										>
											Sign out
										</button>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}

export default NavBar
