import React from 'react'
import { useLocation, useOutletContext, useNavigate } from 'react-router-dom'
import { Alert, Button } from 'antd'
import { HistoryOutlined, CloudDownloadOutlined, RocketOutlined } from '@ant-design/icons'

import * as modelServiceAPI from 'src/api/model'
import { PATHS } from 'src/constants/paths'
import { useTrainResultPage } from 'src/hooks/useTrainResultPage'
import { TrainResultSummaryCards } from 'src/components/features/training/TrainResultSummaryCards'
import { TrainResultPerformanceCharts } from 'src/components/features/training/TrainResultPerformanceCharts'
import { TrainResultMetricsTable } from 'src/components/features/training/TrainResultMetricsTable'
import 'src/components/features/training/trainResultTheme.css'
import { ChartBarSquareIcon } from '@heroicons/react/20/solid'

const TrainResult = () => {
	const { projectInfo } = useOutletContext()
	const navigate = useNavigate()
	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)
	const experimentName = searchParams.get('experimentName')
	const experimentId = searchParams.get('experimentId')

	const {
		experiment,
		metrics,
		valGraphs,
		isDetailsExpanded,
		setIsDetailsExpanded,
		epoch,
	} = useTrainResultPage({
		experimentId,
		experimentName,
		projectId: projectInfo.id,
	})


	return (
		<div className="h-full overflow-y-auto bg-[var(--surface)]">
			<div className="relative z-10 w-full px-3 py-6 sm:px-4 lg:px-6 lg:py-8">
				<div className="mb-6 flex items-center gap-2">
				    <ChartBarSquareIcon className="w-12 h-12 text-blue-200 dark:text-white"/>
					<h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Training Result</h1>
				</div>
				<div className="flex w-full flex-col gap-6">
					<TrainResultSummaryCards
						metrics={metrics}
						experiment={experiment}
						epoch={epoch}
					/>

					<div className="flex w-full items-center justify-center">
						<Button
							type="primary"
							icon={<RocketOutlined />}
							onClick={async () => {
								const modelRes =
									await modelServiceAPI.getModelByExperimentId(
										experimentId
									)
								navigate(
									PATHS.MODEL_VIEW(
										projectInfo.id,
										modelRes.data.id
									)
								)
							}}
							size="large"
							className="deploy-btn-solid mt-4 h-[50px] w-[25%] font-poppins text-lg font-bold"
						>
							View Model
						</Button>
					</div>

					<div className="rounded-xl border border-[var(--border)] [background:var(--card-gradient)] p-4 shadow-lg backdrop-blur-md">
						<Button
							type="link"
							icon={<HistoryOutlined className="text-[#60a5fa]" />}
							onClick={() =>
								setIsDetailsExpanded(!isDetailsExpanded)
							}
							className="font-poppins text-xl text-[#e2e8f0]"
						>
							{isDetailsExpanded
								? 'Hide Details'
								: 'Show Detailed Results'}
						</Button>

						{isDetailsExpanded && (
							<div className="mt-4 flex w-full flex-col gap-6">
								<TrainResultPerformanceCharts
									valGraphs={valGraphs}
								/>
								<TrainResultMetricsTable metrics={metrics} />
								<Alert
									type="info"
									showIcon
									icon={<CloudDownloadOutlined />}
									className="border border-[var(--border)] bg-[var(--hover-bg)] font-poppins text-[var(--secondary-text)]"
									message="Tip: You can export these metrics and training history data for offline analysis or reporting."
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default TrainResult
