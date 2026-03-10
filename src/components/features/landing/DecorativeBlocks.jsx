import React from 'react'
import { useTheme } from 'src/theme/ThemeProvider'

/**
 * DecorativeBlocks - Geometric block pattern background (sea blue)
 * Pattern inspired by triangular/staircase arrangement
 */
const DecorativeBlocks = () => {
	const { theme } = useTheme()
	const isDark = theme === 'dark'

	// Single blue - matches brand (#5C8DFF)
	const blockColors = isDark
		? {
				pale: 'rgba(147, 197, 253, 0.2)',
				vibrant: 'rgba(96, 165, 250, 0.35)',
		  }
		: {
				pale: '#dbeafe',
				vibrant: '#93c5fd',
		  }

	const blocks = [
		{ row: 0, col: 0, color: blockColors.pale },
		{ row: 0, col: 1, color: blockColors.pale },
		{ row: 1, col: 0, color: blockColors.pale },
		{ row: 1, col: 1, color: blockColors.vibrant },
		{ row: 1, col: 2, color: blockColors.pale },
		{ row: 2, col: 0, color: blockColors.pale },
	]

	const size = 100
	const gap = 16

	return (
		<div
			className="fixed inset-0 overflow-hidden pointer-events-none z-[1]"
			aria-hidden="true"
		>
			{/* Top-left cluster */}
			<div
				className="absolute"
				style={{
					top: '15%',
					left: '5%',
					display: 'grid',
					gridTemplateColumns: `repeat(3, ${size}px)`,
					gridTemplateRows: `repeat(3, ${size}px)`,
					gap: `${gap}px`,
				}}
			>
				{blocks.map((b, i) => (
					<div
						key={i}
						className="rounded-lg transition-colors duration-500"
						style={{
							gridColumn: b.col + 1,
							gridRow: b.row + 1,
							backgroundColor: b.color,
							width: size,
							height: size,
						}}
					/>
				))}
			</div>

			{/* Bottom-right cluster (mirror for balance) */}
			<div
				className="absolute"
				style={{
					bottom: '15%',
					right: '6%',
					display: 'grid',
					gridTemplateColumns: `repeat(3, ${size}px)`,
					gridTemplateRows: `repeat(3, ${size}px)`,
					gap: `${gap}px`,
				}}
			>
				{blocks.map((b, i) => (
					<div
						key={`br-${i}`}
						className="rounded-lg transition-colors duration-500"
						style={{
							gridColumn: 3 - b.col,
							gridRow: 3 - b.row,
							backgroundColor: b.color,
							width: size,
							height: size,
						}}
					/>
				))}
			</div>
		</div>
	)
}

export default DecorativeBlocks
