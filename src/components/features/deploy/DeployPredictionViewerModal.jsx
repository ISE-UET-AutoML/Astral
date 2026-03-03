import React from 'react'
import { Modal, Button, Spin } from 'antd'
import {
	SettingOutlined,
	DownloadOutlined,
} from '@ant-design/icons'
import ImageHistoryViewer from 'src/components/features/predictions/ImageHistoryViewer'
import TextHistoryViewer from 'src/components/features/predictions/TextHistoryViewer'
import MultilabelHistoryViewer from 'src/components/features/predictions/MultilabelHistoryViewer'

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

