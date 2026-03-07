import React from 'react'
import { Card, Alert, Button } from 'antd'
import { StopOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons'

export function DeployCloudServerCard({ deployData }) {
	if (!deployData) return null

	const isOnline = deployData.status === 'ONLINE'

	return (
			<Card
				title={
					<span className="font-poppins text-lg font-semibold text-[var(--text)]">
						🚀 Cloud Server
					</span>
				}
				className="deploy-cloud-server-card rounded-xl shadow-lg border border-[var(--border)] [background:var(--card-gradient)]"
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
								<span className="font-poppins text-[var(--text)]">
									Shut down server instance
								</span>
							) : (
								<span className="font-poppins text-[var(--text)]">
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
						className="border border-[var(--border)] rounded-xl [background:var(--hover-bg)]"
						style={{
							height: 130,
							fontFamily: 'Poppins, sans-serif',
						}}
					/>
					<Button
						type="primary"
						icon={isOnline ? <StopOutlined /> : <CheckCircleOutlined />}
						size="large"
						className="w-full mt-4 font-bold deploy-btn-solid"
					>
						{isOnline ? 'Shut down' : 'Start'}
					</Button>
				</div>
				<div>
					<Alert
						message={
							<span className="font-poppins text-[var(--text)]">
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
						className="border border-[var(--border)] rounded-xl [background:var(--hover-bg)]"
						style={{
							height: 130,
							fontFamily: 'Poppins, sans-serif',
						}}
					/>
					<Button
						type="primary"
						icon={<DeleteOutlined />}
						size="large"
						className="w-full mt-4 font-bold deploy-btn-danger"
					>
						Delete Server
					</Button>
				</div>
			</div>
		</Card>
	)
}

