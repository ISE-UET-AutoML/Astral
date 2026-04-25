import React from 'react'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Clock as ClockCircleOutlined } from 'lucide-react'
import { InstanceMetricPill } from './InstanceMetricPill'
import { InstanceSummarySidebar } from './InstanceSummarySidebar'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }
const Space = ({ children, className = '', direction = 'horizontal', size = 8, ...props }) => <div className={cx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row items-center', className)} style={{ gap: typeof size === 'number' ? size : undefined, ...props.style }} {...props}>{children}</div>
const Row = ({ children, className = '', gutter, ...props }) => <div className={cx('flex flex-wrap', className)} {...props}>{children}</div>
const Col = ({ children, className = '', span, xs, sm, md, lg, ...props }) => <div className={cx('min-w-0 flex-1', className)} {...props}>{children}</div>
const Slider = ({ value, defaultValue, onChange, min = 0, max = 100, step = 1, className = '', ...props }) => <input type="range" value={value ?? defaultValue ?? min} min={min} max={max} step={step} onChange={(e) => onChange?.(Number(e.target.value))} className={cx('w-full', className)} {...props} />
const Select = ({ options, value, defaultValue, onChange, children, placeholder, className = '', ...props }) => <select value={value} defaultValue={defaultValue} onChange={(event) => onChange?.(event.target.value)} className={cx('h-9 rounded-lg border border-input bg-background px-3 text-sm', className)} {...props}>{placeholder && <option value="">{placeholder}</option>}{options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}{children}</select>
Select.Option = ({ value, children, ...props }) => <option value={value} {...props}>{children}</option>
import {
	SERVICES,
	GPU_LEVELS,
} from 'src/constants/clouldInstance'

const { Text } = Typography
const { Option } = Select

export function ManualInstancePanel({
	formData,
	handleTrainingTimeChange,
	handleManualConfigChange,
	handleGpuNumberChange,
	handleDiskChange,
	isProcessing,
	onStartTraining,
}) {
	return (
		<Space
			direction="vertical"
			size="large"
			className="w-full rounded-lg shadow-sm"
		>
			<Row gutter={[24, 24]}>
				<Col span={16}>
					<Card className="dark-build-card !rounded-xl !border-0 shadow-md bg-[var(--card-gradient)]">
						<Space
							direction="vertical"
							size="large"
							className="w-full"
						>
							<Card
								size="small"
								title={
									<span className="font-semibold text-[var(--text)]">
										<ClockCircleOutlined className="text-[var(--accent-text)] mr-2" />
										Training Duration
									</span>
								}
								className="rounded-xl !border-0 bg-[var(--hover-bg)]"
							>
								<div className="flex flex-col gap-4">
									<div className="flex items-center gap-4">
										<Slider
											className="dark-build-slider flex-1 min-w-0"
											min={0}
											max={24}
											step={0.5}
											value={formData.trainingTime || 0}
											onChange={handleTrainingTimeChange}
											tooltip={{ open: false }}
										/>
										<InstanceMetricPill
											value={formData.trainingTime || 0}
											suffix="hours"
										/>
									</div>
									<Text className="text-[var(--secondary-text)] text-sm">
										Recommended: 1-24 hours for most models
									</Text>
								</div>
							</Card>

							<div>
								<Text className="dark-build-text-gradient">
									Manual Configuration
								</Text>
								<Space
									direction="vertical"
									size="middle"
									className="w-full mt-4"
								>
									<div>
										<Text className="dark-build-text">
											Service Provider
										</Text>
										<Select
											className="dark-build-select w-full mt-2"
											value={formData.service}
											onChange={handleManualConfigChange(
												'service'
											)}
										>
											{SERVICES.map((service) => (
												<Option
													key={service.name}
													value={service.name}
												>
													{service.name} -{' '}
													{service.description}
												</Option>
											))}
										</Select>
									</div>

									<div>
										<Text className="dark-build-text">
											GPU Type
										</Text>
										<Select
											className="dark-build-select w-full mt-2"
											value={formData.gpuName}
											onChange={handleManualConfigChange(
												'gpuName'
											)}
										>
											{GPU_LEVELS.map((gpu) => (
												<Option
													key={gpu.name}
													value={gpu.name}
												>
													{gpu.name} ({gpu.memory})
												</Option>
											))}
										</Select>
									</div>

									<div>
										<Text className="dark-build-text">
											Number of GPUs
										</Text>
										<div className="flex items-center gap-4 mt-2">
											<Slider
												className="dark-build-slider flex-1"
												min={1}
												max={8}
												step={1}
												value={formData.gpuNumber}
												onChange={
													handleGpuNumberChange
												}
												tooltip={{ open: false }}
											/>
											<InstanceMetricPill
												value={formData.gpuNumber}
												suffix="GPUs"
											/>
										</div>
									</div>

									<div>
										<Text className="dark-build-text">
											Disk Space
										</Text>
										<div className="flex items-center gap-4 mt-2">
											<Slider
												className="dark-build-slider flex-1"
												min={10}
												max={1000}
												step={10}
												value={formData.disk}
												onChange={handleDiskChange}
												tooltip={{ open: false }}
											/>
											<InstanceMetricPill
												value={formData.disk}
												suffix="GB"
											/>
										</div>
									</div>
								</Space>
							</div>
						</Space>
					</Card>
				</Col>

				<Col span={8}>
					<InstanceSummarySidebar
						formData={formData}
						isProcessing={isProcessing}
						onStartTraining={onStartTraining}
					/>
				</Col>
			</Row>
		</Space>
	)
}

