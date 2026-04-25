/**
 * Landing Page Components Barrel Export
 * 
 * This allows for clean imports like:
 * import { LandingPage, HeroSection } from 'src/features/landing/components'
 * 
 * Or individual imports:
 * import LandingPage from 'src/features/landing/components/LandingPage'
 */

// Main landing page wrapper
export { default as LandingPage } from './LandingPage'

// Individual sections (for flexibility)
export { default as LandingNavbar } from './LandingNavbar'
export { default as HeroSection } from './HeroSection'
export { default as ServicesSection } from './ServicesSection'

// Default export is the main page
export { default } from './LandingPage'
