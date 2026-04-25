import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'

type OptionProps = {
	value: string | number;
	children: ReactNode;
};

type CustomSelectProps = {
	value?: string | number | null;
	onChange?: (value: string) => void;
	placeholder?: string;
	className?: string;
	children: ReactNode;
};

export function Option(_props: OptionProps) {
	return null
}

export function CustomSelect({
	value,
	onChange,
	placeholder,
	className,
	children,
}: CustomSelectProps) {
	const options = Children.toArray(children).filter(isValidElement) as ReactElement<OptionProps>[]

	return (
		<select
			value={value ?? ''}
			className={`h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white ${className || ''}`}
			onChange={(event) => onChange?.(event.target.value)}
		>
			{placeholder && <option value="">{placeholder}</option>}
			{options.map((option) => (
				<option key={String(option.props.value)} value={option.props.value}>
					{option.props.children}
				</option>
			))}
		</select>
	)
}
