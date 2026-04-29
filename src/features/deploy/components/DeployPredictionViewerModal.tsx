import React from 'react'
import { Button as UiButton } from 'src/components/ui/button'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { Settings as SettingOutlined, Download as DownloadOutlined } from 'lucide-react'
import ImageHistoryViewer from 'src/features/models/components/ImageHistoryViewer'
import TextHistoryViewer from 'src/features/models/components/TextHistoryViewer'
import MultilabelHistoryViewer from 'src/features/models/components/MultilabelHistoryViewer'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Spin = ({ tip, children, className = '', ...props }) => (<div className={cx('inline-flex items-center gap-2', className)} {...props}><UiSpinner />{tip && <span>{tip}</span>}{children}</div>)
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Modal = ({ open, visible, onCancel, onClose, title, footer, children, width, className = '', centered, ...props }) => { const isOpen = open ?? visible; if (!isOpen) return null; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onCancel || onClose}><div className={cx('max-h-[90vh] overflow-auto rounded-xl border bg-background p-4 shadow-xl', className)} style={{ width: typeof width === 'number' ? width : width || undefined, ...props.style }} onClick={(event) => event.stopPropagation()}>{title && <div className="mb-4 text-lg font-semibold">{title}</div>}{children}{footer !== null && footer !== undefined && <div className="mt-4 flex justify-end gap-2">{footer}</div>}</div></div> }

export function DeployPredictionViewerModal({
	projectInfo,
	isVisible,
	isLoading,
	selectedContent,
	onClose,
	onDownloadCsv,
	simpleDataModalRef,
	multilabelModalRef,
}) {
	if (!projectInfo?.id) return null

	const isImageTask = projectInfo.task_type?.includes('IMAGE')
	const isMultilabelTask = projectInfo.task_type?.includes('MULTILABEL')

	return (
		<Modal
			title="Recent Prediction Details"
			open={isVisible}
			onCancel={onClose}
			width="90%"
			className="top-5"
			footer={[
				!isImageTask && (
					<Button
						key="settings"
						icon={<SettingOutlined />}
						onClick={() =>
							simpleDataModalRef.current?.openDrawer()
						}
					>
						Columns Settings
					</Button>
				),
				!isImageTask && (
					<Button
						key="download"
						icon={<DownloadOutlined />}
						onClick={onDownloadCsv}
						disabled={!selectedContent}
					>
						Download as CSV
					</Button>
				),
				<Button
					key="close"
					type="primary"
					onClick={onClose}
				>
					Close
				</Button>,
			]}
		>
			{isLoading ? (
				<div className="text-center p-[50px]">
					<Spin size="large" />
				</div>
			) : (
				<>
					{isImageTask && (
						<ImageHistoryViewer data={selectedContent} />
					)}
					{!isImageTask && isMultilabelTask && (
						<MultilabelHistoryViewer
							data={selectedContent}
							ref={multilabelModalRef}
						/>
					)}
					{!isImageTask && !isMultilabelTask && (
						<TextHistoryViewer
							data={selectedContent}
							ref={simpleDataModalRef}
						/>
					)}
				</>
			)}
		</Modal>
	)
}

