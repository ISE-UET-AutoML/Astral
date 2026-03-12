import React from 'react'
import { useTheme } from 'src/theme/ThemeProvider'
import LandingNavbar from './LandingNavbar'
import HeroSection from './HeroSection'
import CollabMarquee from './CollabMarquee'
import ServicesSection from './ServicesSection'
import ShowcaseSection from './ShowcaseSection'
import FooterSection from './FooterSection'
import DecorativeBlocks from './DecorativeBlocks'

/**
 * LandingPage - Main wrapper component for the landing page
 * 
 * This component handles:
 * - Overall page layout and styling
 * - Scroll state management
 * - Background and positioning
 * - Section organization
 */
const LandingPage = () => {
	const { theme } = useTheme()
	const [navbarOpen, setNavbarOpen] = React.useState(false)
	const [scrolled, setScrolled] = React.useState(false)

	React.useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 50
			setScrolled(isScrolled)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const isDark = theme === 'dark'
	const bgClass = isDark ? 'bg-theme-gradient' : 'bg-gray-50'
	const textClass = isDark ? 'text-white' : 'text-gray-900'

	return (
		<div 
			className={`min-h-screen relative ${bgClass} ${textClass}`}
		>
			{/* Full-viewport background fill following app theme */}
			<div className={`absolute inset-0 ${bgClass} -z-[100]`} />
			{/* Decorative sea blue blocks */}
			<DecorativeBlocks />
			
			{/* Navigation / orbital logo layer (positioned below fixed global NavBar) */}
			<div className="pt-24">
				<LandingNavbar 
					scrolled={scrolled}
					navbarOpen={navbarOpen}
					setNavbarOpen={setNavbarOpen}
				/>
			</div>
			
			{/* Content Sections */}
			<main className="relative z-[20]">
				<HeroSection />
				<CollabMarquee />
				<ServicesSection />
				<ShowcaseSection />
				<FooterSection />
				
				{/* 
				Future sections can be easily added here:
				<AboutSection />
				<FeaturesSection />
				<TestimonialsSection />
				<PricingSection />
				<ContactSection />
				*/}
			</main>
		</div>
	)
}

export default LandingPage
