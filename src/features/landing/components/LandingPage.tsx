import React from 'react'
import { useTheme } from 'src/theme/ThemeProvider'
import LandingNavbar from './LandingNavbar'
import HeroSection from './HeroSection'
import CollabMarquee from './CollabMarquee'
import ServicesSection from './ServicesSection'
import ShowcaseSection from './ShowcaseSection'
import FooterSection from './FooterSection'
import DecorativeBlocks from './DecorativeBlocks'
import DecorativeBlocksRevert from './DecorativeBlockRevert'
import LandingMotionFX from './LandingMotionFX'
import { useLandingPageAnime } from '../hooks/useLandingPageAnime'

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
	const landingRootRef = React.useRef<HTMLDivElement>(null)
	const [navbarOpen, setNavbarOpen] = React.useState(false)
	const [scrolled, setScrolled] = React.useState(false)

	useLandingPageAnime(landingRootRef)

	React.useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 50
			setScrolled(isScrolled)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const isDark = theme === 'dark'
	const bgClass = isDark
		? 'landing-hero-atmosphere'
		: 'landing-hero-atmosphere-light'
	const textClass = isDark ? 'text-white' : 'text-gray-900'

	return (
		<div
			ref={landingRootRef}
			className={`min-h-screen relative overflow-x-hidden ${bgClass} ${textClass}`}
		>
			<div
				data-landing="orb"
				className="pointer-events-none absolute -top-36 right-[-10%] h-[min(58vw,560px)] w-[min(58vw,560px)] rounded-full -z-[95] opacity-0 mix-blend-screen blur-[42px] bg-[radial-gradient(circle_at_35%_35%,rgba(101,255,160,0.38),rgba(92,141,255,0.16)_48%,transparent_72%)]"
				aria-hidden
			/>
			{/* Full-viewport background fill following app theme */}
			<div className={`absolute inset-0 ${bgClass} -z-[100]`} />
			<LandingMotionFX />
			{/* Decorative sea blue blocks */}
			<DecorativeBlocks />
			
			{/* Navigation / orbital logo layer (positioned below fixed global NavBar) */}
			<div className="pt-16">
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

				{/* Bottom decorative layer (kept, but clipped to avoid extra page height) */}
				<div
					className="pointer-events-none absolute inset-x-0 bottom-[1600px] h-[1200px] overflow-hidden z-[1]"
					aria-hidden="true"
				>
					<DecorativeBlocks />
					<DecorativeBlocksRevert />
				</div>
				<div
					className="pointer-events-none absolute inset-x-0 bottom-[600px] h-[1200px] overflow-hidden z-[1]"
					aria-hidden="true"
				>
					
					<DecorativeBlocksRevert />
				</div>
				
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
	);
};

export default LandingPage;
