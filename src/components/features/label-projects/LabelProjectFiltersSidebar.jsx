import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shared/ui/card'
import { CustomSelect, Option } from 'src/components/shared/ui/custom-select'
import { RadioGroup, RadioGroupItem } from 'src/components/shared/ui/radio-group'
import { Button } from 'src/components/shared/ui/button'
import { Tooltip } from 'src/components/shared/ui/tooltip'
import {
	ArrowRightIcon,
	InfoCircledIcon,
	MixerHorizontalIcon,
	SearchIcon,
	SortAscIcon,
	SortDescIcon,
} from 'src/assets/svgicon'

export function LabelProjectFiltersSidebar({
	searchQuery,
	onSearchChange,
	sortBy,
	onSortByChange,
	sortDirection,
	onSortDirectionChange,
	serviceFilter,
	onServiceFilterChange,
	bucketFilter,
	onBucketFilterChange,
	labeledFilter,
	onLabeledFilterChange,
	selectedRowKey,
	onContinue,
}) {
	return (
		<Card className="rounded-2xl shadow-2xl border [border-color:var(--border)] [background:var(--card-gradient)] h-full w-full flex flex-col">
			<CardHeader>
				<CardTitle className="flex items-center gap-3 text-lg text-[var(--text)]">
					<MixerHorizontalIcon className="h-5 w-5 text-[var(--accent-text)]" />
					Filter Options
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Search Input */}
				<div>
					<label className="flex items-center gap-2 font-medium mb-3 text-[var(--text)]">
						Search by Name
						<Tooltip title="Search for projects by name">
							<InfoCircledIcon className="h-4 w-4 cursor-help text-[var(--secondary-text)]" />
						</Tooltip>
					</label>
					<div className="relative">
						<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--secondary-text)]" />
						<input
							type="text"
							placeholder="Search projects..."
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className="w-full pl-10 pr-4 py-2 !rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--input-bg)] border-[var(--border)] text-[var(--text)]"
						/>
					</div>
				</div>

				{/* Sort Options */}
				<div>
					<label className="flex items-center gap-2 font-medium mb-3 text-[var(--text)]">
						Sort by
						<Tooltip title="Choose how to sort the projects">
							<InfoCircledIcon className="h-4 w-4 cursor-help text-[var(--secondary-text)]" />
						</Tooltip>
					</label>
					<div className="flex items-center gap-2 w-full">
						<div className="flex-1">
							<CustomSelect
								value={sortBy}
								onChange={onSortByChange}
								placeholder="Sort by"
								className="theme-dropdown w-full"
							>
								<Option value="name">Name</Option>
								<Option value="date">Date Added</Option>
							</CustomSelect>
						</div>

						<Tooltip
							title={`Sort ${
								sortDirection === 'asc' ? 'Ascending' : 'Descending'
							}`}
						>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									onSortDirectionChange(
										sortDirection === 'asc' ? 'desc' : 'asc'
									)
								}
								className="p-2 h-8 w-8 flex-shrink-0 border bg-[var(--input-bg)] border-[var(--border)] text-[var(--text)]"
							>
								{sortDirection === 'asc' ? (
									<SortAscIcon className="h-4 w-4" />
								) : (
									<SortDescIcon className="h-4 w-4" />
								)}
							</Button>
						</Tooltip>
					</div>
				</div>

				{/* Cloud Service Filter */}
				<div>
					<label className="flex items-center gap-2 font-medium mb-3 text-[var(--text)]">
						Cloud Service
						<Tooltip title="Choose the cloud storage service where your label project is stored">
							<InfoCircledIcon className="h-4 w-4 cursor-help text-[var(--secondary-text)]" />
						</Tooltip>
					</label>
					<CustomSelect
						value={serviceFilter}
						onChange={onServiceFilterChange}
						placeholder="Select Service"
						className="theme-dropdown"
					>
						<Option value="">All Services</Option>
						<Option value="AWS_S3">Amazon S3</Option>
						<Option value="GCP_STORAGE">Google Cloud Storage</Option>
					</CustomSelect>
				</div>

				{/* Storage Bucket Filter */}
				<div>
					<label className="flex items-center gap-2 font-medium mb-3 text-[var(--text)]">
						Storage Bucket
						<Tooltip title="Select the specific storage bucket containing your label project">
							<InfoCircledIcon className="h-4 w-4 cursor-help text-[var(--secondary-text)]" />
						</Tooltip>
					</label>
					<CustomSelect
						value={bucketFilter}
						onChange={onBucketFilterChange}
						placeholder="Select Bucket"
						className="theme-dropdown"
					>
						<Option value="">All Buckets</Option>
						<Option value="user-private-project">User Private Project</Option>
						<Option value="bucket-1">Bucket 1</Option>
					</CustomSelect>
				</div>

				{/* Project Status Filter */}
				<div>
					<label className="flex items-center gap-2 font-medium mb-3 text-[var(--text)]">
						Project Status
						<Tooltip title="Filter projects based on whether they're already labeled">
							<InfoCircledIcon className="h-4 w-4 cursor-help text-[var(--secondary-text)]" />
						</Tooltip>
					</label>
					<RadioGroup
						value={labeledFilter}
						onValueChange={onLabeledFilterChange}
						className="space-y-3"
					>
						<div
							className="flex items-center space-x-3 cursor-pointer"
							onClick={() => onLabeledFilterChange('')}
						>
							<RadioGroupItem value="" id="all" />
							<label
								htmlFor="all"
								className="cursor-pointer text-[var(--secondary-text)]"
							>
								All Projects
							</label>
						</div>
						<div
							className="flex items-center space-x-3 cursor-pointer"
							onClick={() => onLabeledFilterChange('yes')}
						>
							<RadioGroupItem value="yes" id="labeled" />
							<label
								htmlFor="labeled"
								className="cursor-pointer text-[var(--secondary-text)]"
							>
								Labeled Projects
							</label>
						</div>
						<div
							className="flex items-center space-x-3 cursor-pointer"
							onClick={() => onLabeledFilterChange('no')}
						>
							<RadioGroupItem value="no" id="unlabeled" />
							<label
								htmlFor="unlabeled"
								className="cursor-pointer text-[var(--secondary-text)]"
							>
								Unlabeled Projects
							</label>
						</div>
					</RadioGroup>
				</div>

				{/* Continue Button */}
				{selectedRowKey && (
					<Button
						onClick={onContinue}
						className="w-full font-semibold py-3 rounded-xl transition-all duration-200 text-white border [border-color:var(--border)] [background:var(--button-gradient)]"
					>
						<span className="flex items-center justify-center gap-2">
							Go to Training
							<ArrowRightIcon className="h-4 w-4" />
						</span>
					</Button>
				)}
			</CardContent>
		</Card>
	)
}

