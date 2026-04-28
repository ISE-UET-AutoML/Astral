import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CreateLabelProjectModal from "src/features/labels/pages/labels/CreateLabelProjectModal";
import { useTheme } from "src/theme/ThemeProvider";
import CreateDatasetModal from "src/features/datasets/pages/datasets/CreateDatasetModal";
import { useLabelProjectsTable } from "src/features/labels/hooks/useLabelProjectsTable";
import { LabelProjectFiltersSidebar } from "src/features/labels/components/LabelProjectFiltersSidebar";
import { LabelProjectsTable } from "src/features/labels/components/LabelProjectsTable";
import { ExportProgressModal } from "src/features/labels/components/ExportProgressModal";

const UploadData = () => {
  const { updateFields, projectInfo } = useOutletContext();
  const { theme } = useTheme();
  const navigate = useNavigate();
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
  } = useLabelProjectsTable({ projectInfo, updateFields, navigate });

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="w-full px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Choose Your Label Project
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
                Select an existing label project or create a new one for your
                labeling task
              </p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
              <div className="lg:col-span-1 flex">
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

              <div className="lg:col-span-3 flex">
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
    </>
  );
};

export default UploadData;
