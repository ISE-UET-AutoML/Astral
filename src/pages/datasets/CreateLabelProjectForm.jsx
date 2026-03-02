// CreateLabelProjectForm.jsx
import React, { useState, useEffect, useRef } from 'react'
import { PlusIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Select } from 'src/components/shared/ui/Select'
import { Alert, AlertDescription } from 'src/components/shared/ui/alert'
import { Tag } from 'src/components/shared/ui/tag'
import { TASK_TYPES } from 'src/constants/types'
import { Info } from 'lucide-react'

/* ── Shared Tailwind helpers ───────────────────────────────────────────── */
const inputClass =
	"w-full px-3 py-2 rounded-[10px] border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-color)] placeholder-[var(--placeholder-color)] font-poppins text-sm outline-none box-border transition-[border-color,box-shadow] duration-200 focus:border-[var(--input-focus-border)] focus:shadow-[var(--input-shadow)]"

const primaryButtonClass =
	"inline-flex items-center justify-center px-5 py-2 rounded-lg border border-[var(--button-primary-border)] bg-[var(--button-primary-bg)] text-[var(--button-primary-color)] font-poppins font-medium text-sm cursor-pointer"

const defaultButtonClass =
	"inline-flex items-center justify-center px-5 py-2 rounded-lg border border-[var(--button-default-border)] bg-[var(--button-default-bg)] text-[var(--button-default-color)] font-poppins text-sm cursor-pointer"

const dashedButtonClass =
	"inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-[var(--button-dashed-border)] bg-[var(--button-dashed-bg)] text-[var(--button-dashed-color)] font-poppins text-sm"

/* ── FormField helper ─────────────────────────────────────────────────── */
const FormField = ({ label, required, children }) => (
	<div className="mb-4">
		<label className="block text-sm font-medium mb-1 text-[var(--form-label-color)] font-poppins">
			{label}
			{required && <span className="ml-1 text-red-500">*</span>}
		</label>
		{children}
	</div>
)

/* ── MultiSelect – multi-value dropdown ───────────────────────────────── */
const MultiSelect = ({
	options = [],
	value = [],
	onChange,
	placeholder = 'Select options',
	allowClear = false,
	showSearch = false,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [search, setSearch] = useState('')
	const containerRef = useRef(null)

	useEffect(() => {
		const handleOutside = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleOutside)
		return () => document.removeEventListener('mousedown', handleOutside)
	}, [])

	const toggle = (optValue) => {
		const newValue = value.includes(optValue)
			? value.filter(v => v !== optValue)
			: [...value, optValue]
		onChange(newValue)
	}

	const filteredOptions = showSearch && search
		? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
		: options

	return (
		<div ref={containerRef} className="relative w-full">
			<div
				className={`flex items-center justify-between rounded-xl cursor-pointer transition-all duration-200 min-h-[40px] px-3 py-2 bg-[var(--input-bg)] text-[var(--input-color)] border ${isOpen ? 'border-[var(--input-focus-border)]' : 'border-[var(--input-border)]'}`}
				onClick={() => setIsOpen(o => !o)}
			>
				<div className="flex flex-wrap gap-1 flex-1">
					{value.length > 0 ? (
						value.map(v => {
							const opt = options.find(o => o.value === v)
							return (
								<span
									key={v}
									className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border bg-[var(--tag-bg)] border-[var(--tag-border)] text-[var(--tag-color)]"
								>
									{opt ? opt.label : v}
									<button
										type="button"
										onClick={(e) => { e.stopPropagation(); toggle(v) }}
										className="p-0 m-0 border-none bg-transparent cursor-pointer text-inherit leading-none"
									>
										<XMarkIcon className="h-3 w-3" />
									</button>
								</span>
							)
						})
					) : (
						<span className="text-[var(--placeholder-color)] text-[14px]">{placeholder}</span>
					)}
				</div>
				<div className="flex items-center gap-1 ml-2 shrink-0">
					{allowClear && value.length > 0 && (
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); onChange([]) }}
							className="p-0 m-0 border-none bg-transparent cursor-pointer text-[var(--secondary-text)]"
						>
							<XMarkIcon className="h-3.5 w-3.5" />
						</button>
					)}
					<ChevronDownIcon
						className={`h-4 w-4 transition-transform duration-200 text-[var(--secondary-text)] ${isOpen ? 'rotate-180' : ''}`}
					/>
				</div>
			</div>

			{isOpen && (
				<div
					className="absolute z-[9999] w-full mt-1 rounded-xl border shadow-lg max-h-60 overflow-y-auto [background:var(--modal-bg)] border-[var(--input-border)]"
				>
					{showSearch && (
						<div className="p-2">
							<input
								type="text"
								value={search}
								onChange={e => setSearch(e.target.value)}
								placeholder="Search..."
								className="w-full px-2 py-1 rounded-[6px] border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-color)] outline-none text-[13px] box-border"
								onClick={e => e.stopPropagation()}
							/>
						</div>
					)}
					{filteredOptions.length === 0 ? (
						<div className="px-4 py-3 text-sm text-center text-[var(--secondary-text)]">
							No options available
						</div>
					) : (
						filteredOptions.map(opt => (
							<div
								key={opt.value}
								className={`px-4 py-2.5 text-sm cursor-pointer transition-colors text-[var(--input-color)] ${value.includes(opt.value) ? 'bg-[var(--hover-bg)]' : ''}`}
								onClick={() => toggle(opt.value)}
							>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										readOnly
										checked={value.includes(opt.value)}
										style={{ accentColor: 'var(--button-primary-bg)', cursor: 'pointer' }}
									/>
									<span>{opt.label}</span>
								</div>
							</div>
						))
					)}
				</div>
			)}
		</div>
	)
}

/* ── Main component ───────────────────────────────────────────────────── */
export default function CreateLabelProjectForm({
	onSubmit,
	onCancel,
	onBack,
	initialValues = {},
	loading,
	detectedLabels = [],
	csvMetadata = null,
	datasetType,
	taskType,
	description,
}) {
	const [projectName] = useState(initialValues?.name || '')
	const [expectedLabels, setLabels] = useState([])
	const [newLabel, setNewLabel] = useState('')
	const [columnOptions, setColumnOptions] = useState([])
	const [selectedImageColumn, setSelectedImageColumn] = useState(null)
	const [selectedSeriesColumn, setSelectedSeriesColumn] = useState(null)
	const [selectedTextColumn, setSelectedTextColumn] = useState(null)
	const [selectedFeaturesColumn, setSelectedFeaturesColumn] = useState(null)
	const [labelColors, setLabelColors] = useState({})

	const selectedTaskType = taskType
	const isManualLabelTask = (type) => ['SEMANTIC_SEGMENTATION', 'OBJECT_DETECTION'].includes(type)

	useEffect(() => {
		if (
			detectedLabels?.length > 0 &&
			(selectedTaskType === 'IMAGE_CLASSIFICATION' ||
				selectedTaskType === 'AUDIO_CLASSIFICATION' ||
				selectedTaskType === 'VIDEO_CLASSIFICATION')
		) {
			setLabels(detectedLabels)
		}
	}, [detectedLabels, selectedTaskType])

	useEffect(() => {
		if (csvMetadata?.columns) {
			const options = Object.entries(csvMetadata.columns).map(([key, val]) => ({
				value: key,
				label: `${key} (${val.unique_class_count ?? 0} classes)`,
				uniqueClassCount: val.unique_class_count ?? 0,
			}))
			setColumnOptions(options)
			if (options.length === 1 && !isManualLabelTask(selectedTaskType)) {
				setLabels([options[0].value])
			}
		} else {
			setColumnOptions([])
		}
	}, [csvMetadata])

	const handleAddLabel = () => {
		const v = newLabel.trim()
		if (v && !expectedLabels.includes(v)) {
			setLabels(prev => [...prev, v])
			setLabelColors(prev => ({
				...prev,
				[v]: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
			}))
			setNewLabel('')
		}
	}

	const handleRemoveLabel = (labelToRemove) => {
		setLabels(prev => prev.filter(l => l !== labelToRemove))
		setLabelColors(prev => {
			const copy = { ...prev }
			delete copy[labelToRemove]
			return copy
		})
	}

	const handleColorChange = (label, color) => {
		setLabelColors(prev => ({ ...prev, [label]: color }))
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const selectedLabel = expectedLabels[0]
		const column = columnOptions.find(opt => opt.value === selectedLabel)
		const uniqueClassCount = column?.uniqueClassCount ?? 0
		const is_binary_class = uniqueClassCount === 2

		const payload = {
			name: projectName,
			taskType,
			description,
			expectedLabels,
			meta_data: {
				is_binary_class,
				image_column: selectedImageColumn,
				label_colors: labelColors,
				series_column: selectedSeriesColumn,
				text_columns: selectedTextColumn,
				feature_columns: selectedFeaturesColumn,
			},
		}
		onSubmit(payload)
	}

	const isMultiLabel = selectedTaskType?.startsWith('MULTILABEL')
	const isClusteringOrAnomaly = selectedTaskType === 'CLUSTERING' || selectedTaskType === 'ANOMALY_DETECTION'

	return (
		<form onSubmit={handleSubmit}>
			{/* Project Name (disabled) */}
			<FormField label="Project Name" required>
				<input
					className={`${inputClass} bg-[var(--input-disabled-bg)] text-[var(--input-disabled-color)] cursor-not-allowed`}
					value={projectName}
					readOnly
					placeholder="Project name"
				/>
			</FormField>

			{/* TIME_SERIES: Series Column */}
			{datasetType === 'TIME_SERIES' && (
				<FormField label="Series Column" required>
					<Select
						placeholder="Select series column"
						value={selectedSeriesColumn || undefined}
						onChange={setSelectedSeriesColumn}
						allowClear
						options={columnOptions}
					/>
					{!selectedSeriesColumn && (
						<Alert variant="warning" className="mt-2">
							<AlertDescription>Please select a series column for TIME_SERIES datasets.</AlertDescription>
						</Alert>
					)}
				</FormField>
			)}

			{/* TEXT: Text Column */}
			{datasetType === 'TEXT' && (
				<FormField label="Text Column" required>
					<Select
						placeholder="Select text column"
						value={selectedTextColumn || undefined}
						onChange={setSelectedTextColumn}
						allowClear
						options={columnOptions}
					/>
					{!selectedTextColumn && (
						<Alert variant="warning" className="mt-2">
							<AlertDescription>Please select a text column for TEXT datasets.</AlertDescription>
						</Alert>
					)}
				</FormField>
			)}

			{/* MULTIMODAL: Image Column */}
			{datasetType === 'MULTIMODAL' && (
				<FormField label="Image Column" required>
					<Select
						placeholder="Select image column"
						value={selectedImageColumn || undefined}
						onChange={setSelectedImageColumn}
						allowClear
						options={columnOptions}
					/>
					{!selectedImageColumn && (
						<Alert variant="warning" className="mt-2">
							<AlertDescription>Please select an image column for MULTIMODAL datasets.</AlertDescription>
						</Alert>
					)}
				</FormField>
			)}

			{/* TABULAR: Features Column */}
			{datasetType === 'TABULAR' && (
				<FormField label="Features Column" required>
					<MultiSelect
						placeholder="Select one or more feature columns"
						value={selectedFeaturesColumn || []}
						onChange={setSelectedFeaturesColumn}
						allowClear
						showSearch
						options={columnOptions}
					/>
				</FormField>
			)}

			{/* Clustering / Anomaly Detection: Features Column */}
			{isClusteringOrAnomaly ? (
				<FormField label="Features Column" required>
					<MultiSelect
						placeholder="Select one or more feature columns"
						value={selectedFeaturesColumn || []}
						onChange={(vals) => {
							setSelectedFeaturesColumn(vals)
							setLabels(vals)
						}}
						allowClear
						showSearch
						options={columnOptions}
					/>
					{(!selectedFeaturesColumn || selectedFeaturesColumn.length === 0) && (
						<Alert variant="warning" className="mt-2">
							<AlertDescription>Please select one or more feature columns for CLUSTERING datasets.</AlertDescription>
						</Alert>
					)}
				</FormField>
			) : (
				/* Expected Labels */
				<FormField label="Expected Labels" required>
					{!selectedTaskType ? (
						<Alert variant="warning">
							<AlertDescription>Please select Task Type first</AlertDescription>
						</Alert>
					) : columnOptions.length > 0 && !isManualLabelTask(selectedTaskType) ? (
						/* CSV-based: pick column(s) */
						isMultiLabel ? (
							<MultiSelect
								placeholder="Select one or more label columns"
								value={expectedLabels}
								onChange={(value) => setLabels(value)}
								allowClear
								options={columnOptions}
							/>
						) : (
							<Select
								placeholder="Select a label column"
								value={expectedLabels[0] || undefined}
								onChange={(value) => setLabels(value ? [value] : [])}
								allowClear
								options={columnOptions}
							/>
						)
					) : (
						/* Manual entry: for IMAGE / SEGMENTATION / DETECTION */
						<>
							<div className="flex gap-2">
								<input
									className={inputClass}
									placeholder="Enter label name"
									value={newLabel}
									onChange={e => setNewLabel(e.target.value)}
									onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLabel() } }}
								/>
								<button
									type="button"
									onClick={handleAddLabel}
									disabled={!newLabel.trim()}
									className={`${dashedButtonClass} ${!newLabel.trim() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} whitespace-nowrap`}
								>
									<PlusIcon className="h-4 w-4" />
									Add
								</button>
							</div>

							{expectedLabels.length > 0 ? (
								<div className="flex flex-wrap gap-2 mt-2 dark:text-white text-blue-500">
									{expectedLabels.map(label => (
										<div key={label} className="flex items-center gap-1.5">
											<Tag variant="primary" className="flex items-center gap-1">
												{label}
												<button
													type="button"
													onClick={() => handleRemoveLabel(label)}
													className="p-0 m-0 border-none bg-transparent cursor-pointer text-inherit leading-none"
												>
													<XMarkIcon className="h-3 w-3" />
												</button>
											</Tag>
											{selectedTaskType === 'SEMANTIC_SEGMENTATION' && (
												<input
													type="color"
													value={labelColors[label] || '#ffffff'}
													onChange={e => handleColorChange(label, e.target.value)}
													title={`Color for ${label}`}
													className="w-7 h-7 border border-[var(--input-border)] rounded-[6px] cursor-pointer p-0.5 bg-[var(--input-bg)]"
												/>
											)}
										</div>
									))}
								</div>
							) : (
								<div variant="info" className="mt-2">
									<div className="flex items-center gap-2 pt-4 text-red-500">At least one label is required <div className="text-blue-500"><Info className="h-4 w-4 text-red-500"/></div> </div> 
								   
								</div>
							)}
						</>
					)}
				</FormField>
			)}

			{/* Divider */}
			<hr className="my-4 border-t border-[var(--divider-color)]" />

			{/* Actions */}
			<div className="flex justify-end gap-2">
				<button
					type="button"
					onClick={onBack}
					className={defaultButtonClass}
				>
					Back
				</button>
				<button
					type="submit"
					disabled={loading || expectedLabels.length === 0}
					className={`px-8 py-2 rounded-xl border border-blue-500 text-white text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-colors shadow-lg font-poppins ${loading || expectedLabels.length === 0 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
				>
					{loading ? 'Creating...' : 'Create'}
				</button>
			</div>
		</form>
	)
}
