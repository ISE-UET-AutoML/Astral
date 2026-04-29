import React from 'react'
import { FolderPlus } from 'lucide-react'
import AIAssistantModal from './AIAssistantModal'
import ContentContainer from 'src/layouts/ContentContainer'
import { useProjects, useChatbot, useDatasets } from 'src/shared/hooks'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from 'src/components/ui/pagination'

// Components
import {
	ProjectHeader,
	TaskFilter,
	ProjectsGrid,
	CreationMethodModal,
	ManualCreationModal,
	DatasetSelectionModal,
} from 'src/features/projects/components'

// Hooks

export default function Projects() {
	const pageSize = 9
	const [currentPage, setCurrentPage] = React.useState(1)
	const {
		projectState,
		updateProjState,
		selectedTrainingTask,
		setSelectedTrainingTask,
		isSelected,
		projectName,
		description,
		setJsonSumm,
		selectType,
		getProjects,
		handleCreateProject,
		setTask,
		handleSearch,
		selectedSort,
		handleSortChange,
		searchValue,
		isReset,
		resetFilters,
		visibility,
	} = useProjects()

	const {
		input,
		setInput,
		messages,
		setMessages,
		showTitle,
		setShowTitle,
		showChatbotButtons,
		setShowChatbotButtons,
		chatContainerRef,
		handleKeyPress,
		newChat,
		proceedFromChat,
	} = useChatbot()

	const { selectedDataset, setSelectedDataset, datasets, getDatasets } = useDatasets()

	const handleProceedFromChat = async () => {
		const projectList = projectState.projects.map((project) => project.name)
		const jsonSummary = await proceedFromChat(projectList)
		if (jsonSummary) {
			setJsonSumm(jsonSummary)
			updateProjState({ showUploaderChatbot: false })
			updateProjState({ showUploaderManual: true })
			setTask(jsonSummary)
		} else {
			updateProjState({ showUploaderChatbot: false })
			updateProjState({ showUploaderManual: true })
		}
	}

	const folderPlusGradientId = `folder-plus-grad-${React.useId().replace(/:/g, '')}`

	React.useEffect(() => {
		const total = projectState.projects?.length || 0
		const totalPages = Math.max(1, Math.ceil(total / pageSize))
		if (currentPage > totalPages) setCurrentPage(1)
	}, [projectState.projects, currentPage])

	const startIndex = (currentPage - 1) * pageSize
	const paginatedProjects = (projectState.projects || []).slice(startIndex, startIndex + pageSize)
	const hasProjects = (projectState.projects || []).length > 0
	const totalPages = Math.max(
		1,
		Math.ceil(((projectState.projects || []).length || 0) / pageSize)
	)

	return (
		<div className="min-h-screen bg-white dark:bg-[#030712] text-gray-900 dark:text-white">
			<div className="min-h-screen pt-12 bg-white dark:bg-[#030712]">
				<main className="relative pt-20 px-6 pb-20">
					<ContentContainer className="relative z-10">
						{/* Header */}
						<ProjectHeader onNewProject={() => updateProjState({ showUploader: true })} />

						{/* Filter */}
						<TaskFilter
							selectedTrainingTask={selectedTrainingTask}
							onTaskChange={setSelectedTrainingTask}
							onReset={resetFilters}
							onSearch={handleSearch}
							selectedSort={selectedSort}
							onSortChange={handleSortChange}
							isReset={isReset}
							searchValue={searchValue}
						/>

						{/* Content */}
						{hasProjects ? (
							<>
								<ProjectsGrid
									projects={paginatedProjects}
									getProjects={getProjects}
									onCreateProject={() => updateProjState({ showUploaderManual: true })}
								/>
								<div className="mt-8">
									<Pagination>
										<PaginationContent className="gap-2">
											<PaginationItem>
												<PaginationPrevious
													href="#"
													text=""
													onClick={(event) => {
														event.preventDefault()
														if (currentPage > 1) setCurrentPage(currentPage - 1)
													}}
													className={
														currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
													}
												/>
											</PaginationItem>
											<PaginationItem>
												<div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200">
													{currentPage} / {totalPages}
												</div>
											</PaginationItem>
											<PaginationItem>
												<PaginationNext
													href="#"
													text=""
													onClick={(event) => {
														event.preventDefault()
														if (currentPage < totalPages) setCurrentPage(currentPage + 1)
													}}
													className={
														currentPage >= totalPages
															? 'pointer-events-none opacity-50'
															: ''
													}
												/>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</div>
							</>
						) : (
						<div className="flex flex-col items-center justify-center py-20 select-none">
							{/* Icon with layered glow rings */}
							<button
								onClick={() => updateProjState({ showUploader: true })}
								className="group relative flex items-center justify-center focus:outline-none"
								aria-label="Create new project"
							>
								{/* Outer pulse ring */}
								<span className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-blue-400/10 scale-125 animate-ping [animation-duration:2.8s] group-hover:bg-blue-400/20" />
								{/* Mid glow ring */}
								<span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/10 scale-110 blur-xl group-hover:scale-125 transition-transform duration-500" />
								{/* Icon card */}
								<span className="relative flex items-center justify-center w-36 h-36 rounded-3xl bg-white dark:bg-[#1c1c24] shadow-[0_8px_40px_rgba(59,130,246,0.25)] dark:shadow-[0_8px_48px_rgba(59,130,246,0.18)] ring-1 ring-black/5 dark:ring-white/8 group-hover:-translate-y-2 group-hover:shadow-[0_20px_56px_rgba(59,130,246,0.38)] dark:group-hover:shadow-[0_20px_56px_rgba(59,130,246,0.3)] transition-all duration-300 ease-out">
									<svg width="0" height="0" className="absolute" aria-hidden>
										<defs>
											<linearGradient
												id={folderPlusGradientId}
												x1="0"
												y1="12"
												x2="24"
												y2="12"
												gradientUnits="userSpaceOnUse"
											>
												<stop offset="0%" stopColor="#0066CC" />
												<stop offset="100%" stopColor="#29B6F6" />
											</linearGradient>
										</defs>
									</svg>
									<FolderPlus
										className="w-14 h-14 drop-shadow-[0_2px_8px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform duration-300"
										stroke={`url(#${folderPlusGradientId})`}
										strokeWidth={1.75}
										fill="none"
										aria-hidden
									/>
								</span>
							</button>

							<div className="mt-8 text-center space-y-2">
								<p className="text-xl font-semibold tracking-tight text-gray-800 dark:text-white">
									No Projects Yet
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
									Click the icon or use <span className="font-medium text-blue-500">New Project</span> to get started.
								</p>
							</div>
						</div>
						)}
					</ContentContainer>

					{/* Modals */}
					<CreationMethodModal
						open={projectState.showUploader}
						onCancel={() => updateProjState({ showUploader: false })}
						onSelectChatbot={() =>
							updateProjState({
								showUploader: false,
								showUploaderChatbot: true,
							})
						}
						onSelectManual={() =>
							updateProjState({
								showUploader: false,
								showUploaderManual: true,
							})
						}
					/>
					<ManualCreationModal
						open={projectState.showUploaderManual}
						onCancel={() => updateProjState({ showUploaderManual: false })}
						onSubmit={handleCreateProject}
						initialProjectName={projectName}
						initialDescription={description}
						initialVisibility={visibility}
						initialLicense="MIT"
						initialExpectedAccuracy={75}
						isSelected={isSelected}
						onSelectType={selectType}
					/>
					<DatasetSelectionModal
						open={projectState.showSelectData}
						onCancel={() => updateProjState({ showSelectData: false })}
						onConfirm={() => updateProjState({ showSelectData: false })}
						datasets={datasets}
						selectedDataset={selectedDataset}
						onSelectDataset={setSelectedDataset}
					/>
					<AIAssistantModal
						open={projectState.showUploaderChatbot}
						onCancel={() => updateProjState({ showUploaderChatbot: false })}
						messages={messages}
						showTitle={showTitle}
						showChatbotButtons={showChatbotButtons}
						input={input}
						setInput={setInput}
						handleKeyPress={handleKeyPress}
						selectedDataset={selectedDataset}
						datasets={datasets}
						getDatasets={() => getDatasets(updateProjState)}
						newChat={newChat}
						proceedFromChat={handleProceedFromChat}
						chatContainerRef={chatContainerRef}
						setShowTitle={setShowTitle}
						setMessages={setMessages}
						setShowChatbotButtons={setShowChatbotButtons}
					/>
				</main>
			</div>
		</div>
	)
}
