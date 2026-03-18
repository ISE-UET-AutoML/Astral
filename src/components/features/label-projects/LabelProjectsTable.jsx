import React from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from 'src/components/shared/ui/table'
import { Alert, AlertDescription, AlertTitle } from 'src/components/shared/ui/alert'
import { Tooltip } from 'src/components/shared/ui/tooltip'
import { Card, CardContent } from 'src/components/shared/ui/card'
import { CloudUploadIcon, InfoCircledIcon } from 'src/assets/svgicon'
import create_project from 'src/assets/images/create_project.png'
import BuildPager from 'src/pages/project/build/BuildPager'

export function LabelProjectsTable({
	tableLoading,
	hasProjects,
	filteredProjects,
	paginatedProjects,
	selectedRowKey,
	onSelectRow,
	renderServiceTag,
	renderLabeledTag,
	currentPage,
	totalItems,
	pageSize,
	onPageChange,
	onShowCreateDatasetModal,
}) {
	return (
		<Card className="rounded-2xl shadow-2xl border [border-color:var(--border)] [background:var(--card-gradient)] h-full w-full flex flex-col">
			<CardContent className="p-8 flex-1">
					<Alert className="mb-8 border text-[var(--text)] [border-color:var(--alert-info-border)] [background:var(--alert-info-bg)]">
						<InfoCircledIcon className="h-4 w-4 text-[var(--accent-text)]" />
						<AlertTitle className="font-medium text-[var(--text)]">
							Need help choosing a label project?
						</AlertTitle>
						<AlertDescription className="mt-1 text-[var(--secondary-text)]">
							If you're unsure about which project to select, look for one that
							matches your task type and is already labeled (marked with 'Yes').
							This will help you get started faster.
						</AlertDescription>
					</Alert>

					{tableLoading ? (
						<div className="flex items-center justify-center py-16">
							<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
							<span className="ml-4 text-gray-300 text-lg">
								Processing label project creation...
							</span>
						</div>
					) : hasProjects ? (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-12 text-center py-4 border-b [background:var(--table-header-bg)] [border-color:var(--table-header-border)]" />
										<TableHead className="font-semibold text-left py-4 border-b [background:var(--table-header-bg)] text-[var(--table-header-color)] [border-color:var(--table-header-border)]">
											Title
										</TableHead>
										<TableHead className="font-semibold text-center py-4 border-b [background:var(--table-header-bg)] text-[var(--table-header-color)] [border-color:var(--table-header-border)]">
											Service
										</TableHead>
										<TableHead className="font-semibold text-center py-4 border-b [background:var(--table-header-bg)] text-[var(--table-header-color)] [border-color:var(--table-header-border)]">
											Bucket
										</TableHead>
										<TableHead className="font-semibold text-center py-4 border-b [background:var(--table-header-bg)] text-[var(--table-header-color)] [border-color:var(--table-header-border)]">
											Labeled
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredProjects.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={5}
												className="text-center py-16"
											>
												<div className="text-[var(--secondary-text)]">
													<CloudUploadIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
													<p className="text-lg">
														No label projects match your current filters
													</p>
												</div>
											</TableCell>
										</TableRow>
									) : (
										paginatedProjects.map((project) => (
											<TableRow
												key={project.project_id}
												className={`transition-all duration-200 ${
													project.isLabeled
														? 'cursor-pointer'
														: 'opacity-50 cursor-not-allowed'
												} ${
													selectedRowKey === project.project_id
														? '[background:var(--selection-bg)]'
														: ''
												}`}
												onClick={() => {
													if (project.isLabeled) {
														onSelectRow(project.project_id)
													}
												}}
											>
												<TableCell className="py-4 text-center">
													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation()
															if (project.isLabeled) {
																onSelectRow(project.project_id)
															}
														}}
														className={`inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
															project.isLabeled
																? selectedRowKey === project.project_id
																	? 'border-[var(--accent-text)] bg-[var(--accent-text)] text-white'
																	: 'border-[var(--secondary-text)] text-[var(--secondary-text)] hover:border-[var(--accent-text)]'
																: 'border-gray-500/40 text-gray-500/40 cursor-not-allowed'
														}`}
														aria-label={
															selectedRowKey === project.project_id
																? 'Selected label project'
																: 'Select label project'
														}
													>
														{selectedRowKey === project.project_id && (
															<span className="block h-2.5 w-2.5 rounded-full bg-white" />
														)}
													</button>
												</TableCell>
												<TableCell className="font-medium py-4 text-[var(--text)]">
													{project.title}
												</TableCell>
												<TableCell className="text-center py-4">
													{renderServiceTag(project.service)}
												</TableCell>
												<TableCell className="text-center py-4 text-[var(--secondary-text)]">
													{project.bucketName}
												</TableCell>
												<TableCell className="text-center py-4">
													{project.isLabeled ? (
														renderLabeledTag(project.isLabeled)
													) : (
														<Tooltip title="This project has no labeled data and cannot be selected">
															{renderLabeledTag(project.isLabeled)}
														</Tooltip>
													)}
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-12">
							<img
								src={create_project}
								alt="Create project"
								className="w-[300px] max-w-[90%] cursor-pointer drop-shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
								onClick={onShowCreateDatasetModal}
							/>
							<div className="mt-6 text-center">
								<div className="font-poppins text-[var(--text)] text-[24px] font-semibold">
									No Label Projects Yet
								</div>
								<div className="font-poppins text-[var(--secondary-text)] mt-[6px]">
									Start by creating your Label Projects
								</div>
							</div>
						</div>
					)}
				</CardContent>
			<div className="px-8 pb-6 pt-0 shrink-0">
				<BuildPager
					currentPage={currentPage}
					totalItems={totalItems}
					pageSize={pageSize}
					onPageChange={onPageChange}
				/>
			</div>
		</Card>
	)
}

