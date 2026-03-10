import { useRef, useEffect } from 'react'
import autogluon from 'src/assets/collab/autogluon.png'
import google from 'src/assets/collab/google.png'
import mobifone from "src/assets/collab/mobifone.jpeg"
import scopus from 'src/assets/collab/scopus.png'
import snsLink from 'src/assets/collab/sns_link.png'
import vast from 'src/assets/collab/vast.png'
import viettel from 'src/assets/collab/Viettel-without_slogan-01_34bf1bf614.png'
import pytorch from 'src/assets/collab/pytorch_logo.png'
import vnulict from 'src/assets/collab/vnulic.png'
import h2o from 'src/assets/collab/h2o.png'

const logos = [
	{ src: google, alt: 'Google' },
	{ src: autogluon, alt: 'AutoGluon' },
	{ src: mobifone, alt: 'Mobifone' },
	{ src: scopus, alt: 'Scopus' },
	{ src: snsLink, alt: 'SNS Link' },
	{ src: vast, alt: 'VAST' },
	{ src: viettel, alt: 'Viettel' },
	{ src: pytorch, alt: 'PyTorch' },
	{ src: h2o, alt: 'H2O' },
	{ src: vnulict, alt: 'VNULICT' },
]

const CollabMarquee = () => {
	const trackRef = useRef(null)
	const rafRef = useRef(null)
	const xRef = useRef(0)

	useEffect(() => {
		const track = trackRef.current
		if (!track) return

		const speed = 0.6
		let trackWidth = track.scrollWidth / 2

		const step = () => {
			xRef.current -= speed
			if (Math.abs(xRef.current) >= trackWidth) {
				xRef.current = 0
			}
			track.style.transform = `translateX(${xRef.current}px)`
			rafRef.current = requestAnimationFrame(step)
		}

		rafRef.current = requestAnimationFrame(step)
		return () => cancelAnimationFrame(rafRef.current)
	}, [])

	const doubled = [...logos, ...logos]

	return (
		<section className="py-12 mt-[200px]">
			<p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 tracking-widest uppercase">
				Trusted & Collaborated with
			</p>

			<div
				className="overflow-hidden relative"
				style={{
					maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
					WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
				}}
			>
				<div ref={trackRef} className="flex gap-16 items-center w-max">
					{doubled.map((logo, i) => (
						<div
							key={i}
							className="flex items-center justify-center h-30 w-50 shrink-0 rounded-xl bg-white/90 dark:bg-gray-800/90 px-4 py-2 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
						>
							<img
								src={logo.src}
								alt={logo.alt}
								className="max-h-20 min-w-[130px] object-contain"
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default CollabMarquee
