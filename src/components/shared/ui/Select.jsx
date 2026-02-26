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
				setDropdownStyle({
					position: 'fixed',
					top: rect.bottom + 4,
					left: rect.left,
					width: rect.width,
					zIndex: 99999,
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
			<div
				ref={dropdownRef}
				className={cn(
					'rounded-xl border shadow-lg max-h-60 overflow-y-auto',
					'border-gray-200 dark:border-white/20',
					'scrollbar-theme'
				)}
				style={{
					...dropdownStyle,
					backgroundColor: isDark ? '#111827' : '#ffffff',
				}}
			>
				{options.length === 0 ? (
					<div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
						No options available
					</div>
				) : (
					options.map((option) => {
						const isSelected = selectedValue === option.value
						return (
							<div
								key={option.value}
								className={cn(
									'px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150',
									'hover:bg-blue-50 dark:hover:bg-blue-500/10',
									'first:rounded-t-lg last:rounded-b-lg',
									isSelected && 'bg-blue-100 dark:bg-blue-500/20 text-black dark:text-white font-medium',
									!isSelected && 'text-gray-900 dark:text-white'
								)}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => handleSelect(option.value)}
							>
								{option.label}
							</div>
						)
					})
				)}
			</div>,
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
