import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from 'src/lib/utils'
import { XMarkIcon } from '@heroicons/react/24/outline'

const ChevronDownIcon = ({ className, ...props }) => (
	<svg
		className={className}
		width="15"
		height="15"
		viewBox="0 0 15 15"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
			fill="currentColor"
			fillRule="evenodd"
			clipRule="evenodd"
		/>
	</svg>
)

const Select = React.forwardRef(
	(
		{
			className,
			value,
			onChange,
			placeholder = 'Select an option',
			options = [],
			allowClear = false,
			size = 'default',
			disabled = false,
			...props
		},
		ref
	) => {
		const [isOpen, setIsOpen] = useState(false)
		const [selectedValue, setSelectedValue] = useState(value)
	const [dropdownStyle, setDropdownStyle] = useState({})
	const triggerRef = useRef(null)
	const dropdownRef = useRef(null)

		useEffect(() => {
			setSelectedValue(value)
		}, [value])

	useEffect(() => {
		if (isOpen && triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect()
			const spaceBelow = window.innerHeight - rect.bottom
			const spaceAbove = rect.top
			const dropdownHeight = 240
			
			// Quyết định dropdown nên mở lên trên hay xuống dưới
			const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow
			
			setDropdownStyle({
				position: 'fixed',
				[shouldOpenUpward ? 'bottom' : 'top']: shouldOpenUpward 
					? window.innerHeight - rect.top + 4
					: rect.bottom + 4,
				left: rect.left,
				width: rect.width,
				zIndex: 999999,
				maxHeight: shouldOpenUpward 
					? Math.min(240, spaceAbove - 8)
					: Math.min(240, spaceBelow - 8),
			})
		}
	}, [isOpen])

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current && !dropdownRef.current.contains(event.target) &&
				triggerRef.current && !triggerRef.current.contains(event.target)
			) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen])

	// Thêm effect để lock body scroll khi dropdown mở trong modal
	useEffect(() => {
		if (isOpen) {
			// Chỉ lock nếu đang trong modal context
			const isInModal = triggerRef.current?.closest('[role="dialog"], .fixed.inset-0')
			if (isInModal) {
				const originalOverflow = document.body.style.overflow
				document.body.style.overflow = 'hidden'
				return () => {
					document.body.style.overflow = originalOverflow
				}
			}
		}
	}, [isOpen])

		const handleSelect = (optionValue) => {
			setSelectedValue(optionValue)
			if (onChange) {
				onChange(optionValue)
			}
			setIsOpen(false)
		}

		const handleClear = (e) => {
			e.stopPropagation()
			setSelectedValue(undefined)
			if (onChange) {
				onChange(undefined)
			}
		}

		const getDisplayText = () => {
			if (selectedValue === null || selectedValue === undefined) {
				return placeholder
			}
			const option = options.find((opt) => opt.value === selectedValue)
			return option ? option.label : selectedValue
		}

		const sizeClasses = {
			small: 'h-8 text-xs px-3 py-1',
			default: 'h-10 text-sm px-4 py-2',
			large: 'h-12 text-sm px-4 py-3',
		}

		const heightClass = sizeClasses[size] || sizeClasses.default
		const hasValue = selectedValue !== null && selectedValue !== undefined
		const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

	const dropdownMenu = isOpen && createPortal(
		<>
			<div
				ref={dropdownRef}
				className="rounded-xl shadow-lg overflow-hidden"
				style={{
					...dropdownStyle,
					backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
					border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgb(229, 231, 235)',
				}}
			>
				{options.length === 0 ? (
					<div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
						No options available
					</div>
				) : (
					<div 
						className="overflow-y-auto custom-dropdown-scroll" 
						style={{ maxHeight: dropdownStyle.maxHeight || '240px' }}
					>
						{options.map((option) => {
							const isSelected = selectedValue === option.value
							return (
								<div
									key={option.value}
									className={cn(
										'px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150',
										'hover:bg-blue-50 dark:hover:bg-white/10',
										isSelected && 'bg-blue-100 dark:bg-white/15 text-black dark:text-white font-medium',
										!isSelected && 'text-gray-900 dark:text-white'
									)}
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => handleSelect(option.value)}
								>
									{option.label}
								</div>
							)
						})}
					</div>
				)}
			</div>
		</>,
		document.body
	)

		return (
			<div className={cn('relative w-full', className)}>
				<div
					ref={triggerRef}
					className={cn(
						'flex w-full items-center justify-between rounded-xl border cursor-pointer transition-all duration-200',
						'bg-white dark:bg-white/10',
						'border-gray-200 dark:border-white/20',
						'hover:border-blue-400 dark:hover:border-blue-400/50',
						'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400',
						heightClass,
						disabled && 'opacity-50 cursor-not-allowed pointer-eventsring-none',
						isOpen && 'ring-2 ring-blue-500/50 border-blue-400'
					)}
					onClick={() => !disabled && setIsOpen(!isOpen)}
					tabIndex={disabled ? -1 : 0}
					onKeyDown={(e) => {
						if (disabled) return
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault()
							setIsOpen(!isOpen)
						}
						if (e.key === 'Escape') {
							setIsOpen(false)
						}
					}}
					{...props}plac
				>
					<span
						className={cn(
							'block truncate',
							!hasValue && 'text-gray-400 dark:text-gray-500',
							hasValue && 'text-gray-900 dark:text-white'
						)}
					>
						{getDisplayText()}
					</span>
					<div className="flex items-center gap-1">
						{allowClear && hasValue && (
							<button
								onClick={handleClear}
								className="p-0.5 hover:bg-gray-200 dark:hover:bg-white/20 rounded transition-colors"
								type="button"
								tabIndex={-1}
							>
								<XMarkIcon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
							</button>
						)}
						<ChevronDownIcon
							className={cn(
								'h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200',
								isOpen && 'rotate-180'
							)}
						/>
					</div>
				</div>
				{dropdownMenu}
			</div>
		)
	}
)

Select.displayName = 'Select'

export { Select }
