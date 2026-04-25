import React from 'react'
import { Button as UiButton } from 'src/components/ui/button'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider as UiTooltipProvider, TooltipTrigger as UiTooltipTrigger } from 'src/components/ui/tooltip'
import { Clock as ClockCircleOutlined, CircleCheck as CheckCircleOutlined } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Tooltip = ({ title, children, ...props }) => (<UiTooltipProvider><UiTooltip><UiTooltipTrigger asChild>{children || <span />}</UiTooltipTrigger>{title && <UiTooltipContent {...props}>{title}</UiTooltipContent>}</UiTooltip></UiTooltipProvider>)
const List = ({ dataSource = [], renderItem, className = '', ...props }) => <div className={className} {...props}>{dataSource.map((item, index) => renderItem ? renderItem(item, index) : <div key={index}>{item}</div>)}</div>
List.Item = ({ children, className = '', ...props }) => <div className={cx('border-b py-2', className)} {...props}>{children}</div>

export function DeployHistorySection({
	recentPredictions,
	isLoadingPredictions,
	onViewPrediction,
}) {
	return (
		<div className="mt-8">
			<Card
				title={
					<div className="flex items-center gap-2">
						<ClockCircleOutlined className="text-[var(--accent-text)]" />
						<span className="text-lg font-semibold text-[var(--text)]">
							Recent Predictions
						</span>
					</div>
				}
				className="border border-[var(--border)] rounded-xl [background:var(--card-gradient)] backdrop-blur-xl shadow-lg"
			>
				{!isLoadingPredictions && (
					<List
						dataSource={recentPredictions}
						renderItem={(prediction) => {
							const filename = prediction.file_name
							const dateObject = new Date(
								prediction.created_at
							)
							const timeAgo = formatDistanceToNow(dateObject, {
								addSuffix: true,
							})
							const exactTime = format(
								dateObject,
								'HH:mm:ss, dd/MM/yyyy'
							)

							return (
								<List.Item
									className="border-b border-[var(--border)]"
									actions={[
										<Button
											type="primary"
											className="deploy-btn-solid"
											onClick={() =>
												onViewPrediction(prediction)
											}
										>
											View
										</Button>,
									]}
								>
									<List.Item.Meta
										avatar={
											<CheckCircleOutlined className="text-[var(--accent-text)]" />
										}
										title={
											<span className="text-[var(--text)]">
												{`File: ${filename}`}
											</span>
										}
										description={
											<Tooltip
												title={`Exact time: ${exactTime}`}
											>
												<span className="cursor-help text-[var(--secondary-text)]">
													{`Predicted ${timeAgo}`}
												</span>
											</Tooltip>
										}
									/>
								</List.Item>
							)
						}}
					/>
				)}
			</Card>
		</div>
	)
}

