import React from 'react'
import { Empty as UiEmpty, EmptyDescription as UiEmptyDescription } from 'src/components/ui/empty'
import DatasetCard from './DatasetCard'
import { Button } from 'src/components/ui/button'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Empty = ({ description = 'No data', className = '', ...props }) => <UiEmpty className={className} {...props}><UiEmptyDescription>{description}</UiEmptyDescription></UiEmpty>
const Pagination = ({ current = 1, total = 0, pageSize = 10, onChange, className = '', ...props }) => { const pages = Math.max(1, Math.ceil(total / pageSize)); return <div className={cx('flex items-center gap-2', className)} {...props}><button type="button" disabled={current <= 1} onClick={() => onChange?.(current - 1, pageSize)}>Prev</button><span>{current} / {pages}</span><button type="button" disabled={current >= pages} onClick={() => onChange?.(current + 1, pageSize)}>Next</button></div> }

const DatasetGrid = ({
	datasets,
	getDatasets,
	onCreateDataset,
	onDelete,
	deletingIds,
	currentPage,
	totalItems,
	pageSize,
	onPageChange,
	isLoading,
}) => {
	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-b-[var(--accent-text)]" />
					<p className="font-poppins text-[var(--text)]">Loading datasets...</p>
				</div>
			</div>
		)
	}

	if (datasets.length === 0) {
		return (
			<Empty
				image={Empty.PRESENTED_IMAGE_SIMPLE}
				imageStyle={{
					filter: 'invert(1)',
					opacity: 1,
					color: 'white',
				}}
				description={
					<div className="flex flex-col items-center gap-2">
						<p className="font-poppins text-2xl font-semibold text-[var(--text)]">
							No Datasets Yet
						</p>
						<p className="font-poppins text-sm text-[var(--secondary-text)]">
							Start by creating your first dataset
						</p>
						<Button
							variant="primary"
							size="sm"
							onClick={onCreateDataset}
							className="font-poppins border border-[var(--border)] [background:var(--button-gradient)] text-white"
						>
							Create Dataset
						</Button>
					</div>
				}
			/>
		)
	}

	return (
		<>
			<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{datasets.map((dataset) => (
					<div key={dataset.id} className="flex">
						<DatasetCard
							dataset={dataset}
							onDelete={onDelete}
							isDeleting={deletingIds.has(dataset.id)}
						/>
					</div>
				))}
			</div>

			{totalItems && totalItems > 0 && totalItems > pageSize && (
				<div className="flex justify-center">
					<Pagination
						current={currentPage}
						total={totalItems}
						pageSize={pageSize}
						onChange={onPageChange}
						showSizeChanger={false}
						className="custom-pagination"
					/>
				</div>
			)}
		</>
	)
}

export default DatasetGrid
