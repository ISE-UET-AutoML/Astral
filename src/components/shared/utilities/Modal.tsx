import type { MouseEvent, ReactNode } from 'react'

type ModalProps = {
	open: boolean;
	onClose?: () => void;
	title?: ReactNode;
	children: ReactNode;
	className?: string;
	closeOnBackdropClick?: boolean;
	maxWidth?: string;
} & React.HTMLAttributes<HTMLDivElement>;

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
}: ModalProps) => {
	if (!open) return null

	const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
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
				className={`relative z-50 w-full ${maxWidth} bg-white dark:[background:var(--modal-bg)] rounded-2xl shadow-2xl border border-gray-200 dark:border-[var(--modal-border)] ${className}`}
				{...props}
			>
				{/* Header */}
				{title && (
					<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[var(--modal-header-border)]">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--modal-title-color)]">
							{title}
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 dark:text-[var(--modal-close-color)] dark:hover:text-[var(--modal-close-hover)] transition-colors"
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
