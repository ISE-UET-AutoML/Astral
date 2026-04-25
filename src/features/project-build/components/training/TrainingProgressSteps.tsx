import React from 'react'
import { Button as UiButton } from 'src/components/ui/button'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Alert as UiAlert, AlertDescription as UiAlertDescription, AlertTitle as UiAlertTitle } from 'src/components/ui/alert'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { CircleCheck as CheckCircleOutlined, CircleX as CloseCircleOutlined, CloudDownload as CloudDownloadOutlined, Database as DatabaseOutlined, ChartLine as LineChartOutlined, LoaderCircle as LoadingOutlined, Settings as SettingOutlined } from 'lucide-react'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Spin = ({ tip, children, className = '', ...props }) => (<div className={cx('inline-flex items-center gap-2', className)} {...props}><UiSpinner />{tip && <span>{tip}</span>}{children}</div>)
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Alert = ({ message, description, type, showIcon, className = '', ...props }) => (<UiAlert variant={type === 'error' ? 'destructive' : 'default'} className={className} {...props}>{message && <UiAlertTitle>{message}</UiAlertTitle>}{description && <UiAlertDescription>{description}</UiAlertDescription>}</UiAlert>)
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }
const Steps = ({ items = [], current = 0, className = '', ...props }) => <div className={cx('flex flex-col gap-2', className)} {...props}>{items.map((item, index) => <div key={item.key || item.title || index} className={cx('flex items-center gap-2', index <= current && 'font-medium')}><span className="flex size-6 items-center justify-center rounded-full border text-xs">{index + 1}</span><span>{item.title}</span>{item.description && <span className="text-sm text-muted-foreground">{item.description}</span>}</div>)}</div>

const { Paragraph } = Typography

export function TrainingProgressSteps({
	currentStep,
	status,
	experimentName,
	maxTrainingTime,
	elapsedTime,
	onViewResults,
	currentSettingUpStep,
	settingUpProgress,
}) {
	return (
		<div className="flex w-full flex-col gap-6">
			<Steps
				current={currentStep}
				items={[
					{
						title: (
							<span className="text-[var(--text)]">
								Selecting Instance
							</span>
						),
						icon:
							currentStep !== 0 ? (
								<DatabaseOutlined className="text-[var(--secondary-text)]" />
							) : (
								<LoadingOutlined className="text-[var(--secondary-text)]" />
							),
						description: (
							<span className="text-slate-400">
								Selecting suitable machine for you
							</span>
						),
					},
					{
						title: (
							<span className="text-[var(--text)]">
								Downloading Dependencies
							</span>
						),
						icon:
							currentStep !== 1 ? (
								<SettingOutlined className="text-[var(--secondary-text)]" />
							) : (
								<LoadingOutlined className="text-[var(--secondary-text)]" />
							),
						description: (
							<span className="text-slate-400">
								Setting up your machine
							</span>
						),
					},
					{
						title: (
							<span className="text-[var(--text)]">
								Downloading Data
							</span>
						),
						icon:
							currentStep !== 2 ? (
								<CloudDownloadOutlined className="text-[var(--secondary-text)]" />
							) : (
								<LoadingOutlined className="text-[var(--secondary-text)]" />
							),
						description: (
							<span className="text-slate-400">
								Fetching data from cloud storage
							</span>
						),
					},
					{
						title: (
							<span className="text-[var(--text)]">Training</span>
						),
						icon:
							currentStep !== 3 ? (
								<LineChartOutlined className="text-[var(--secondary-text)]" />
							) : maxTrainingTime &&
							  elapsedTime >= maxTrainingTime ? (
								<CloseCircleOutlined className="text-red-500" />
							) : (
								<LoadingOutlined className="text-[var(--secondary-text)]" />
							),
						description: (
							<span className="text-slate-400">
								Preparing your model
							</span>
						),
					},
					{
						title: (
							<span className="text-[var(--text)]">Done</span>
						),
						icon: <CheckCircleOutlined className="text-[var(--secondary-text)]" />,
						description: (
							<span className="text-slate-400">
								Finished training your model
							</span>
						),
					},
				]}
			/>

			{status === 'DONE' ? (
				<div className="text-center py-8">
					<div className="mb-4">
						<CheckCircleOutlined className="text-[64px] text-[#10b981] mb-4" />
					</div>
					<h2 className="mb-2 text-2xl font-semibold font-poppins text-[var(--text)]">
						Training Completed Successfully!
					</h2>
					<Paragraph className="text-[#94a3b8] font-poppins mb-6 text-base">
						Your model has been trained and is ready for use. Click below to
						view the results and performance metrics.
					</Paragraph>
					<Button
						type="primary"
						size="large"
						onClick={onViewResults}
						className="bg-gradient-to-br from-[#3b82f6] to-[#22d3ee] border-none rounded-xl px-8 py-3 h-auto text-lg font-semibold font-poppins shadow-[0_8px_32px_rgba(59,130,246,0.3)] transition-all duration-300 hover:shadow-2xl hover:scale-105"
					>
						<CheckCircleOutlined className="mr-2" />
						View Training Results
					</Button>
				</div>
			) : (
				<Alert
					showIcon
					message={
						<span className="text-[var(--text)]">
							{experimentName === 'loading'
								? 'Finding the best instance for your project. This may take a few moments...'
								: maxTrainingTime && elapsedTime >= maxTrainingTime
									? 'Training Time Limit Reached'
									: 'This experiment may take a while. You can safely leave the page at any time, and we will automatically create your model once it is finished.'}
						</span>
					}
					description={
						maxTrainingTime && elapsedTime >= maxTrainingTime ? (
							<span className="text-[var(--text)]">
								The training has reached its maximum allocated time. It may
								automatically stop soon.
							</span>
						) : null
					}
					type={
						maxTrainingTime && elapsedTime >= maxTrainingTime
							? 'warning'
							: 'info'
					}
					className={`rounded-xl font-poppins border ${
						maxTrainingTime && elapsedTime >= maxTrainingTime
							? 'border-[rgba(251,191,36,0.3)] bg-[linear-gradient(135deg,rgba(251,191,36,0.1),rgba(245,158,11,0.1))]'
							: 'border-[rgba(59,130,246,0.3)] bg-[linear-gradient(135deg,rgba(59,130,246,0.1),rgba(34,211,238,0.1))]'
					}`}
				/>
			)}

			{currentStep === 1 && (
				<Card
					title={
						<h2 className="m-0 flex items-center text-xl font-semibold font-poppins text-[var(--text)]">
							<SettingOutlined className="mr-2 text-[var(--secondary-text)]" />
							Setting Up Progress
						</h2>
					}
					className="border border-[var(--border)] rounded-xl backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 bg-[var(--card-gradient)] font-poppins"
				>
					<Steps
						progressDot={(dot, { index }) => {
							if (index === currentSettingUpStep) {
								return <Spin size="small" />
							}
							return dot
						}}
						current={currentSettingUpStep}
						direction="vertical"
						items={settingUpProgress}
					/>
				</Card>
			)}
		</div>
	)
}

