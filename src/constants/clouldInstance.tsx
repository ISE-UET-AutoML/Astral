import type { KeyboardEvent } from 'react'
import { Button as UiButton } from 'src/components/ui/button'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Badge as UiBadge } from 'src/components/ui/badge'
import { Separator as UiSeparator } from 'src/components/ui/separator'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { Clock as ClockCircleOutlined, Server as CloudServerOutlined, HardDrive as HddOutlined, Zap as ThunderboltOutlined, DollarSign as DollarOutlined, ShieldCheck as SafetyCertificateOutlined } from 'lucide-react'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Badge = ({ count, children, className = '', ...props }) => children ? <span className={cx('relative inline-flex', className)} {...props}>{children}{count != null && <UiBadge className="absolute -right-2 -top-2">{count}</UiBadge>}</span> : <UiBadge className={className} {...props}>{count}</UiBadge>
const Divider = ({ className = '', ...props }) => <UiSeparator className={className} {...props} />
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }
const Space = ({ children, className = '', direction = 'horizontal', size = 8, ...props }) => <div className={cx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row items-center', className)} style={{ gap: typeof size === 'number' ? size : undefined, ...props.style }} {...props}>{children}</div>
const Row = ({ children, className = '', gutter, ...props }) => <div className={cx('flex flex-wrap', className)} {...props}>{children}</div>
const Col = ({ children, className = '', span, xs, sm, md, lg, ...props }) => <div className={cx('min-w-0 flex-1', className)} {...props}>{children}</div>
const Collapse = ({ items, children, className = '', ...props }) => <div className={cx('space-y-2', className)} {...props}>{items ? items.map((item) => <details key={item.key} className="rounded-lg border p-3"><summary>{item.label}</summary><div className="mt-2">{item.children}</div></details>) : children}</div>
Collapse.Panel = ({ header, children, className = '', ...props }) => <details className={cx('rounded-lg border p-3', className)} {...props}><summary>{header}</summary><div className="mt-2">{children}</div></details>

const { Title, Text } = Typography
export const TRAINING_METHODS = [
	{ key: 'astral', tag: 'astral', label: 'Astral' },
	{ key: 'iml', tag: 'iml', label: 'iML' },
]

/** Internal UI keys mapped to the training tags sent on generic-cloud-training. */
export const TRAINING_MODE_TAGS = {
	astral: 'astral',
	iml: 'iml',
}

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

type GpuLevel = (typeof GPU_LEVELS)[number];
type InstanceSizeDetails = {
	title: string;
	suitable: string;
	gpuRange: string;
	memory: string;
	recommended: string;
	color: string;
	instanceDetails: GpuLevel;
};

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

type InstanceSizeCardProps = {
	size: string;
	details: InstanceSizeDetails;
	selected: boolean;
	onClick: () => void;
};

export const InstanceSizeCard = ({ size: _size, details, selected, onClick }: InstanceSizeCardProps) => (
	<div
		role="button"
		tabIndex={0}
		onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && onClick()}
		onClick={onClick}
		className={`cursor-pointer !rounded-xl transition-all duration-300 overflow-hidden ${
			selected
				? 'border-2 border-blue-400 dark:border-blue-500 bg-blue-100 dark:bg-blue-900/40 shadow-[0_4px_12px_rgba(59,130,246,0.15)]'
				: 'border border-gray-200 dark:border-white/20 bg-[var(--card-gradient)] hover:border-blue-300 hover:bg-blue-50/50 dark:hover:border-blue-700 dark:hover:bg-blue-950/30 shadow-sm'
		}`}
	>
		<Card
			hoverable={false}
			className="!border-0 !bg-transparent !shadow-none !rounded-xl pointer-events-none"
			bodyStyle={{ padding: '16px 24px' }}
			styles={{ body: { background: 'transparent' } }}
		>
			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<Title
						level={5}
						className={`!m-0 !font-semibold flex items-center gap-2 ${
							selected
								? '!text-blue-600 dark:!text-blue-400'
								: '!text-[var(--text)]'
						}`}
					>
						{details.title}
					</Title>
					{selected && (
						<div className="h-2 w-2 rounded-full bg-blue-400 dark:bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]"></div>
					)}
				</div>

				<div
					className={`grid grid-cols-2 gap-x-4 gap-y-3 transition-all duration-300 ease-in-out overflow-hidden ${
						selected
							? 'max-h-[200px] opacity-100 mt-4'
							: 'max-h-0 opacity-0 mt-0'
					}`}
				>
					<div className="flex items-start gap-2">
						<span className="text-blue-400 dark:text-blue-500 mt-0.5">
							🎯
						</span>
						<div className="flex flex-col">
							<span className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium uppercase tracking-wider">
								Suitable for
							</span>
							<span className="text-sm text-blue-900/90 dark:text-blue-100">
								{details.suitable}
							</span>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<span className="text-blue-400 dark:text-blue-500 mt-0.5">
							⚡
						</span>
						<div className="flex flex-col">
							<span className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium uppercase tracking-wider">
								GPU Range
							</span>
							<span className="text-sm text-blue-900/90 dark:text-blue-100 font-medium">
								{details.gpuRange}
							</span>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<span className="text-blue-400 dark:text-blue-500 mt-0.5">
							🧠
						</span>
						<div className="flex flex-col">
							<span className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium uppercase tracking-wider">
								Memory
							</span>
							<span className="text-sm text-blue-900/90 dark:text-blue-100">
								{details.memory}
							</span>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<span className="text-blue-400 dark:text-blue-500 mt-0.5">
							💡
						</span>
						<div className="flex flex-col">
							<span className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium uppercase tracking-wider">
								Recommended
							</span>
							<span className="text-sm text-blue-900/90 dark:text-blue-100">
								{details.recommended}
							</span>
						</div>
					</div>
				</div>
			</div>
		</Card>
	</div>
)

export const CostEstimator = ({
	hours,
	gpuLevel,
	onStartTraining,
	isProcessing,
	canStart,
}: {
	hours: number;
	gpuLevel?: Partial<GpuLevel>;
	onStartTraining?: () => void;
	isProcessing?: boolean;
	canStart?: boolean;
}) => {
	const hourlyRate = gpuLevel?.cost || 0
	const totalCost = hours * hourlyRate

	return (
		<Card
			title={
				<span className="font-semibold text-[var(--text)]">
					Cost Estimation
				</span>
			}
			className="rounded-2xl !border-0 bg-[var(--hover-bg)] shadow-sm"
		>
			<Space direction="vertical" size="large" className="w-full">
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
						<Text className="text-lg font-semibold text-[var(--accent-text)]">
							${totalCost.toFixed(2)}
						</Text>
					</Col>
				</Row>
				{onStartTraining && (
					<div className="pt-4 mt-2 w-full">
						<button
							type="button"
							onClick={onStartTraining}
							disabled={!canStart || isProcessing}
							className="w-full py-3 px-4 rounded-2xl font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 transition-colors border-0"
						>
							{isProcessing ? (
								<span className="inline-flex items-center justify-center gap-2">
									<svg
										className="animate-spin h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Finding instance...
								</span>
							) : (
								'Start Training'
							)}
						</button>
					</div>
				)}
			</Space>
		</Card>
	)
}

type InstanceFormData = {
	gpuName?: string;
	gpuNumber?: number;
	disk?: number;
	service?: string;
	trainingTime?: number;
	cost?: number;
};

export const InstanceInfo = ({ formData }: { formData: InstanceFormData }) => {
	const selectedGPU = GPU_LEVELS.find((gpu) => gpu.name === formData.gpuName)

	return (
		<Card
			title={
				<Title level={4} className="!text-[var(--text)] !font-semibold">
					Instance Configuration
				</Title>
			}
			extra={
				<SafetyCertificateOutlined className="text-2xl text-[var(--accent-text)]" />
			}
			className="rounded-2xl !border-0 bg-[var(--card-gradient)] backdrop-blur-2xl shadow-sm"
		>
			<Space direction="vertical" size="large" className="w-full">
				<div className="flex w-full gap-4">
					<div className="flex-1 min-w-0">
						<Card
							size="small"
							title={
								<span className="font-semibold text-[var(--text)]">
									Hardware Specs
								</span>
							}
							className="rounded-xl !border-0 bg-[var(--hover-bg)] h-full"
						>
							<Space direction="vertical">
								<Text className="text-[var(--secondary-text)]">
									<ThunderboltOutlined className="text-[var(--accent-text)]" />{' '}
									GPUs: {formData.gpuNumber}x{' '}
									{formData.gpuName}
								</Text>
								<Text className="text-[var(--secondary-text)]">
									<HddOutlined className="text-[var(--accent-text)]" />{' '}
									Storage: {formData.disk} GB
								</Text>
								<Text className="text-[var(--secondary-text)]">
									<CloudServerOutlined className="text-[var(--accent-text)]" />{' '}
									Provider: {formData.service}
								</Text>
							</Space>
						</Card>
					</div>
					<div className="flex-1 min-w-0">
						<Card
							size="small"
							title={
								<span className="font-semibold text-[var(--text)]">
									Training Details
								</span>
							}
							className="rounded-xl !border-0 bg-[var(--hover-bg)] h-full"
						>
							<Space direction="vertical">
								<Text className="text-[var(--secondary-text)]">
									<ClockCircleOutlined className="text-[var(--accent-text)]" />{' '}
									Duration: {formData.trainingTime} hours
								</Text>
								<Text className="text-[var(--secondary-text)]">
									<DollarOutlined className="text-[var(--accent-text)]" />{' '}
									Cost: ${formData.cost}
									/hour
								</Text>
							</Space>
						</Card>
					</div>
				</div>
			</Space>
		</Card>
	)
}
