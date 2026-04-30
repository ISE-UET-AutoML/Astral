import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CreateLabelProjectModal from "src/features/labels/pages/labels/CreateLabelProjectModal";
import CreateDatasetModal from "src/features/datasets/pages/datasets/CreateDatasetModal";
import { useLabelProjectsTable } from "src/features/labels/hooks/useLabelProjectsTable";
import { LabelProjectFiltersSidebar } from "src/features/labels/components/LabelProjectFiltersSidebar";
import { LabelProjectsTable } from "src/features/labels/components/LabelProjectsTable";
import { ExportProgressModal } from "src/features/labels/components/ExportProgressModal";

const UploadData = () => {
  const { updateFields, projectInfo } = useOutletContext();
  const navigate = useNavigate();
  const {
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
    selectedRowKeys,
    setSelectedRowKeys,
    currentPage,
    setCurrentPage,
    pageSize,
    filteredProjects,
    paginatedProjects,
    totalItems,
    hasProjects,
    tableLoading,
    isModalVisible,
    isExporting,
    showCreateDatasetModal,
    setShowCreateDatasetModal,
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
      <div className="w-full px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Choose Your Label Project
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select an existing label project or create a new one for your
            labeling task.
          </p>
        </div>

        {/* Two-column layout: sidebar + table */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">
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

          <div className="lg:col-span-3">
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
              onShowCreateDatasetModal={() => setShowCreateDatasetModal(true)}
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

      <ExportProgressModal isExporting={isExporting} />
      <CreateDatasetModal
        visible={showCreateDatasetModal}
        onCancel={() => setShowCreateDatasetModal(false)}
        onCreate={handleCreateDataset}
      />
    </>
  );
};

export default UploadData;
