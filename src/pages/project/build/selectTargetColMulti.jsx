import React, { useState, useEffect } from 'react'
import * as datasetAPI from 'src/api/dataset'
import * as projectAPI from 'src/api/project'
import { Button, Spin, Tooltip, message } from 'antd'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { InfoCircleOutlined } from '@ant-design/icons'

const detectImageColumns = (row) => {
	if (!row || typeof row !== 'object') return []

	const imageExtensions = [
		'.jpg',
		'.jpeg',
		'.png',
		'.gif',
		'.webp',
		'.bmp',
		'.svg',
	]
	const urlPattern = /^https?:\/\/.+/i // Kiểm tra URL hợp lệ

	return Object.keys(row).filter((col) => {
		const value = row[col]
		if (typeof value !== 'string') return false

		// Kiểm tra nếu giá trị có chứa phần mở rộng ảnh hoặc là một URL hợp lệ
		return (
			imageExtensions.some((ext) => value.toLowerCase().includes(ext)) ||
			urlPattern.test(value)
		)
	})
}

const getColumnType = (value) => {
	if (typeof value === 'string') {
		// Kiểm tra nếu giá trị là "TRUE" hoặc "FALSE" (không phân biệt chữ hoa/chữ thường)
		if (/^(true|false)$/i.test(value.trim())) return '#bool'

		// Kiểm tra nếu giá trị là một số (có thể chuyển đổi thành số)
		if (!isNaN(value) && !isNaN(parseFloat(value))) return '#int'

		// Kiểm tra nếu giá trị là URL
		if (/^https?:\/\/.+/i.test(value)) return '#url'

		// Kiểm tra nếu giá trị chứa phần mở rộng ảnh
		if (/(\.jpg|\.jpeg|\.png|\.gif|\.webp|\.bmp|\.svg)$/i.test(value))
			return '#img'

		// Mặc định là string
		return '#str'
	}
	if (typeof value === 'number') return '#int'
	if (typeof value === 'boolean') return '#bool'
	return '#unknown'
}

const SelectTargetColMulti = () => {
	const { projectInfo, selectedDataset } = useOutletContext()
	const navigate = useNavigate()
	const [dataset, setDataset] = useState(null)
	const [colsName, setColsName] = useState([])
	const [selectedTargetCol, setSelectedTargetCol] = useState(null)
	const [selectedImgCol, setSelectedImgCol] = useState(null)
	const [imgCols, setImgCols] = useState([])
	const [loading, setLoading] = useState(false)
	const [filterType, setFilterType] = useState(null) // State để lọc kiểu dữ liệu

	useEffect(() => {
		if (!selectedDataset?._id) return

		const fetchDataset = async () => {
			setLoading(true)
			try {
				const { data } = await datasetAPI.getDatasetPreview(
					selectedDataset._id,
					10
				)
				const iC = detectImageColumns(data.files[0])
				setImgCols(iC)
				setDataset(data.files)
				setColsName(Object.keys(data.files[0] || {}))
				setSelectedImgCol(iC[0])
			} catch (error) {
				console.error('Error fetching dataset:', error)
				message.error('Failed to load dataset. Please try again.')
			} finally {
				setLoading(false)
			}
		}

		fetchDataset()
	}, [selectedDataset?._id])

	const sendColumn = async () => {
		try {
			const formData = new FormData()
			formData.append('targetCol', selectedTargetCol)
			formData.append('imgCol', selectedImgCol)
			formData.append('datasetID', selectedDataset?._id)
			projectInfo.target_column = selectedTargetCol
			projectInfo.img_column = selectedImgCol

			const res = await projectAPI.sendTargetColumn(
				projectInfo._id,
				formData
			)
			if (res.status === 200) {
				message.success('Target Column Set Successfully', 3)
				navigate(`/app/project/${projectInfo._id}/build/selectInstance`)
			}
		} catch (error) {
			console.error('Error sending target column:', error)
			message.error('Failed to set target column. Please try again.')
		}
	}

	// Hàm lọc các cột dựa trên kiểu dữ liệu
	const getFilteredColumns = () => {
		if (!dataset || dataset.length === 0) return []

		const firstRow = dataset[0]
		return colsName.filter((col) => {
			const type = getColumnType(firstRow[col])
			// Loại bỏ các cột có kiểu dữ liệu là #url hoặc #img
			if (type === '#url' || type === '#img') return false

			// Nếu có filterType, chỉ hiển thị các cột có kiểu dữ liệu phù hợp
			if (filterType) return type === filterType

			// Mặc định hiển thị tất cả các cột không phải #url hoặc #img
			return true
		})
	}

	return (
		<div className="min-h-screen bg-[var(--surface)] px-6 py-6 font-poppins">
			<div className="mx-auto max-w-6xl rounded-2xl border border-[var(--border)] bg-[var(--card-gradient)] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
				<div className="mb-8 text-center">
					<h2 className="bg-[var(--title-gradient)] bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
						Select Target & Image Column
					</h2>
					<p className="mt-3 text-sm text-[var(--secondary-text)] md:text-base">
						Choose the target column for analysis and the image
						column containing visual data.
					</p>
				</div>

				<Spin spinning={loading}>
					<div className="grid gap-6 md:grid-cols-2">
						<div>
							<div className="mb-2 flex items-center gap-3">
								label
								<span className="text-sm font-semibold text-[var(--accent-text)]">
									Target Column
								</span>
								<Tooltip title="Select the column that contains the target data for analysis.">
									<InfoCircleOutlined className="text-xs text-[var(--secondary-text)]" />
								</Tooltip>
								<select
									className="ml-auto h-8 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-2 text-xs text-[var(--text)] focus:border-[var(--input-focus-border)] focus:outline-none"
									value={filterType || ''}
									onChange={(e) =>
										setFilterType(
											e.target.value || null
										)
									}
								>
									<option value="">All types</option>
									<option value="#str">#str</option>
									<option value="#int">#int</option>
									<option value="#bool">#bool</option>
								</select>
							</div>
							<select
								className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--input-focus-border)] focus:outline-none"
								value={selectedTargetCol || ''}
								onChange={(e) =>
									setSelectedTargetCol(
										e.target.value || null
									)
								}
							>
								<option value="">Select Target Column</option>
								{getFilteredColumns().map((col) => (
									<option key={col} value={col}>
										{col}
									</option>
								))}
							</select>
						</div>

						<div>
							<div className="mb-2 flex items-center gap-3">
								span
								<span className="text-sm font-semibold text-[var(--accent-text)]">
									Image Column
								</span>
								<Tooltip title="Select the column that contains image URLs or paths.">
									<InfoCircleOutlined className="text-xs text-[var(--secondary-text)]" />
								</Tooltip>
							</div>
							<select
								className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--input-focus-border)] focus:outline-none"
								value={selectedImgCol || ''}
								onChange={(e) =>
									setSelectedImgCol(
										e.target.value || null
									)
								}
							>
								<option value="">Select Image Column</option>
								{imgCols.map((col) => (
									<option key={col} value={col}>
										{col}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="mt-8 flex justify-center">
						<Button
							type="primary"
							size="large"
							onClick={sendColumn}
							disabled={!selectedTargetCol || !selectedImgCol}
							className="w-48 rounded-xl bg-[var(--button-primary-bg)] font-semibold text-[var(--button-primary-color)] shadow-md disabled:bg-[var(--input-disabled-bg)] disabled:text-[var(--input-disabled-color)]"
						>
							Confirm Selection
						</Button>
					</div>

					{dataset && (
						<div className="mt-8 max-h-[420px] overflow-auto rounded-xl border border-[var(--border)] bg-[var(--hover-bg)]">
							<table className="w-full border-collapse text-sm">
								<thead className="sticky top-0 text-center">
									<tr className="bg-gradient-to-r from-blue-500/20 to-emerald-400/20">
										{colsName.map((col) => (
											<th
												key={col}
												className="px-4 pt-2 text-xs font-semibold text-[var(--text)]"
											>
												{col}
											</th>
										))}
									</tr>
									<tr className="bg-black/20">
										{colsName.map((col) => (
											<th
												key={col}
												className="border-b border-[var(--border)] px-4 pb-2 text-[10px] font-normal text-[var(--secondary-text)]"
											>
												{getColumnType(
													dataset[0][col]
												)}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{dataset.map((row, rowIndex) => (
										<tr
											key={rowIndex}
											className="border-b border-[var(--border)] text-center transition-colors duration-200 hover:bg-cyan-500/10"
										>
											{colsName.map((col) => (
												<td
													key={col}
													className="max-w-[150px] truncate px-4 py-2 text-[var(--text)]"
													title={row[col]}
												>
													{row[col]}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</Spin>
			</div>
		</div>
	)
}

export default SelectTargetColMulti
