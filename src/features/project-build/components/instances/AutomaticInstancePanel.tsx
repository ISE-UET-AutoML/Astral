import React from 'react'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Clock as ClockCircleOutlined } from 'lucide-react'
import { InstanceMetricPill } from './InstanceMetricPill'
import { InstanceSummarySidebar } from './InstanceSummarySidebar'
import { Wrench } from 'lucide-react'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }
const Space = ({ children, className = '', direction = 'horizontal', size = 8, ...props }) => <div className={cx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row items-center', className)} style={{ gap: typeof size === 'number' ? size : undefined, ...props.style }} {...props}>{children}</div>
const Row = ({ children, className = '', gutter, ...props }) => <div className={cx('flex flex-wrap', className)} {...props}>{children}</div>
const Col = ({ children, className = '', span, xs, sm, md, lg, ...props }) => <div className={cx('min-w-0 flex-1', className)} {...props}>{children}</div>
const Slider = ({ value, defaultValue, onChange, min = 0, max = 100, step = 1, className = '', ...props }) => <input type="range" value={value ?? defaultValue ?? min} min={min} max={max} step={step} onChange={(e) => onChange?.(Number(e.target.value))} className={cx('w-full', className)} {...props} />
import {
	INSTANCE_SIZE_DETAILS,
	InstanceSizeCard,
} from 'src/constants/clouldInstance'

const { Text } = Typography

export function AutomaticInstancePanel({
	formData,
	setFormData,
	isProcessing,
	onStartTraining,
	handleTrainingTimeChange,
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
									<span className="font-semibold text-[var(--text)] text-lg">
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
								<div className="flex items-center gap-2 mb-4">
									<Wrench className="shrink-0 text-[var(--accent-text)]" size={20} />
									<span className="dark-build-text-gradient text-lg font-semibold text-[var(--text)]">
										Performance Level
									</span>
								</div>
								<div className="grid gap-4">
									{Object.entries(INSTANCE_SIZE_DETAILS).map(
										([size, details]) => (
											<InstanceSizeCard
												key={size}
												size={size}
												details={details}
												selected={
													formData.instanceSize === size
												}
												onClick={() => {
													const defaultTrainingTimes = {
														Weak: 2,
														Medium: 4,
														Strong: 6,
														'Super Strong': 8,
														Rocket: 12,
													}

													setFormData((prev) => ({
														...prev,
														gpuNumber:
															details
																.instanceDetails
																.gpuNumber,
														gpuName:
															details
																.instanceDetails
																.name,
														disk: details
															.instanceDetails
															.disk,
														cost: details
															.instanceDetails
															.cost,
														instanceSize: size,
														trainingTime:
															defaultTrainingTimes[
																size
															] ||
															prev.trainingTime,
														budget: (
															details
																.instanceDetails
																.cost *
															(defaultTrainingTimes[
																size
															] ||
																prev.trainingTime)
														).toFixed(2),
													}))
												}}
											/>
										)
									)}
								</div>
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

