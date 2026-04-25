import React from 'react'
import { Button as UiButton } from 'src/components/ui/button'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Input as UiInput } from 'src/components/ui/input'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { Clock as ClockCircleOutlined } from 'lucide-react'
import { InstanceMetricPill } from './InstanceMetricPill'
import { InstanceSummarySidebar } from './InstanceSummarySidebar'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Input = ({ className = '', ...props }) => <UiInput className={className} {...props} />
Input.TextArea = ({ className = '', ...props }) => <textarea className={cx('min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50', className)} {...props} />
const InputNumber = ({ className = '', ...props }) => <UiInput type="number" className={className} {...props} />
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }
const Space = ({ children, className = '', direction = 'horizontal', size = 8, ...props }) => <div className={cx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row items-center', className)} style={{ gap: typeof size === 'number' ? size : undefined, ...props.style }} {...props}>{children}</div>
const Row = ({ children, className = '', gutter, ...props }) => <div className={cx('flex flex-wrap', className)} {...props}>{children}</div>
const Col = ({ children, className = '', span, xs, sm, md, lg, ...props }) => <div className={cx('min-w-0 flex-1', className)} {...props}>{children}</div>
const Slider = ({ value, defaultValue, onChange, min = 0, max = 100, step = 1, className = '', ...props }) => <input type="range" value={value ?? defaultValue ?? min} min={min} max={max} step={step} onChange={(e) => onChange?.(Number(e.target.value))} className={cx('w-full', className)} {...props} />

const { Text } = Typography

export function UserInfrastructurePanel({
	formData,
	handleTrainingTimeChange,
	sshKey,
	onCopySshKey,
	infrastructureData,
	handleInfrastructureChange,
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
								<Space
									direction="vertical"
									size="middle"
									className="w-full"
								>
									<div>
										<Text className="dark-build-text">
											SSH Public Key
										</Text>
										<Input.TextArea
											className="dark-build-input"
											value={sshKey}
											rows={2}
											readOnly
										/>
										<Button
											onClick={onCopySshKey}
											type="primary"
											className="mt-2"
										>
											Copy
										</Button>
									</div>
									<div>
										<Text className="dark-build-text">
											Instance ID
										</Text>
										<Input
											className="dark-build-input mt-2"
											value={infrastructureData.id}
											onChange={(e) =>
												handleInfrastructureChange('id')(
													e.target.value
												)
											}
											placeholder="Enter instance ID"
										/>
									</div>
									<div>
										<Text className="dark-build-text">
											SSH Port
										</Text>
										<InputNumber
											className="dark-build-input w-full mt-2"
											value={infrastructureData.sshPort}
											onChange={handleInfrastructureChange(
												'sshPort'
											)}
											min={1}
											max={65535}
											placeholder="Enter SSH port"
										/>
									</div>
									<div>
										<Text className="dark-build-text">
											Public IP
										</Text>
										<Input
											className="dark-build-input mt-2"
											value={infrastructureData.publicIP}
											onChange={(e) =>
												handleInfrastructureChange(
													'publicIP'
												)(e.target.value)
											}
											placeholder="Enter public IP"
										/>
									</div>
									<div>
										<Text className="dark-build-text">
											Deploy Port
										</Text>
										<InputNumber
											className="dark-build-input w-full mt-2"
											value={infrastructureData.deployPort}
											onChange={handleInfrastructureChange(
												'deployPort'
											)}
											min={1}
											max={65535}
											placeholder="Enter deploy port"
										/>
									</div>
									<div>
										<Text className="dark-build-text">
											Username
										</Text>
										<Input
											className="dark-build-input mt-2"
											value={infrastructureData.username}
											onChange={(e) =>
												handleInfrastructureChange(
													'username'
												)(e.target.value)
											}
											placeholder="Enter username"
										/>
									</div>
									<div>
										<Text className="dark-build-text">
											Dataset Path
										</Text>
										<Input
											className="dark-build-input mt-2"
											value={infrastructureData.datasetPath}
											onChange={(e) =>
												handleInfrastructureChange(
													'datasetPath'
												)(e.target.value)
											}
											placeholder="Enter dataset path"
										/>
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

