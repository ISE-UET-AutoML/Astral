import React from 'react'
import { Button } from 'src/components/ui/button'
import ContentContainer from '../ContentContainer'

const FooterSection = () => {
	return (
		<footer className="relative">
			{/* Getting Started CTA Section */}
			<section className="py-24 relative" className="bg-[#1a1a1a] z-[20]">
				<ContentContainer>
					<div className="text-center">
						<p 
							className="text-gray-400 text-sm mb-4 uppercase tracking-wider"
							className="font-poppins"
						>
							Getting Started
						</p>
						<h2 
							className="text-4xl md:text-5xl font-bold text-white mb-6"
							className="font-poppins"
						>
							Build your first AI with{' '}
							<span 
								className="bg-gradient-to-r from-[#5C8DFF] to-[#65FFA0] bg-clip-text text-transparent"
								className="font-['Russo_One',_sans-serif]"
							>
								ASTRAL
							</span>!
						</h2>
						<p 
							className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto"
							className="font-poppins"
						>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, consectetur adipiscing elit, sed do eiusmod tempor
						</p>
						<Button
							href="/login"
							variant="gradientHover"
							size="lg"
							className="px-12 py-4"
						>
							START NOW
						</Button>
					</div>
				</ContentContainer>
			</section>

			{/* Main Footer */}
			<section className="py-16 bg-gray-100 text-gray-800">
				<ContentContainer>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
						{/* Brand Section */}
						<div className="lg:col-span-2">
							<div className="mb-4">
								<h3 
									className="text-3xl font-bold text-gray-900"
									className="font-['Russo_One',_sans-serif]"
								>
									ASTRAL
								</h3>
								<p 
									className="text-gray-600 mt-2"
									className="font-poppins"
								>
									Automated System TRAL
								</p>
							</div>
							
							{/* Legal Links */}
							<div className="flex flex-wrap gap-6 text-sm">
								<a 
									href="#terms" 
									className="text-gray-600 hover:text-gray-900 transition-colors"
									className="font-poppins"
								>
									Term of service
								</a>
								<a 
									href="#privacy" 
									className="text-gray-600 hover:text-gray-900 transition-colors"
									className="font-poppins"
								>
									Privacy Policy
								</a>
							</div>
						</div>

						{/* Home Column */}
						<div>
							<h4 
								className="font-bold text-gray-900 mb-4"
								className="font-poppins"
							>
								Home
							</h4>
							{/* This column appears to be just the header in the image */}
						</div>

						{/* Features Column */}
						<div>
							<h4 
								className="font-bold text-gray-900 mb-4"
								className="font-poppins"
							>
								Features
							</h4>
							<ul className="space-y-3">
								<li>
									<a 
										href="#workspace" 
										className="text-gray-600 hover:text-gray-900 transition-colors"
										className="font-poppins"
									>
										Workspace
									</a>
								</li>
								<li>
									<a 
										href="#calendar" 
										className="text-gray-600 hover:text-gray-900 transition-colors"
										className="font-poppins"
									>
										Calendar
									</a>
								</li>
							</ul>
						</div>

						{/* Company & Follow us Column */}
						<div>
							{/* Company Section */}
							<div className="mb-8">
								<h4 
									className="font-bold text-gray-900 mb-4"
									className="font-poppins"
								>
									Company
								</h4>
								<ul className="space-y-3">
									<li>
										<a 
											href="#about" 
											className="text-gray-600 hover:text-gray-900 transition-colors"
											className="font-poppins"
										>
											About us
										</a>
									</li>
									<li>
										<a 
											href="#contact" 
											className="text-gray-600 hover:text-gray-900 transition-colors"
											className="font-poppins"
										>
											Contact
										</a>
									</li>
								</ul>
							</div>

							{/* Follow us Section */}
							<div>
								<h4 
									className="font-bold text-gray-900 mb-4"
									className="font-poppins"
								>
									Follow us
								</h4>
								<ul className="space-y-3">
									<li>
										<a 
											href="#facebook" 
											className="text-gray-600 hover:text-gray-900 transition-colors"
											className="font-poppins"
										>
											Facebook
										</a>
									</li>
									<li>
										<a 
											href="#instagram" 
											className="text-gray-600 hover:text-gray-900 transition-colors"
											className="font-poppins"
										>
											Instagram
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</ContentContainer>
			</section>
		</footer>
	)
}

export default FooterSection
