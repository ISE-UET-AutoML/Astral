import React, { useState, useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons'

const LunarNewYearTheme = () => {
	const [isVisible, setIsVisible] = useState(false)
	const [isClosed, setIsClosed] = useState(false)

	useEffect(() => {
		// Check if user has already closed the theme
		const closed = localStorage.getItem('lunarNewYearThemeClosed')
		if (closed === 'true') {
			setIsClosed(true)
			return
		}

		setIsVisible(true)
	}, [])

	const handleClose = () => {
		setIsVisible(false)
		setIsClosed(true)
		localStorage.setItem('lunarNewYearThemeClosed', 'true')
	}

	if (!isVisible || isClosed) {
		return null
	}

	return (
		<>
			{/* Kumquat Tree - Bottom Left */}
			<div className="fixed bottom-20 left-8 z-50 pointer-events-none">
				<div className="relative animate-sway-gentle">
					{/* Tree Pot */}
					<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
						<div className="w-16 h-12 bg-gradient-to-b from-red-700 to-red-900 rounded-b-lg border-2 border-red-950">
							{/* Pot decoration - lucky pattern */}
							<div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-bold">
								福
							</div>
						</div>
						<div className="w-20 h-3 bg-red-800 rounded-t-sm -mt-1 mx-auto border-2 border-red-950"></div>
					</div>

					{/* Tree Trunk */}
					<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-3 h-16 bg-gradient-to-r from-amber-700 to-amber-900 rounded-sm"></div>

					{/* Tree Foliage */}
					<div className="relative bottom-24">
						{/* Main foliage circles */}
						<div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full relative shadow-lg mx-auto">
							{/* Kumquats */}
							<div className="absolute top-2 left-4 w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-md animate-bounce-slow"></div>
							<div
								className="absolute top-6 right-3 w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-md animate-bounce-slow"
								style={{ animationDelay: '0.3s' }}
							></div>
							<div
								className="absolute bottom-4 left-6 w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-md animate-bounce-slow"
								style={{ animationDelay: '0.6s' }}
							></div>
							<div
								className="absolute bottom-6 right-5 w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-md animate-bounce-slow"
								style={{ animationDelay: '0.9s' }}
							></div>
							<div className="absolute top-10 left-2 w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-md"></div>
							<div className="absolute bottom-2 right-2 w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-md"></div>
						</div>
						{/* Additional foliage */}
						<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-md">
							<div className="absolute top-2 left-3 w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-md"></div>
							<div className="absolute bottom-2 right-2 w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-md"></div>
						</div>
					</div>

					{/* Red ribbon on tree */}
					<div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 w-8 h-16 overflow-hidden">
						<div className="w-6 h-20 bg-gradient-to-b from-red-500 to-red-700 transform rotate-6 animate-wave-ribbon"></div>
					</div>
				</div>
			</div>

			{/* Lion Dance - Bottom Right */}
			<div className="fixed bottom-20 right-8 z-50 pointer-events-none">
				<div className="relative animate-lion-dance">
					{/* Lion Head */}
					<div className="relative">
						{/* Main Head */}
						<div className="w-24 h-20 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-t-3xl rounded-b-lg relative border-4 border-yellow-500 shadow-xl">
							{/* Forehead decoration */}
							<div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-full border-2 border-yellow-700">
								<div className="text-center text-red-700 font-bold text-xs mt-0.5">
									王
								</div>
							</div>

							{/* Eyes */}
							<div className="absolute top-7 left-2 w-7 h-7 bg-white rounded-full border-2 border-yellow-500 animate-blink-lion">
								<div className="absolute top-1 left-1.5 w-4 h-4 bg-black rounded-full">
									<div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
								</div>
							</div>
							<div className="absolute top-7 right-2 w-7 h-7 bg-white rounded-full border-2 border-yellow-500 animate-blink-lion">
								<div className="absolute top-1 left-1.5 w-4 h-4 bg-black rounded-full">
									<div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
								</div>
							</div>

							{/* Eyebrows - bushy */}
							<div className="absolute top-4 left-1 w-8 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full transform -rotate-12"></div>
							<div className="absolute top-4 right-1 w-8 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full transform rotate-12"></div>

							{/* Nose */}
							<div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full border-2 border-pink-700">
								<div className="flex justify-center gap-1 mt-1">
									<div className="w-1 h-1 bg-pink-800 rounded-full"></div>
									<div className="w-1 h-1 bg-pink-800 rounded-full"></div>
								</div>
							</div>

							{/* Mouth */}
							<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-gradient-to-b from-red-800 to-red-900 rounded-b-xl border-2 border-yellow-500 animate-mouth-open">
								{/* Teeth */}
								<div className="flex justify-around pt-0.5">
									<div className="w-2 h-2 bg-white rounded-sm"></div>
									<div className="w-2 h-2 bg-white rounded-sm"></div>
									<div className="w-2 h-2 bg-white rounded-sm"></div>
								</div>
							</div>

							{/* Ears */}
							<div className="absolute -top-2 -left-3 w-6 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-full border-2 border-yellow-500 transform -rotate-12">
								<div className="w-3 h-4 bg-gradient-to-b from-pink-300 to-pink-500 rounded-full mx-auto mt-1"></div>
							</div>
							<div className="absolute -top-2 -right-3 w-6 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-full border-2 border-yellow-500 transform rotate-12">
								<div className="w-3 h-4 bg-gradient-to-b from-pink-300 to-pink-500 rounded-full mx-auto mt-1"></div>
							</div>

							{/* Fur/Mane */}
							<div className="absolute -bottom-4 left-0 right-0 flex justify-around">
								{[...Array(6)].map((_, i) => (
									<div
										key={`fur-${i}`}
										className="w-3 h-6 bg-gradient-to-b from-white to-gray-200 rounded-b-full animate-wave-fur"
										style={{
											animationDelay: `${i * 0.1}s`,
										}}
									></div>
								))}
							</div>
						</div>

						{/* Body (fabric) */}
						<div className="w-20 h-20 mx-auto -mt-2 relative">
							<div
								className="w-full h-full bg-gradient-to-b from-red-600 via-yellow-500 to-red-600 rounded-lg animate-body-wave"
								style={{
									background:
										'repeating-linear-gradient(45deg, #dc2626, #dc2626 10px, #eab308 10px, #eab308 20px)',
								}}
							></div>
							{/* Sequin decorations */}
							<div className="absolute top-2 left-2 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle"></div>
							<div
								className="absolute top-6 right-3 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle"
								style={{ animationDelay: '0.5s' }}
							></div>
							<div
								className="absolute bottom-4 left-4 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle"
								style={{ animationDelay: '1s' }}
							></div>
						</div>

						{/* Legs */}
						<div className="flex justify-center gap-6 -mt-2">
							<div className="w-6 h-8 bg-gradient-to-b from-red-600 to-red-800 rounded-b-lg animate-leg-left"></div>
							<div className="w-6 h-8 bg-gradient-to-b from-red-600 to-red-800 rounded-b-lg animate-leg-right"></div>
						</div>
					</div>
				</div>
			</div>

			{/* Falling Lucky Elements - Red Envelopes, Gold Coins, Flower Petals */}
			<div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">
				{/* Red Envelopes */}
				{[...Array(8)].map((_, i) => (
					<div
						key={`envelope-${i}`}
						className="absolute animate-fall-flutter"
						style={{
							left: `${10 + Math.random() * 80}%`,
							animationDelay: `${Math.random() * 6}s`,
							animationDuration: `${10 + Math.random() * 5}s`,
						}}
					>
						<div className="w-8 h-12 bg-gradient-to-b from-red-500 to-red-700 rounded-sm shadow-lg transform rotate-12 border border-red-800">
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
								<span className="text-red-700 text-xs font-bold">
									福
								</span>
							</div>
						</div>
					</div>
				))}

				{/* Gold Coins */}
				{[...Array(10)].map((_, i) => (
					<div
						key={`coin-${i}`}
						className="absolute animate-fall-spin"
						style={{
							left: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 8}s`,
							animationDuration: `${8 + Math.random() * 4}s`,
						}}
					>
						<div className="w-6 h-6 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full shadow-lg border-2 border-yellow-700">
							<div className="w-3 h-3 bg-yellow-300 rounded-full mx-auto mt-1"></div>
						</div>
					</div>
				))}

				{/* Mai/Đào Flower Petals */}
				{[...Array(15)].map((_, i) => (
					<div
						key={`petal-${i}`}
						className="absolute animate-petal-fall"
						style={{
							left: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 5}s`,
							animationDuration: `${6 + Math.random() * 4}s`,
							fontSize: `${14 + Math.random() * 10}px`,
						}}
					>
						{i % 2 === 0 ? '🌸' : '💮'}
					</div>
				))}
			</div>

			{/* Corner Decorations */}
			{/* Top Left - Lantern */}
			<div className="fixed top-4 left-4 z-50 pointer-events-none">
				<div className="animate-swing-lantern">
					<div className="relative">
						{/* Lantern top */}
						<div className="w-8 h-2 bg-yellow-600 rounded-t-lg mx-auto"></div>
						{/* Lantern body */}
						<div className="w-12 h-16 bg-gradient-to-b from-red-500 via-red-600 to-red-700 rounded-lg mx-auto border-2 border-yellow-500 shadow-lg relative overflow-hidden">
							<div className="absolute inset-0 flex items-center justify-center">
								<span className="text-yellow-400 font-bold text-lg">
									春
								</span>
							</div>
							{/* Glow effect */}
							<div className="absolute inset-0 bg-yellow-400 opacity-20 animate-pulse"></div>
						</div>
						{/* Lantern bottom */}
						<div className="w-8 h-2 bg-yellow-600 rounded-b-lg mx-auto"></div>
						{/* Tassel */}
						<div className="w-1 h-4 bg-yellow-600 mx-auto"></div>
						<div className="w-4 h-6 mx-auto">
							{[...Array(3)].map((_, i) => (
								<div
									key={i}
									className="w-0.5 h-4 bg-red-600 mx-0.5 inline-block animate-tassel"
									style={{ animationDelay: `${i * 0.1}s` }}
								></div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Top Right - Mai Flower Branch */}
			<div className="fixed top-4 right-4 z-50 pointer-events-none">
				<div className="animate-sway-flower">
					<div className="relative">
						{/* Branch */}
						<div className="w-1 h-12 bg-amber-800 transform rotate-45 absolute top-0 right-6"></div>
						{/* Flowers */}
						<div className="text-3xl absolute top-0 right-2 animate-bloom">
							🌼
						</div>
						<div
							className="text-2xl absolute top-4 right-8 animate-bloom"
							style={{ animationDelay: '0.3s' }}
						>
							🌼
						</div>
						<div
							className="text-2xl absolute top-8 right-0 animate-bloom"
							style={{ animationDelay: '0.6s' }}
						>
							🌼
						</div>
						<div
							className="text-xl absolute top-2 right-12 animate-bloom"
							style={{ animationDelay: '0.9s' }}
						>
							🌼
						</div>
					</div>
				</div>
			</div>

			{/* Bottom decorations - Bánh Chưng */}
			<div
				className="fixed bottom-24 left-28 z-50 pointer-events-none animate-bounce-slow"
				style={{ animationDelay: '0.5s' }}
			>
				<div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 relative">
					{/* Lá dong pattern */}
					<div className="absolute inset-1 border border-green-400"></div>
					<div className="absolute inset-2 bg-green-500 opacity-30"></div>
					{/* String ties */}
					<div className="absolute top-0 left-1/2 w-0.5 h-12 bg-green-900 transform -translate-x-1/2 -translate-y-1"></div>
					<div className="absolute left-0 top-1/2 h-0.5 w-12 bg-green-900 transform -translate-y-1/2 -translate-x-1"></div>
				</div>
			</div>

			{/* Firecracker String - Top */}
			<div className="fixed top-0 left-0 right-0 z-35 pointer-events-none">
				<div className="flex justify-around py-2 px-4">
					{[...Array(12)].map((_, i) => (
						<div
							key={`firecracker-${i}`}
							className="relative animate-firecracker-shake"
							style={{ animationDelay: `${i * 0.15}s` }}
						>
							{/* String */}
							<div className="w-0.5 h-3 bg-red-900 mx-auto"></div>
							{/* Firecracker body */}
							<div className="w-3 h-6 bg-gradient-to-b from-red-500 to-red-700 rounded-sm border border-red-800">
								{/* Gold bands */}
								<div className="w-full h-0.5 bg-yellow-500 mt-1"></div>
								<div className="w-full h-0.5 bg-yellow-500 mt-2"></div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Sparkle effects around screen */}
			<div className="fixed inset-0 z-25 pointer-events-none">
				{[...Array(8)].map((_, i) => (
					<div
						key={`sparkle-${i}`}
						className="absolute animate-sparkle-burst"
						style={{
							left: `${10 + i * 12}%`,
							top: `${20 + (i % 3) * 25}%`,
							animationDelay: `${i * 0.5}s`,
						}}
					>
						✨
					</div>
				))}
			</div>

			{/* Bottom banner with close button */}
			<div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-red-700 via-yellow-600 to-red-700 text-white py-3 px-4 shadow-lg border-t-2 border-yellow-500">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-3 flex-1 justify-center">
						<span className="text-2xl animate-bounce">🧧</span>
						<div className="text-center">
							<p className="text-base md:text-lg font-bold text-yellow-100 tracking-wide">
								🎊 Chúc Mừng Năm Mới! 🎊
							</p>
							<p className="text-xs md:text-sm text-yellow-200 font-medium">
								Wishing you prosperity, health & happiness!
							</p>
						</div>
						<span
							className="text-2xl animate-bounce"
							style={{ animationDelay: '0.3s' }}
						>
							🏮
						</span>
					</div>
					<button
						onClick={handleClose}
						className="ml-2 p-1.5 hover:bg-white/20 rounded-full transition-colors pointer-events-auto border border-yellow-400/50"
						aria-label="Close Lunar New Year theme"
					>
						<CloseOutlined
							className="text-base text-[#fef08a]"
						/>
					</button>
				</div>
			</div>

			{/* CSS Animations */}
			<style jsx>{`
				@keyframes lion-dance {
					0%,
					100% {
						transform: translateY(0) rotate(-2deg);
					}
					25% {
						transform: translateY(-15px) rotate(2deg);
					}
					50% {
						transform: translateY(-5px) rotate(-2deg);
					}
					75% {
						transform: translateY(-20px) rotate(3deg);
					}
				}

				@keyframes blink-lion {
					0%,
					90%,
					100% {
						transform: scaleY(1);
					}
					95% {
						transform: scaleY(0.1);
					}
				}

				@keyframes mouth-open {
					0%,
					70%,
					100% {
						transform: translateX(-50%) scaleY(1);
					}
					75%,
					95% {
						transform: translateX(-50%) scaleY(1.5);
					}
				}

				@keyframes wave-fur {
					0%,
					100% {
						transform: rotate(-5deg);
					}
					50% {
						transform: rotate(5deg);
					}
				}

				@keyframes body-wave {
					0%,
					100% {
						transform: scaleX(1);
					}
					50% {
						transform: scaleX(1.05);
					}
				}

				@keyframes leg-left {
					0%,
					50%,
					100% {
						transform: translateY(0);
					}
					25% {
						transform: translateY(-5px);
					}
				}

				@keyframes leg-right {
					0%,
					50%,
					100% {
						transform: translateY(0);
					}
					75% {
						transform: translateY(-5px);
					}
				}

				@keyframes fall-flutter {
					0% {
						transform: translateY(-100px) rotate(0deg);
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					100% {
						transform: translateY(100vh) rotate(360deg);
						opacity: 0.8;
					}
				}

				@keyframes fall-spin {
					0% {
						transform: translateY(-50px) rotateY(0deg);
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					100% {
						transform: translateY(100vh) rotateY(720deg);
						opacity: 0.9;
					}
				}

				@keyframes petal-fall {
					0% {
						transform: translateY(-20px) translateX(0) rotate(0deg);
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					100% {
						transform: translateY(100vh) translateX(50px)
							rotate(360deg);
						opacity: 0.7;
					}
				}

				@keyframes swing-lantern {
					0%,
					100% {
						transform: rotate(-8deg);
					}
					50% {
						transform: rotate(8deg);
					}
				}

				@keyframes sway-flower {
					0%,
					100% {
						transform: rotate(-3deg);
					}
					50% {
						transform: rotate(3deg);
					}
				}

				@keyframes sway-gentle {
					0%,
					100% {
						transform: rotate(-2deg);
					}
					50% {
						transform: rotate(2deg);
					}
				}

				@keyframes bloom {
					0%,
					100% {
						transform: scale(1);
						opacity: 1;
					}
					50% {
						transform: scale(1.2);
						opacity: 0.8;
					}
				}

				@keyframes bounce-slow {
					0%,
					100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-5px);
					}
				}

				@keyframes wave-ribbon {
					0%,
					100% {
						transform: rotate(6deg) translateX(0);
					}
					50% {
						transform: rotate(-6deg) translateX(3px);
					}
				}

				@keyframes firecracker-shake {
					0%,
					100% {
						transform: rotate(-2deg);
					}
					50% {
						transform: rotate(2deg);
					}
				}

				@keyframes tassel {
					0%,
					100% {
						transform: rotate(-5deg);
					}
					50% {
						transform: rotate(5deg);
					}
				}

				@keyframes sparkle {
					0%,
					100% {
						opacity: 1;
						transform: scale(1);
					}
					50% {
						opacity: 0.5;
						transform: scale(1.5);
					}
				}

				@keyframes sparkle-burst {
					0%,
					100% {
						opacity: 0;
						transform: scale(0);
					}
					50% {
						opacity: 1;
						transform: scale(1.5);
					}
				}

				.animate-lion-dance {
					animation: lion-dance 1.5s ease-in-out infinite;
				}

				.animate-blink-lion {
					animation: blink-lion 4s ease-in-out infinite;
				}

				.animate-mouth-open {
					animation: mouth-open 2s ease-in-out infinite;
				}

				.animate-wave-fur {
					animation: wave-fur 0.5s ease-in-out infinite;
				}

				.animate-body-wave {
					animation: body-wave 1.5s ease-in-out infinite;
				}

				.animate-leg-left {
					animation: leg-left 0.5s ease-in-out infinite;
				}

				.animate-leg-right {
					animation: leg-right 0.5s ease-in-out infinite;
				}

				.animate-fall-flutter {
					animation: fall-flutter linear infinite;
				}

				.animate-fall-spin {
					animation: fall-spin linear infinite;
				}

				.animate-petal-fall {
					animation: petal-fall linear infinite;
				}

				.animate-swing-lantern {
					animation: swing-lantern 3s ease-in-out infinite;
					transform-origin: top center;
				}

				.animate-sway-flower {
					animation: sway-flower 4s ease-in-out infinite;
					transform-origin: bottom right;
				}

				.animate-sway-gentle {
					animation: sway-gentle 5s ease-in-out infinite;
					transform-origin: bottom center;
				}

				.animate-bloom {
					animation: bloom 2s ease-in-out infinite;
				}

				.animate-bounce-slow {
					animation: bounce-slow 2s ease-in-out infinite;
				}

				.animate-wave-ribbon {
					animation: wave-ribbon 2s ease-in-out infinite;
				}

				.animate-firecracker-shake {
					animation: firecracker-shake 0.3s ease-in-out infinite;
				}

				.animate-tassel {
					animation: tassel 1s ease-in-out infinite;
				}

				.animate-sparkle {
					animation: sparkle 2s ease-in-out infinite;
				}

				.animate-sparkle-burst {
					animation: sparkle-burst 3s ease-in-out infinite;
				}
			`}</style>
		</>
	)
}

export default LunarNewYearTheme
