import React from 'react'
import BaseModal from 'src/components/shared/utilities/Modal'

const ProjectBaseModal = ({
	open,
	onCancel,
	children,
	className = '',
	style,
	...props
}) => {
	return (
		<BaseModal
			open={open}
			onClose={onCancel}
			className={`w-full max-w-[90vw] max-h-[90vh] flex flex-col [background:var(--modal-bg)] rounded-[24px] border border-[var(--modal-border)] shadow-[0_25px_50px_rgba(0,0,0,0.3)] overflow-hidden backdrop-blur-[20px] ${className}`}
			style={style}
			{...props}
		>
			{children}
		</BaseModal>
	)
}

export default ProjectBaseModal
