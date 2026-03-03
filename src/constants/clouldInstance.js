import React from 'react'
import { Card, Space, Typography, Badge, Row, Col, Divider, Collapse } from 'antd'
import {
	ClockCircleOutlined,
	CloudServerOutlined,
	HddOutlined,
	ThunderboltOutlined,
	DollarOutlined,
	SafetyCertificateOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Panel } = Collapse
export const SERVICES = [
	{
		name: 'VastAI',
		description: 'Cost-effective GPU instances',
		icon: <CloudServerOutlined />,
	},
	{
		name: 'AWS EC2',
		description: 'Reliable and scalable computing',
		icon: <CloudServerOutlined />,
	},
	{
		name: 'GCP Compute',
		description: 'High-performance cloud computing',
		icon: <CloudServerOutlined />,
	},
]

export const GPU_NAMES = ['RTX_3060', 'RTX_4090']

export const GPU_LEVELS = [
	{
		name: 'RTX 3060',
		gpuNumber: 1,
		disk: 10,
		cost: 0.2,
		performance: 'Weak',
		memory: '8GB',
	},
	{
		name: 'RTX 3070',
		gpuNumber: 2,
		disk: 20,
		cost: 0.4,
		performance: 'Medium',
		memory: '12GB',
	},
	{
		name: 'RTX 3080',
		gpuNumber: 4,
		disk: 30,
		cost: 0.8,
		performance: 'Strong',
		memory: '16GB',
	},
	{
		name: 'RTX 3090',
		gpuNumber: 6,
		disk: 40,
		cost: 1.0,
		performance: 'Super Strong',
		memory: '24GB',
	},
	{
		name: 'RTX 4090',
		gpuNumber: 8,
		disk: 50,
		cost: 2.0,
		performance: 'Rocket',
		memory: '24GB',
	},
]

export const INSTANCE_SIZE_DETAILS = {
	Weak: {
		title: '🛠️ Basic Configuration',
		suitable: 'Small datasets and simple models',
		gpuRange: '1-2 GPUs',
		memory: 'Basic memory allocation',
		recommended: 'Testing and development',
		color: 'var(--accent-text)',
		instanceDetails: GPU_LEVELS[0],
	},
	Medium: {
		title: '⚖️ Balanced Setup',
		suitable: 'Moderate workloads',
		gpuRange: '2-4 GPUs',
		memory: 'Increased memory capacity',
		recommended: 'Regular training tasks',
		color: 'var(--accent-text)',
		instanceDetails: GPU_LEVELS[1],
	},
	Strong: {
		title: '🔥 Enhanced Performance',
		suitable: 'Larger datasets',
		gpuRange: '4-6 GPUs',
		memory: 'High memory allocation',
		recommended: 'Complex model training',
		color: 'var(--accent-text)',
		instanceDetails: GPU_LEVELS[2],
	},
	'Super Strong': {
		title: '⚡ High Performance',
		suitable: 'Demanding workloads',
		gpuRange: '6-8 GPUs',
		memory: 'Extended memory capacity',
		recommended: 'Large-scale training',
		color: 'var(--accent-text)',
		instanceDetails: GPU_LEVELS[3],
	},
	Rocket: {
		title: '🚀 Maximum Power',
		suitable: 'Enterprise-level tasks',
		gpuRange: '8+ GPUs',
		memory: 'Maximum memory allocation',
		recommended: 'Production deployment',
		color: 'var(--accent-text)',
		instanceDetails: GPU_LEVELS[4],
	},
}

export const generateRandomKey = () => {
	// Generate a random string to use as a key
	const randomString =
		Math.random().toString(36).substring(2) +
		Math.random().toString(36).substring(2)

	// Use crypto-js to create a SHA-256 hash of the random string
	// const hash = CryptoJS.SHA256(randomString).toString()
	const hash = 'hardcoded-hash-for-example' // Placeholder for the hash
	// Format as an SSH public key (simplified version)
	return `ssh-rsa ${hash} generated-key`
}

export const InstanceSizeCard = ({ size, details, selected, onClick }) => (
	<Card
		hoverable
		className={`instance-size-card border rounded-2xl bg-[var(--card-gradient)] text-[var(--text)] transition-all duration-300 backdrop-blur-xl ${
			selected
				? 'border-[var(--accent-text)] bg-[var(--active-bg)] shadow-[0_8px_24px_var(--input-shadow)]'
				: 'border-[var(--border)] hover:border-[var(--accent-text)] hover:bg-[var(--hover-bg)] hover:shadow-[0_8px_24px_var(--input-shadow)]'
		}`}
		onClick={onClick}
	>
		<div className="flex items-center">
			<Title
				level={5}
				className="mr-10 !text-[var(--text)] !font-semibold"
			>
				{details.title}
			</Title>
			{selected && (
				<Collapse ghost>
					<Panel header="Detail" key="1">
						<Space direction="vertical" size="small">
							<Text className="text-[var(--secondary-text)]">
								Suitable for: {details.suitable}
							</Text>
							<Text className="text-[var(--secondary-text)]">
								GPU Range: {details.gpuRange}
							</Text>
							<Text className="text-[var(--secondary-text)]">
								Memory: {details.memory}
							</Text>
							<Badge
								color="var(--accent-text)"
								text={
									<span className="text-[var(--secondary-text)]">
										Recommended for: {details.recommended}
									</span>
								}
							/>
						</Space>
					</Panel>
				</Collapse>
			)}
		</div>
	</Card>
)

export const CostEstimator = ({ hours, gpuLevel }) => {
	const hourlyRate = gpuLevel?.cost || 0
	const totalCost = hours * hourlyRate

	return (
		<Card
			title={<span className="font-semibold text-[var(--text)]">Cost Estimation</span>}
			className="rounded-2xl border border-[var(--border)] bg-[var(--hover-bg)]"
		>
			<Space
				direction="vertical"
				size="large"
				className="w-full"
			>
				<Row justify="space-between">
					<Col>
						<Text className="text-[var(--secondary-text)]">
							Hourly Rate:
						</Text>
					</Col>
					<Col>
						<Text strong className="text-[var(--text)]">
							${hourlyRate}/hour
						</Text>
					</Col>
				</Row>
				<Row justify="space-between">
					<Col>
						<Text className="text-[var(--secondary-text)]">
							Training Hours:
						</Text>
					</Col>
					<Col>
						<Text strong className="text-[var(--text)]">
							{hours} hours
						</Text>
					</Col>
				</Row>
				<Divider className="my-3 border-[var(--divider-color)]" />
				<Row justify="space-between">
					<Col>
						<Text className="text-[var(--secondary-text)]">
							Estimated Total:
						</Text>
					</Col>
					<Col>
						<Text
							className="text-lg font-semibold text-[var(--accent-text)]"
						>
							${totalCost.toFixed(2)}
						</Text>
					</Col>
				</Row>
			</Space>
		</Card>
	)
}

export const InstanceInfo = ({ formData }) => {
	const selectedGPU = GPU_LEVELS.find((gpu) => gpu.name === formData.gpuName)

	return (
		<Card
			title={
				<Title level={4} className="!text-[var(--text)] !font-semibold">
					Instance Configuration
				</Title>
			}
			extra={
				<SafetyCertificateOutlined
					className="text-2xl text-[var(--accent-text)]"
				/>
			}
			className="rounded-2xl border border-[var(--border)] bg-[var(--card-gradient)] backdrop-blur-2xl"
		>
			<Space
				direction="vertical"
				size="large"
				className="w-full"
			>
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<Card
							size="small"
							title={
								<span
									className="font-semibold text-[var(--text)]"
								>
									Hardware Specs
								</span>
							}
							className="rounded-xl border border-[var(--border)] bg-[var(--hover-bg)]"
						>
							<Space direction="vertical">
								<Text
									className="text-[var(--secondary-text)]"
								>
									<ThunderboltOutlined
										className="text-[var(--accent-text)]"
									/>{' '}
									GPUs: {formData.gpuNumber}x{' '}
									{formData.gpuName}
								</Text>
								<Text
									className="text-[var(--secondary-text)]"
								>
									<HddOutlined
										className="text-[var(--accent-text)]"
									/>{' '}
									Storage: {formData.disk} GB
								</Text>
								<Text
									className="text-[var(--secondary-text)]"
								>
									<CloudServerOutlined
										className="text-[var(--accent-text)]"
									/>{' '}
									Provider: {formData.service}
								</Text>
							</Space>
						</Card>
					</Col>
					<Col span={12}>
						<Card
							size="small"
							title={
								<span
									className="font-semibold text-[var(--text)]"
								>
									Training Details
								</span>
							}
							className="rounded-xl border border-[var(--border)] bg-[var(--hover-bg)]"
						>
							<Space direction="vertical">
								<Text
									className="text-[var(--secondary-text)]"
								>
									<ClockCircleOutlined
										className="text-[var(--accent-text)]"
									/>{' '}
									Duration: {formData.trainingTime} hours
								</Text>
								<Text
									className="text-[var(--secondary-text)]"
								>
									<DollarOutlined
										className="text-[var(--accent-text)]"
									/>{' '}
									Cost: ${formData.cost}
									/hour
								</Text>
							</Space>
						</Card>
					</Col>
				</Row>
			</Space>
		</Card>
	)
}
