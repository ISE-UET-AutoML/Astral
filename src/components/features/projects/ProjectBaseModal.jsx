import React from 'react'
import { Modal as BaseModal } from 'src/components/shared/ui/modal'

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
			className={`w-full max-w-[90vw] max-h-[90vh] flex flex-col ${className}`}
			style={{
				background: 'var(--modal-bg)',
				borderRadius: '24px',
				boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
				border: '1px solid var(--modal-border)',
				overflow: 'hidden',
				backdropFilter: 'blur(20px)',
				maxHeight: '90vh',
				...style,
			}}
			{...props}
		>
			{children}
		</BaseModal>
	)
}

export default ProjectBaseModal

