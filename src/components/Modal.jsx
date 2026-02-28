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
			{/* Backdrop nhẹ - chỉ tạo độ tách biệt nhẹ nhàng */}
			<div className="fixed inset-0 bg-black/15" />

			{/* Modal content */}
			<div
				className={`relative z-50 w-full ${maxWidth} rounded-2xl ${className}`}
				style={{
					background: 'var(--modal-bg)',
					border: '1px solid var(--modal-border)',
					boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
				}}
				{...props}
			>
				{/* Header */}
				{title && (
					<div
						className="flex items-center justify-between px-6 py-4 border-b"
						style={{
							borderColor: 'var(--modal-header-border)',
						}}
					>
						<h2
							className="text-xl font-semibold"
							style={{ color: 'var(--modal-title-color)' }}
						>
							{title}
						</h2>
						<button
							onClick={onClose}
							className="modal-close-btn transition-colors p-1 rounded-lg -mr-1"
							style={{ color: 'var(--modal-close-color)' }}
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
