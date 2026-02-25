import React from 'react'

/**
 * Custom Modal Component
 * - Blur backdrop
 * - Center positioned
 * - Customizable with className
 * - Click outside to close (optional)
 */
const Modal = ({
	open,
	onClose,
	title,
	children,
	className = '',
	closeOnBackdropClick = true,
	maxWidth = 'max-w-lg',
	...props
}) => {
	if (!open) return null

	const handleBackdropClick = (e) => {
		if (closeOnBackdropClick && e.target === e.currentTarget) {
			onClose?.()
		}
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={handleBackdropClick}
		>
			{/* Backdrop with blur */}
			<div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

			{/* Modal content */}
			<div
				className={`relative z-50 w-full ${maxWidth} bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 ${className}`}
				{...props}
			>
				{/* Header */}
				{title && (
					<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
							{title}
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
							aria-label="Close modal"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				)}

				{/* Body */}
				<div className="p-6">{children}</div>
			</div>
		</div>
	)
}

export default Modal
