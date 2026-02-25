import React from 'react'

// Components
import {
	ProjectHeader,
	TaskFilter,
	ProjectsGrid,
	CreationMethodModal,
	ManualCreationModal,
	DatasetSelectionModal,
} from 'src/components/projects'
import AIAssistantModal from './AIAssistantModal'
import ContentContainer from 'src/components/ContentContainer'
import BackgroundShapes from 'src/components/landing/BackgroundShapes'
import Pager from 'src/components/Pager'
import create_project from 'src/assets/images/create_project.png'

// Hooks
import { useProjects, useChatbot, useDatasets } from 'src/hooks'
import { useTheme } from 'src/theme/ThemeProvider'

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

	const { theme } = useTheme()

	React.useEffect(() => {
		const total = projectState.projects?.length || 0
		const totalPages = Math.max(1, Math.ceil(total / pageSize))
		if (currentPage > totalPages) setCurrentPage(1)
	}, [projectState.projects, currentPage])

	const startIndex = (currentPage - 1) * pageSize
	const paginatedProjects = (projectState.projects || []).slice(startIndex, startIndex + pageSize)
	const hasProjects = (projectState.projects || []).length > 0

	return (
		<div className="min-h-screen bg-white dark:bg-[#01000A] text-gray-900 dark:text-white">
			<div className="min-h-screen pt-12 bg-white dark:bg-[#01000A]">
				<main className="relative pt-20 px-6 pb-20">
					{theme === 'dark' && (
						<BackgroundShapes
							width="1280px"
							height="1100px"
							shapes={[
								{
									id: 'projectsBlue',
									shape: 'circle',
									size: '520px',
									gradient: { type: 'radial', shape: 'ellipse', colors: ['#5C8DFF 0%', '#5C8DFF 35%', 'transparent 75%'] },
									opacity: 0.45,
									blur: '220px',
									position: { top: '240px', right: '-140px' },
									transform: 'none',
								},
								{
									id: 'projectsCyan',
									shape: 'rounded',
									size: '420px',
									gradient: { type: 'radial', shape: 'circle', colors: ['#40FFFF 0%', '#40FFFF 55%', 'transparent 40%'] },
									opacity: 0.3,
									blur: '180px',
									position: { top: '60px', left: '-120px' },
									transform: 'none',
								},
								{
									id: 'projectsWarm',
									shape: 'rounded',
									size: '520px',
									gradient: { type: 'radial', shape: 'circle', colors: ['#FFAF40 0%', '#FFAF40 50%', 'transparent 85%'] },
									opacity: 0.25,
									blur: '220px',
									position: { top: '820px', left: '50%' },
									transform: 'translate(-50%, -50%)',
								},
							]}
						/>
					)}
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
									<Pager
										currentPage={currentPage}
										totalItems={(projectState.projects || []).length}
										pageSize={pageSize}
										onPageChange={setCurrentPage}
									/>
								</div>
							</>
						) : (
							<div className="flex flex-col items-center justify-center py-12">
								<img
									src={create_project}
									alt="Create project"
									className="w-[360px] max-w-[90%] cursor-pointer drop-shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
									onClick={() => updateProjState({ showUploaderManual: true })}
								/>
								<div className="mt-6 text-center">
									<div className="text-2xl font-semibold text-gray-900 dark:text-white">
										No Projects Yet
									</div>
									<div className="mt-1.5 text-gray-500 dark:text-gray-400">
										Start by creating your first AI project
									</div>
								</div>
							</div>
						)}
					</ContentContainer>

					{/* Modals */}
					<CreationMethodModal
						open={projectState.showUploader}
						onCancel={() => updateProjState({ showUploader: false })}
						onSelectChatbot={() => updateProjState({ showUploaderChatbot: true })}
						onSelectManual={() => updateProjState({ showUploaderManual: true })}
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
