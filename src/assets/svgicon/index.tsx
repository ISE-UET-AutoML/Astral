import type { SVGProps } from 'react'

type SvgIconProps = SVGProps<SVGSVGElement>

export const CloudUploadIcon = ({ className, ...props }: SvgIconProps) => (
	<svg
		className={className}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M7 18C4.79086 18 3 16.2091 3 14C3 12.9857 3.37764 12.0596 4 11.3542V11C4 7.68629 6.68629 5 10 5C10.3416 5 10.6734 5.03015 10.9925 5.08738C11.7212 3.73139 13.1772 3 14.5 3C16.433 3 18 4.567 18 6.5C18.0001 6.5 18 6.5 18 6.5V7C19.6569 7 21 8.34315 21 10C21 11.6569 19.6569 13 18 13H17V14C17 16.2091 15.2091 18 13 18H7Z"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M12 15L12 9M12 15L9 12M12 15L15 12"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export const ArrowRightIcon = ({ className, ...props }: SvgIconProps) => (
	<svg
		className={className}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M5 12H19M19 12L12 5M19 12L12 19"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export const InfoCircledIcon = ({ className, ...props }: SvgIconProps) => (
	<svg
		className={className}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
		<path
			d="M12 16V12M12 8H12.01"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export const MixerHorizontalIcon = ({ className, ...props }: SvgIconProps) => (
	<svg
		className={className}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M3 12H21M3 6H21M3 18H21"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<circle cx="6" cy="6" r="2" fill="currentColor" />
		<circle cx="18" cy="12" r="2" fill="currentColor" />
		<circle cx="6" cy="18" r="2" fill="currentColor" />
	</svg>
)

export const SearchIcon = ({ className, ...props }: SvgIconProps) => (
	<svg
		className={className}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export const SortIcon = ({ className, ...props }: SvgIconProps) => (
	<svg
		className={className}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M3 6H21M6 12H18M9 18H15"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export const SortAscIcon = ({ className, ...props }: SvgIconProps) => (
	<svg
		className={className}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M3 6H21M6 12H18M9 18H15M12 6L8 2L4 6"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export const SortDescIcon = ({ className, ...props }: SvgIconProps) => (
	<svg
		className={className}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M3 6H21M6 12H18M9 18H15M12 18L8 22L4 18"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export const DataPreparingIcon = ({ className, ...props }: SvgIconProps) => (
	<svg
		className={className}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
		/>
	</svg>
)
