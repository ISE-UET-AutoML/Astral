import React from 'react'
import { Card, Alert, Button } from 'antd'
import { StopOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons'

export function DeployCloudServerCard({ deployData, backgroundGradient }) {
	if (!deployData) return null

	const isOnline = deployData.status === 'ONLINE'

	return (
		<Card
			title={
				<span className="font-poppins text-[var(--secondary-text)]">
					🚀 Cloud Server
				</span>
			}
			className="rounded-xl shadow-sm border border-[var(--border)] [background:var(--card-gradient)]"
			style={{
				backdropFilter: 'blur(10px)',
				borderRadius: '12px',
				fontFamily: 'Poppins, sans-serif',
			}}
		>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<Alert
						message={
							isOnline ? (
								<span className="font-poppins text-[var(--secondary-text)]">
									Shut down server instance
								</span>
							) : (
								<span className="font-poppins text-[var(--secondary-text)]">
									Start server instance
								</span>
							)
						}
						description={
							isOnline ? (
								<span className="font-poppins text-[var(--secondary-text)]">
									Gracefully stops the running server
									instance, making it temporarily unavailable
									without deleting it.
								</span>
							) : (
								<span className="font-poppins text-[var(--secondary-text)]">
									Powers on a previously shut down server,
									making it active and ready to handle
									operations.
								</span>
							)
						}
						type={isOnline ? 'warning' : 'info'}
						showIcon
						className="border border-[var(--border)] rounded-xl"
						style={{
							height: 130,
							background: backgroundGradient,
							borderRadius: '12px',
							fontFamily: 'Poppins, sans-serif',
						}}
					/>
					<Button
						type="default"
						icon={isOnline ? <StopOutlined /> : <CheckCircleOutlined />}
						size="large"
						className="w-full font-bold"
					>
						{isOnline ? 'Shut down' : 'Start'}
					</Button>
				</div>
				<div>
					<Alert
						message={
							<span className="font-poppins text-[var(--secondary-text)]">
								Delete server instance
							</span>
						}
						description={
							<span className="font-poppins text-[var(--secondary-text)]">
								Permanently removes the server and all
								associated data from the system. This action is
								irreversible.
							</span>
						}
						type="error"
						showIcon
						className="border border-[var(--border)] rounded-xl"
						style={{
							height: 130,
							background: backgroundGradient,
							borderRadius: '12px',
							fontFamily: 'Poppins, sans-serif',
						}}
					/>
					<Button
						type="default"
						icon={<DeleteOutlined />}
						size="large"
						className="w-full font-bold mt-[15px]"
					>
						Delete Server
					</Button>
				</div>
			</div>
		</Card>
	)
}

