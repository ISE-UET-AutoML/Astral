import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import CreateLabelProjectModal from 'src/pages/labels/CreateLabelProjectModal'
// BackgroundShapes removed
import { useTheme } from 'src/theme/ThemeProvider'
import CreateDatasetModal from 'src/pages/datasets/CreateDatasetModal'
import { useLabelProjectsTable } from 'src/hooks/useLabelProjectsTable'
import { LabelProjectFiltersSidebar } from 'src/components/features/label-projects/LabelProjectFiltersSidebar'
import { LabelProjectsTable } from 'src/components/features/label-projects/LabelProjectsTable'
import { ExportProgressModal } from 'src/components/features/label-projects/ExportProgressModal'

const UploadData = () => {
	const { updateFields, projectInfo } = useOutletContext()
	const { theme } = useTheme()
	const navigate = useNavigate()
	const {
		// filters & sort
		serviceFilter,
		setServiceFilter,
		bucketFilter,
		setBucketFilter,
		labeledFilter,
		setLabeledFilter,
		searchQuery,
		setSearchQuery,
		sortBy,
		setSortBy,
		sortDirection,
		setSortDirection,
		// selection & pagination
		selectedRowKeys,
		setSelectedRowKeys,
		currentPage,
		setCurrentPage,
		pageSize,
		filteredProjects,
		paginatedProjects,
		totalItems,
		hasProjects,
		// ui state
		tableLoading,
		isModalVisible,
		isExporting,
		showCreateDatasetModal,
		setShowCreateDatasetModal,
		// actions
		handleContinue,
		showModal,
		hideModal,
		handleCreateLabelProject,
		handleCreateDataset,
		renderServiceTag,
		renderLabeledTag,
	} = useLabelProjectsTable({ projectInfo, updateFields, navigate })

	return (
		<div className="min-h-screen bg-[var(--surface)]">
			<div className="relative pt-20 px-6 pb-20">
				<div className="relative z-10">
					{/* Header Section */}
					<div className="mb-12 flex justify-center">
						<div className="w-full max-w-4xl text-center">
							<h1 className="mb-6 text-5xl font-bold md:text-6xl text-[var(--title-project)]">
								Choose Your Label Project
							</h1>
							<p className="mx-auto max-w-2xl text-xl text-[var(--secondary-text)]">
								Select an existing label project or create a new one <br /> for
								your labeling task
							</p>
						</div>
					</div>

					{/* Main Content */}
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						<div className="lg:col-span-1">
							<LabelProjectFiltersSidebar
								searchQuery={searchQuery}
								onSearchChange={setSearchQuery}
								sortBy={sortBy}
								onSortByChange={setSortBy}
								sortDirection={sortDirection}
								onSortDirectionChange={setSortDirection}
								serviceFilter={serviceFilter}
								onServiceFilterChange={setServiceFilter}
								bucketFilter={bucketFilter}
								onBucketFilterChange={setBucketFilter}
								labeledFilter={labeledFilter}
								onLabeledFilterChange={setLabeledFilter}
								selectedRowKey={selectedRowKeys}
								onContinue={handleContinue}
							/>
						</div>

						<div className="lg:col-span-3 space-y-6">
							<LabelProjectsTable
								tableLoading={tableLoading}
								hasProjects={hasProjects}
								filteredProjects={filteredProjects}
								paginatedProjects={paginatedProjects}
								selectedRowKey={selectedRowKeys}
								onSelectRow={setSelectedRowKeys}
								renderServiceTag={renderServiceTag}
								renderLabeledTag={renderLabeledTag}
								currentPage={currentPage}
								totalItems={totalItems}
								pageSize={pageSize}
								onPageChange={setCurrentPage}
								onShowCreateDatasetModal={() =>
									setShowCreateDatasetModal(true)
								}
							/>
						</div>
					</div>

					{/* Modals */}
					<CreateLabelProjectModal
						visible={isModalVisible}
						onCancel={hideModal}
						onCreate={handleCreateLabelProject}
					/>
				</div>
			</div>

			<ExportProgressModal isExporting={isExporting} />

			<CreateDatasetModal
				visible={showCreateDatasetModal}
				onCancel={() => setShowCreateDatasetModal(false)}
				onCreate={handleCreateDataset}
			/>
		</div>
	)
}

export default UploadData
