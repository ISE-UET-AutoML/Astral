import React, { useState } from 'react'
import { useTheme } from 'src/theme/ThemeProvider'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

const LandingNavbar = ({ scrolled, navbarOpen, setNavbarOpen }) => {
	const { theme, toggle } = useTheme()
	const [hoveredItem, setHoveredItem] = useState(null)
	const [activeDropdown, setActiveDropdown] = useState(null)
	const [hideTimeout, setHideTimeout] = useState(null)

	// Navigation items with potential dropdowns
	const navigationItems = [
		{
			name: 'ABOUT',
			href: '#about',
			dropdownItems: [
				{ name: 'Our Story', href: '#story' },
				{ name: 'Team', href: '#team' },
				{ name: 'Mission', href: '#mission' }
			]
		},
		{
			name: 'PROJECTS',
			href: '/app/projects',
			dropdownItems: null // No dropdown for this one
		},
		{
			name: 'PRICING',
			href: '#pricing',
			dropdownItems: [
				{ name: 'Plans', href: '#plans' },
				{ name: 'Enterprise', href: '#enterprise' },
				{ name: 'Free Trial', href: '#trial' }
			]
		},
		{
			name: 'PROFILE',
			href: '#profile',
			dropdownItems: [
				{ name: 'Dashboard', href: '#dashboard' },
				{ name: 'Settings', href: '#settings' },
				{ name: 'Account', href: '#account' }
			]
		}
	]

	const handleMouseEnter = (itemName) => {
		// Clear any pending hide timeout
		if (hideTimeout) {
			clearTimeout(hideTimeout)
			setHideTimeout(null)
		}
		
		setHoveredItem(itemName)
		const item = navigationItems.find(nav => nav.name === itemName)
		if (item?.dropdownItems) {
			setActiveDropdown(itemName)
		} else {
			setActiveDropdown(null)
		}
	}

	const handleMouseLeave = () => {
		setHoveredItem(null)
		// Delay hiding dropdown to allow mouse movement to dropdown
		const timeout = setTimeout(() => {
			setActiveDropdown(null)
		}, 150)
		setHideTimeout(timeout)
	}

	const handleNavbarMouseLeave = () => {
		setHoveredItem(null)
		setActiveDropdown(null)
		if (hideTimeout) {
			clearTimeout(hideTimeout)
			setHideTimeout(null)
		}
	}

	return (
		<header 
			className="fixed top-0 w-full z-50 transition-all duration-300 pt-6 pb-6 shadow-md" 
			style={{ 
				backgroundColor: scrolled 
					? (theme === 'dark' ? 'rgba(26, 26, 26, 0.95)' : 'rgba(249, 250, 251, 0.95)')
					: 'transparent',
				backdropFilter: scrolled ? 'blur(10px)' : 'none',
				zIndex: 50,
				boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
			}}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Left: ASTRAL Logo */}
					<div className="flex-shrink-0">
						<img
							src="/PrimaryLogo.svg"
							alt="ASTRAL"
							className="h-10 w-auto cursor-pointer transition-transform duration-300 hover:scale-105"
							onClick={() => window.location.href = '/'}
						/>
					</div>

					{/* Center: Navigation Items */}
					<div className="hidden md:block">
						<div 
							className="flex items-baseline space-x-8"
							onMouseLeave={handleNavbarMouseLeave}
						>
							{navigationItems.map((item) => (
								<div 
									key={item.name}
									className="relative"
									onMouseEnter={() => handleMouseEnter(item.name)}
									onMouseLeave={handleMouseLeave}
								>
								<a
									href={item.href}
									className="px-3 py-2 text-sm font-bold text-gray-900 dark:text-white opacity-80 hover:opacity-100 transition-all duration-200 relative font-poppins"
								>
										{item.name}
										
										{/* Animated underline */}
										<div
											className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#5C8DFF] to-[#65FFA0] rounded-full transition-all duration-300 ${
												hoveredItem === item.name 
													? 'w-full opacity-100' 
													: 'w-0 opacity-0'
											}`}
										/>
									</a>

									{/* Dropdown Menu */}
									{item.dropdownItems && activeDropdown === item.name && (
										<div 
											className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-[#222222] bg-opacity-95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden z-[60]"
											onMouseEnter={() => {
												if (hideTimeout) {
													clearTimeout(hideTimeout)
													setHideTimeout(null)
												}
												setActiveDropdown(item.name)
											}}
											onMouseLeave={handleMouseLeave}
										>
											{/* Dropdown arrow */}
											<div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white dark:bg-[#222222] rotate-45 border-l border-t border-gray-200 dark:border-white/10"></div>
											
											{item.dropdownItems.map((dropdownItem, index) => (
												<a
													key={dropdownItem.name}
													href={dropdownItem.href}
													className={`block px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200 font-poppins ${
														index !== item.dropdownItems.length - 1 ? 'border-b border-gray-200 dark:border-white/10' : ''
													}`}
												>
													{dropdownItem.name}
												</a>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Right: Theme toggle + Login Button */}
					<div className="hidden md:flex items-center gap-4">
						<button
							type="button"
							onClick={toggle}
							className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
							title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
						>
							{theme === 'dark' ? (
								<SunIcon className="w-5 h-5" />
							) : (
								<MoonIcon className="w-5 h-5" />
							)}
						</button>
						<a 
							href="/login"
							className="bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors duration-200 font-poppins"
						>
							Login
						</a>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center gap-2">
						<button
							type="button"
							onClick={toggle}
							className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
						>
							{theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
						</button>
						<button
							onClick={() => setNavbarOpen(!navbarOpen)}
							className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
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
							<div className="absolute top-16 left-0 right-0 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
								<div className="px-2 pt-2 pb-3 space-y-1">
									<button
										type="button"
										onClick={() => { toggle(); setNavbarOpen(false); }}
										className="flex items-center gap-2 w-full px-3 py-2 text-base font-medium text-gray-900 dark:text-white opacity-80 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200"
									>
										{theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
										{theme === 'dark' ? 'Light mode' : 'Dark mode'}
									</button>
									<a href="#about" className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white opacity-80 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200">
										ABOUT
									</a>
									<a href="/app/projects" className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white opacity-80 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200">
										PROJECTS
									</a>
									<a href="#pricing" className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white opacity-80 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200">
										PRICING
									</a>
									<a href="#profile" className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white opacity-80 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200">
										PROFILE
									</a>
									<a href="/login" className="block w-full text-center px-3 py-2 text-base font-medium text-white bg-gray-800 hover:bg-gray-700 mt-4 rounded-full">
										Login
									</a>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}

export default LandingNavbar
