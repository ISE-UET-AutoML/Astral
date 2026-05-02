import React from 'react'
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
		<div className="fixed inset-0 bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-white">
			{/* Scrollable area — starts below the fixed navbar */}
			<main className="absolute top-16 left-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden px-6 py-8">
				<ContentContainer>
					<ProjectHeader onNewProject={() => updateProjState({ showUploader: true })} />

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

					<div className="border-t border-gray-200 pt-10 dark:border-white/10">
						<ProjectsGrid
							projects={paginatedProjects}
							getProjects={getProjects}
							onCreateProject={() => updateProjState({ showUploaderManual: true })}
						/>

					{hasProjects && totalPages > 1 && (
						<div className="mt-6">
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
											className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
										/>
									</PaginationItem>
									<PaginationItem>
										<div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 dark:border-white/10 dark:bg-slate-900 dark:text-gray-200">
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
											className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					)}
					</div>
				</ContentContainer>
			</main>

			{/* Modals — portal-rendered, unaffected by scroll container */}
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
		</div>
	)
}
