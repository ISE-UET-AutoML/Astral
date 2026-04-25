import React from 'react'

const cx = (...classes) => classes.filter(Boolean).join(' ')
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }

const { Text } = Typography

export function InstanceMetricPill({ value, suffix }) {
	return (
		<div className="shrink-0 min-w-[100px] px-4 py-2.5 rounded-lg text-center [background:var(--hover-bg)]">
			<Text className="flex items-center justify-center gap-1 text-[15px] font-semibold text-[var(--text)]">
				<span>{value}</span>
				<span className="text-[var(--secondary-text)]">{suffix}</span>
			</Text>
		</div>
	)
}

