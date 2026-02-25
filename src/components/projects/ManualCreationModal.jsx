import React from 'react'
import { Modal, Row, Col, Button, Typography, Input, Tag, Form } from 'antd'
import MarkdownRenderer from 'src/components/MarkdownRenderer.jsx'
// Removed Info icon for cleaner inputs

// import { TASK_TYPES } from 'src/constants/types'
import image_classification from 'src/assets/images/image_classification.jpeg'
import text_classification from 'src/assets/images/text_classification.jpeg'
import multilabel_text_classification from 'src/assets/images/multilabel_text_classification.jpeg'
import tabular_classification from 'src/assets/images/tabular_classification.jpeg'
import tabular_regression from 'src/assets/images/tabular_regression.jpeg'
import multilabel_tabular_classification from 'src/assets/images/multilabel_tabular_classification.jpeg'
import multimodal_classification from 'src/assets/images/multimodal_classification.jpeg'
import multilabel_image_classification from 'src/assets/images/multilabel_image_classification.jpg'
import object_detection from 'src/assets/images/object_detection.jpg'
import semantic_segmentation from 'src/assets/images/semantic_segmentation.jpg'
import time_series_forecasting from 'src/assets/images/time_series_forecasting.jpg'
import clustering from 'src/assets/images/clustering.jpeg'
import audio_classification from 'src/assets/images/audio_classification.jpeg'
import video_classification from 'src/assets/images/video_classification.jpeg'
import anomaly_detection from 'src/assets/images/anomaly_detection.JPG'
const { Title, Text } = Typography
// const { TextArea } = Input


const projType = [
	'image_classification',
	'text_classification',
	'multilabel_text_classification',
	'tabular_classification',
	'tabular_regression',
	'multilabel_tabular_classification',
	'multimodal_classification',
	'object_detection',
	'semantic_segmentation',
	'time_series_forecasting',
	'clustering',
	'audio_classification',
	'video_classification',
	'anomaly_detection',
]

// const tagIcons = { ...unused icon map removed }

const imgArray = [
	image_classification,
	text_classification,
	multilabel_text_classification,
	tabular_classification,
	tabular_regression,
	multilabel_tabular_classification,
	multimodal_classification,
	multilabel_image_classification,
	object_detection,
	semantic_segmentation,
	time_series_forecasting,
	clustering,
	audio_classification,
	video_classification,
	anomaly_detection,
]

const projectTypeImages = {}
projType.forEach((type, index) => {
	projectTypeImages[type] = imgArray[index]
})

// Task cards with original names and use cases
const taskCards = [
	{
		id: 'image_classification',
		title: 'Image Classification',
		subtitle: 'Recognize what’s in a picture',
		description:
			'Perfect for organizing photo collections, content moderation, and product categorization. Upload images and let AI automatically sort them by content.',
		icon: '📸',
		example_explain:
			'Classifies an input image into one of several categories.',
		explain: `📌 **This example shows how Image Classification works**.

In this example:

You have a photo of a pet, and you want the system to recognize what animal it is, such as a **dog** or a **cat**

🎯 Possible categories:

**Dog** → the image shows a dog

**Cat** → the image shows a cat`,

		image: image_classification,
		difficulty: 'Beginner',
		timeToTrain: '10-30 minutes',
	},
	{
		id: 'text_classification',
		title: 'Text Classification',
		subtitle: 'Assign each piece of text to a specific category',
		description:
			'Analyze customer reviews, emails, or documents to understand sentiment and automatically categorize content for better organization.',
		icon: '📝',
		example_explain: 'Predicts sentiment or topic for the given text.',
		explain: `📌 **This example shows how Text Classification works.**

In this example:

You have customer reviews about your products, and you want the system to categorize each review as either **positive** or **negative**

🎯 Possible categories:

**Positive** → the customer is happy or satisfied

**Negative** → the customer is unhappy or disappointed`,
		image: text_classification,
		difficulty: 'Beginner',
		timeToTrain: '5-15 minutes',
	},
	{
		id: 'multilabel_text_classification',
		title: 'Multilabel Text Classification',
		subtitle: 'Assign each piece of text to one or more categories',
		description:
			'When text needs multiple tags - like marking an email as both "urgent" and "customer-support" for better organization and routing.',
		icon: '🏷️',
		explain: `📌 **This example shows how Multilabel Text Classification works.**

In this example:

You have short descriptions of movies, and you want the system to identify all the **genres** each movie belongs to.

🎬 For example:

Description #1: “A superhero fights to save the world from a deadly threat.” → The system assigns the genres: **Action, Sci-Fi**

Description #2: “A heartwarming tale of friendship and romance.” → The system assigns the genres: **Romance, Comedy, Drama**


#### 🏷️ Possible Genres (Labels)
**Action**: exciting scenes, battles, or fast-paced events.  
**Sci-Fi**: futuristic or science-based stories.  
**Romance**: love stories or emotional relationships.  
**Comedy**: light-hearted and funny moments.  
**Drama**: serious or emotional storytelling.  `,

		image: multilabel_text_classification,
		difficulty: 'Intermediate',
		timeToTrain: '15-25 minutes',
	},
	{
		id: 'tabular_classification',
		title: 'Tabular Classification',
		subtitle:
			'Classify structured tabular data rows into predefined categories.',
		description:
			'Perfect for business analytics! Upload spreadsheet data and automatically categorize customers, transactions, or any structured data.',
		icon: '📊',
		example_explain: 'Predicts a class for each row in a structured table.',
		explain: `📌 **This example shows how Tabular Classification can classify each customer based on their information**.

In this example:

You have a table of customer information (such as: age, salary, and account balance), and you want the system to predict whether each customer **will churn** (leave your service) or **not churn** (stay).

🎯 For example:

#1 Customer with Age 35, Salary 50K, Balance 75K → The system predicts **Churn**

#2 Customer with Age 42, Salary 62K, Balance 12K → The system preidcts **No Churn**

----- 
**Churn**: the customer is likely to stop using the service  
**No Churn**: the customer is likely to stay
`,
		image: tabular_classification,
		difficulty: 'Beginner',
		timeToTrain: '5-20 minutes',
	},
	{
		id: 'tabular_regression',
		title: 'Tabular Regression',
		subtitle: 'Predict a number for each row in a table',
		description:
			'Forecast future values like house prices, sales numbers, or performance scores using your historical data patterns.',
		icon: '📈',
		explain: `📌 **This example shows how Tabular Regression can predict house prices based on simple features.**

You have a table with information about houses (such as: square footage, number of bedrooms, and location), and you want the system to predict **the price of each house**.

🏡 For example:  
House #1: 80 sq ft, 2 bedrooms, Suburban → Predicted price: **1.2M**  
House #2: 120 sq ft, 3 bedrooms, Suburban → Predicted price: **1.8M**    
House #3: 100 sq ft, 3 bedrooms, Downtown → Predicted price: **3.0M**    
House #4: 150 sq ft, 4 bedrooms, Downtown → Predicted price: **4.5M**`,
		image: tabular_regression,
		difficulty: 'Intermediate',
		timeToTrain: '10-30 minutes',
	},
	{
		id: 'multilabel_tabular_classification',
		title: 'Multilabel Tabular Classification',
		subtitle: 'Assign each row of a table to one or more categories',
		description:
			'Advanced analysis when data needs multiple classifications - essential for comprehensive customer profiling and risk assessment.',
		icon: '🔍',
		explain: `📌 **This example shows how Multilabel Classification works using movies.**  
		You have a table with information about movies (such as: title and release year), and you want the system to identify all the genres each movie belongs to.  
		🎬 For example:  
		Movie #1: "Avengers: Endgame" — The system assigns: **Action, Adventure, Sci-Fi**  
		Movie #2: "Titanic" — The system assigns: **Romance, Disaster, Historical**  
		Movie #3: "The Hangover" — The system assigns: **Comedy, Adventure**`,
		image: multilabel_tabular_classification,
		difficulty: 'Advanced',
		timeToTrain: '20-40 minutes',
	},
	{
		id: 'multimodal_classification',
		title: 'Multimodal Classification',
		subtitle:
			'Use information from different types of data, like text and images, to assign each item to a specific category.',
		description:
			'The most comprehensive approach! Analyze both visual and textual content together for social media, e-commerce, or content platforms.',
		icon: '🎯',
		example_explain: 'Combines image and text signals for classification.',
		explain: `📌 **This example shows how Multimodal Classification classifies customer feedback using multiple input types**.

In this example:

You have customer feedback that can include **text**, **a photo**, or even a **voice recording**, and you want the system to decide whether the feedback is **positive** or **negative**.

For example:  
**#1**: A review with written comments, a happy photo of the product, and a cheerful voice message  
 → The system classifies it as **Positive**  
**#2**: A review with a complaint in text, a damaged product image, and a frustrated voice recording  
 → The system classifies it as **Negative**  

-------
**Positive**: the customer is happy and satisfied  
**Negative**: the customer is unhappy and disappointed`,
		image: multimodal_classification,
		difficulty: 'Advanced',
		timeToTrain: '25-45 minutes',
	},
	{
		id: 'object_detection',
		title: 'Object Detection',
		subtitle: 'Identify and locate objects within images',
		description: 'Ideal for surveillance, inventory management, and autonomous vehicles. Detect multiple objects and their positions in a single image.',
		icon: '🎯',
		explain: `📌 **This example shows how Object Detection works.**`,
		image: object_detection,
		difficulty: 'Advanced',
		timeToTrain: '30-60 minutes',
	},
	{
		id: 'semantic_segmentation',
		title: 'Semantic Segmentation',
		subtitle: 'Classify each pixel in an image into a category',
		description: 'Perfect for medical imaging, autonomous driving, and image editing. Understand the context of each pixel for detailed analysis.',
		icon: '🖼️',
		explain: `📌 **This example shows how Semantic Segmentation works.**`,
		image: semantic_segmentation,
		difficulty: 'Advanced',
		timeToTrain: '40-70 minutes',
	},
	{
		id: 'time_series_forecasting',
		title: 'Time Series Forecasting',
		subtitle: 'Predict future values based on historical time-stamped data',
		description: 'Essential for sales forecasting, stock price prediction, and resource planning. Analyze trends and seasonal patterns to make informed decisions.',
		icon: '⏳',
		explain: `📌 **This example shows how Time Series Forecasting works.**`,
		image: time_series_forecasting,
		difficulty: 'Advanced',
		timeToTrain: '30-60 minutes',
	},
	{
		id: 'clustering',
		title: 'Clustering',
		subtitle: 'Predict future values based on historical time-stamped data',
		description: 'Essential for sales forecasting, stock price prediction, and resource planning. Analyze trends and seasonal patterns to make informed decisions.',
		icon: '🧩',
		explain: `📌 **This example shows how Clustering works.**`,
		image: clustering,
		difficulty: 'Advanced',
		timeToTrain: '30-60 minutes',
	},
	{
		id: 'audio_classification',
		title: 'Audio Classification',
		subtitle: 'Classify audio clips into predefined categories',
		description: 'Ideal for speech recognition, music genre classification, and environmental sound detection. Analyze audio data to extract meaningful insights.',
		icon: '🎵',
		explain: `📌 **This example shows how Audio Classification works.**`,
		image: audio_classification,
		difficulty: 'Advanced',
		timeToTrain: '30-60 minutes',
	}
	,{
		id: 'video_classification',
		title: 'Video Classification',
		subtitle: 'Classify videos into predefined categories',
		description: 'Perfect for content moderation, action recognition, and video recommendation systems. Analyze video data to categorize content effectively.',
		icon: '🎬',
		explain: `📌 **This example shows how Video Classification works.**`,
		image: video_classification,
		difficulty: 'Advanced',
		timeToTrain: '30-60 minutes',
	},
	{
		id: 'anomaly_detection',
		title: 'Anomaly Detection',
		subtitle: 'Identify unusual patterns in data',
		description: 'Ideal for fraud detection, network security, and fault detection. Analyze data streams to detect anomalies in real-time.',
		icon: '🔍',
		explain: `📌 **This example shows how Anomaly Detection works.**`,
		image: anomaly_detection,
		difficulty: 'Advanced',
		timeToTrain: '30-60 minutes',
	}
]

// const getImageByProjectType = (selectedProjectType) => projectTypeImages[selectedProjectType] || image_classification

const ManualCreationModal = ({
	open,
	onCancel,
	onSubmit,
	initialProjectName = '',
	initialDescription = '',
	initialTaskType = projType[0],
	initialVisibility = 'private',
	initialLicense = 'MIT',
	initialExpectedAccuracy = 75,
	isSelected,
	onSelectType,
}) => {
	const [form] = Form.useForm()
	// Dark mode flag not used here

	const selectedIndex = Array.isArray(isSelected)
		? isSelected.findIndex((item) => item === true)
		: -1
	// const selectedProjectType = selectedIndex !== -1 ? projType[selectedIndex] : null
	const selectedTask = selectedIndex !== -1 ? taskCards[selectedIndex] : null
	const displayTask = selectedTask

	React.useEffect(() => {
		if (open) {
			form.setFieldsValue({
				name: initialProjectName,
				description: initialDescription,
				task_type: initialTaskType,
				visibility: initialVisibility,
				license: initialLicense,
				expected_accuracy: initialExpectedAccuracy,
			})
		}
	}, [
		open,
		form,
		initialProjectName,
		initialDescription,
		initialTaskType,
		initialVisibility,
		initialLicense,
		initialExpectedAccuracy,
	])

	const handleSubmit = (values) => {
		onSubmit(values)
	}

	const handleSelectType = (e, idx) => {
		onSelectType(e, idx)
		form.setFieldValue('task_type', projType[idx])
	}

	const content = (
		<Form
			form={form}
			layout="vertical"
			onFinish={handleSubmit}
			className="theme-form theme-manual-form"
			className="h-[95%] flex flex-col" style={{ scrollbarWidth: 'thin', scrollbarColor: '#94a3b8 transparent' }}
			initialValues={{
				name: initialProjectName,
				description: initialDescription,
				task_type: initialTaskType,
			}}
		>
			{/* Two-column overall layout: left = fields + task list, right = task details */}
			<div
				className="grid grid-cols-2 gap-5"
			>
				{/* Left column */}
				<div
					className="border-r-2 border-[#0ea5e9] pr-3 flex"
				>
					<Row gutter={[24, 24]}>
						<Col span={24}>
							<Form.Item
								label="Project Name"
								name="name"
								className="!mb-4"
								validateTrigger={['onChange', 'onBlur']}
								rules={[
									{
										required: true,
										message: 'Please enter project name!',
									},
									{
										min: 3,
										message:
											'Name must be at least 3 characters',
									},
									{
										pattern: /^[\p{L}0-9 _-]+$/u,
										message:
											'Only letters, numbers, spaces, _ and - are allowed.',
									},
								]}
							>
								<Input
									placeholder="E.g., Customer Churn Predictor"
									size="large"
								/>
							</Form.Item>
						</Col>
					</Row>

					{/* Description */}
					<Row gutter={[24, 24]}>
						<Col span={24}>
							<Form.Item label="Description" name="description">
								<Input
									placeholder="Describe your project's goals and requirements..."
									size="large"
								/>
							</Form.Item>
						</Col>
					</Row>

					{/* Task list box */}
					<div
						className="task-selection-container"
						className="rounded-2xl bg-[var(--filter-bg)] border border-[var(--filter-border)] overflow-hidden mt-2 flex-1 flex flex-col min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#94a3b8 transparent' }}
					>
						<Title
							level={4}
							className="text-center my-3 text-[color:var(--title-project)] font-bold font-poppins shrink-0"
						>
							Choose Your Task
						</Title>
						<div
							className="task-list-column"
							className="pt-0 pr-4 pb-4 pl-5 border-t border-[var(--border)] flex-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#94a3b8 transparent' }}
						>
							<div
								className="grid grid-cols-3"
							>
								{taskCards.map((task, idx) => {
									const projTypeIndex = projType.findIndex(
										(type) => type === task.id
									)
									const isTaskSelected =
										isSelected && isSelected[projTypeIndex]

									return (
										<div
											key={task.id}
											className={`task-list-item ${isTaskSelected ? 'selected' : ''}`}
											onClick={(e) =>
												handleSelectType(
													e,
													projTypeIndex
												)
											}
											onKeyDown={(e) => {
												if (
													e.key === 'Enter' ||
													e.key === ' '
												) {
													e.preventDefault()
													handleSelectType(
														e,
														projTypeIndex
													)
												}
											}}
											tabIndex={0}
											role="button"
											aria-label={`Select ${task.title} task type`}
											aria-pressed={isTaskSelected}
											className="cursor-pointer p-[14px] rounded-2xl border-2 border-[var(--border)] transition-all duration-300 relative min-h-[120px] overflow-hidden flex items-center"
											style={{
												background: isTaskSelected
													? 'var(--selection-bg)'
													: 'var(--card-gradient)',
											}}
										>
											<div
												className="flex items-start gap-3"
											>
												<div
													className="text-2xl leading-none mt-[2px]"
												>
													{task.icon}
												</div>
												<div className="flex-1">
													<Title
														level={5}
														className="task-title !mb-1 !mt-0 text-[color:var(--text)] text-sm font-semibold font-poppins"
													>
														{task.title}
													</Title>
												</div>

												{isTaskSelected && (
													<div
														className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[var(--button-gradient)] flex items-center justify-center text-white text-sm font-bold"
													>
														✓
													</div>
												)}
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</div>

				{/* Right column - task details */}
				<div
					className="task-details-column"
					className="px-5 pb-5 overflow-y-auto flex flex-col"
				>
					{displayTask ? (
						<div
							className="task-details"
							className="w-full min-w-[300px] max-w-full"
						>
							<div
								className="text-center mb-6"
							>
								<Title
									level={3}
									className="!mb-2 !mt-0 text-[color:var(--text)] font-bold font-poppins"
								>
									{displayTask.title}
								</Title>
								<Text
									className="text-[color:var(--secondary-text)] text-sm leading-[1.5] font-poppins"
								>
									{displayTask.subtitle}
								</Text>
							</div>

							<div
								className="w-[95%] h-[320px] rounded-2xl overflow-hidden mb-5 shadow-[0_8px_24px_rgba(0,0,0,0.15)] border-2 border-[var(--border-hover)]"
							>
								<img
									src={displayTask.image}
									alt={displayTask.title}
									className="w-full h-full object-cover"
								/>
							</div>

							{/* Long explanation block (if provided) */}
							{displayTask.explain && (
								<div
									className="bg-[var(--card-gradient)] border-2 border-[var(--border)] rounded-2xl p-5 mb-6"
								>
									<Title
										level={5}
										className="!mt-0 !mb-3 text-[color:var(--text,#ffffff)] font-poppins text-center"
									>
										Explanation
									</Title>
									<MarkdownRenderer
										markdownText={displayTask.explain}
									/>
								</div>
							)}

							{displayTask.example && (
								<div
									className="bg-[var(--card-gradient)] border-2 border-[var(--border)] rounded-2xl p-5 mb-6"
								>
									<Title
										level={5}
										className="!mt-0 !mb-4 text-[color:var(--text)] font-poppins text-center"
									>
										Example
									</Title>
									<div className="mb-3">
										<Text
											className="text-[color:var(--secondary-text)] text-[11px] font-bold uppercase tracking-[0.5px] font-poppins block mb-[6px]"
										>
											INPUT:
										</Text>
										<Text
											className="text-[color:var(--text)] text-[13px] font-medium font-poppins leading-[1.4]"
										>
											{displayTask.example.input}
										</Text>
									</div>
									<div>
										<Text
											className="text-[color:var(--secondary-text)] text-[11px] font-bold uppercase tracking-[0.5px] font-poppins block mb-[6px]"
										>
											OUTPUT:
										</Text>
										<Text
											className="text-[color:var(--accent-text)] text-[13px] font-semibold font-poppins leading-[1.4]"
										>
											{displayTask.example.output}
										</Text>
									</div>
									{displayTask.example_explain && (
										<div className="mt-3">
											<Text
												className="text-[color:var(--secondary-text)] text-xs font-poppins whitespace-pre-wrap"
											>
												{displayTask.example_explain}
											</Text>
										</div>
									)}
								</div>
							)}

							<div
								className="bg-[var(--tag-gradient)] border border-[var(--tag-border)] rounded-xl p-4 text-center mb-6"
							>
								<Text
									className="text-[color:var(--secondary-text)] text-[11px] font-semibold uppercase tracking-[0.5px] font-poppins block mb-[6px]"
								>
									Expected Training Time
								</Text>
								<Text
									className="text-[color:var(--text)] text-sm font-semibold font-poppins"
								>
									{displayTask.timeToTrain}
								</Text>
							</div>
						</div>
					) : (
						<div
							className="text-center text-[color:var(--secondary-text)] font-poppins"
						>
							<div
								className="text-[48px] mb-4 opacity-50"
							>
								🎯
							</div>
							<Title
								level={4}
								className="text-[color:var(--secondary-text)] font-poppins font-medium"
							>
								Select a task type to see details
							</Title>
							<Text
								className="text-[color:var(--secondary-text)] text-sm font-poppins"
							>
								Choose from the options on the left to learn
								more
							</Text>
						</div>
					)}
				</div>
			</div>

			{/* Submit - fixed at bottom */}
			<Row
				justify="end"
				className="mt-auto sticky bottom-0 bg-transparent z-[1]"
			>
				<Button
					onClick={onCancel}
					className="mr-2 mt-[5px]"
				>
					Cancel
				</Button>
				<Button
					type="primary"
					htmlType="submit"
					disabled={selectedIndex === -1}
					className="mt-[5px]"
				>
					Create Project
				</Button>
			</Row>
		</Form>
	)

	return (
		<>
			<style>{`
                /* Form styling for proper theme support */
                .theme-manual-form .ant-form-item-label > label {
                    color: var(--form-label-color) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 600 !important;
                }

                .theme-manual-form .ant-input {
                    background: transparent !important;
                    border: 1px solid var(--input-border) !important;
                    color: var(--text) !important;
                    border-radius: 8px !important;
                }

                .theme-manual-form .ant-input:hover {
                    border-color: var(--input-hover-border) !important;
                }

                .theme-manual-form .ant-input:focus,
                .theme-manual-form .ant-input-focused {
                    border-color: var(--input-focus-border) !important;
                    box-shadow: var(--input-shadow) !important;
                    background: transparent !important;
                    color: var(--text) !important;
                    caret-color: var(--text) !important;
                }

                .theme-manual-form textarea.ant-input {
                    background: transparent !important;
                    color: var(--text) !important;
                    caret-color: var(--text) !important;
                }
                .theme-manual-form textarea.ant-input:focus,
                .theme-manual-form textarea.ant-input:hover {
                    background: transparent !important;
                }

                /* Stronger override for AntD textarea wrapper */
                .theme-manual-form .ant-input-textarea,
                .theme-manual-form .ant-input-textarea textarea,
                .theme-manual-form .ant-input {
                    background: transparent !important;
                    color: var(--text) !important;
                }

                .theme-manual-form .ant-input::placeholder {
                    color: var(--placeholder-color) !important;
                }

                /* Fixed Size Modal */
                .fixed-size-modal .ant-modal {
                    max-width: 80vw !important;
                }

                .fixed-size-modal .ant-modal-content {
                    overflow: hidden !important;
                }

                .fixed-size-modal .ant-modal-body {
                    overflow: hidden !important;
                }

                /* Task Selection Container */
                .task-selection-container {
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }

                /* Task List Items */
                .task-list-item {
                    backdrop-filter: blur(10px);
                    position: relative;
                    overflow: hidden;
                }

                /* Overlay no longer used for description; keep disabled */
                .task-list-item .task-overlay { display: none; }

                .task-list-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.05) 0%, 
                        rgba(255, 255, 255, 0.02) 100%
                    );
                    pointer-events: none;
                    border-radius: 16px;
                    z-index: 0;
                }

                .task-list-item:hover {
                    border-color: var(--accent-text) !important;
                    background: var(--hover-bg) !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2) !important;
                }

                .task-list-item.selected {
                    border-color: var(--accent-text) !important;
                    background: var(--selection-bg) !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3) !important;
                }

                /* Hover overlay to show description */
                .task-list-item .task-overlay { pointer-events: none; }
                .task-list-item:hover .task-overlay { opacity: 1; }
                .task-list-item:hover { transform: translateY(-2px) !important; }

                /* Custom scrollbar for task list */
                .task-list-column::-webkit-scrollbar {
                    width: 6px;
                }

                .task-list-column::-webkit-scrollbar-track {
                    background: var(--border);
                    border-radius: 3px;
                }

                .task-list-column::-webkit-scrollbar-thumb {
                    background: var(--accent-text);
                    border-radius: 3px;
                }

                .task-list-column::-webkit-scrollbar-thumb:hover {
                    background: var(--accent-text);
                    opacity: 0.8;
                }

                /* Responsive Design for Fixed Modal */
                @media (max-width: 1200px) {
                    .fixed-size-modal .ant-modal {
                        width: 95vw !important;
                    }
                }

                @media (max-width: 768px) {
                    .fixed-size-modal .ant-modal {
                        width: 95vw !important;
                        height: 70vh !important;
                    }

                    .fixed-size-modal .ant-modal-content {
                        height: 70vh !important;
                    }

                    .fixed-size-modal .ant-modal-body {
                        padding: 16px !important;
                        height: calc(70vh - 120px) !important;
                    }

                    .task-selection-container {
                        height: calc(70vh - 260px) !important;
                    }

                    .two-column-layout {
                        grid-template-columns: 1fr !important;
                        grid-template-rows: 45% 55% !important;
                    }

                    .task-list-column {
                        border-right: none !important;
                        border-bottom: 1px solid var(--border) !important;
                        padding: 0 16px 16px 16px !important;
                    }

                    .task-details-column {
                        padding: 16px !important;
                    }

                    .task-details {
                        max-width: 100% !important;
                        margin: 0 auto !important;
                    }

                    .task-details img {
                        height: 120px !important;
                    }
                }

                @media (max-width: 480px) {
                    .fixed-size-modal .ant-modal {
                        width: 98vw !important;
                        height: 70vh !important;
                    }

                    .fixed-size-modal .ant-modal-content {
                        height: 70vh !important;
                    }

                    .fixed-size-modal .ant-modal-body {
                        padding: 12px !important;
                        height: calc(70vh - 60px) !important;
                    }

                    .task-selection-container {
                        height: calc(70vh - 120px) !important;
                        border-radius: 12px !important;
                    }

                    .task-list-column {
                        padding: 0 12px 12px 12px !important;
                    }

                    .task-details-column {
                        padding: 12px !important;
                    }

                    .task-list-item {
                        padding: 16px !important;
                    }

                    .task-details img {
                        height: 100px !important;
                    }
                }

                /* Focus states for accessibility */
                .task-list-item:focus {
                    outline: 2px solid var(--accent-text);
                    outline-offset: 2px;
                }

                /* Loading and transition states */
                .task-details-fade-enter {
                    opacity: 0;
                    transform: translateY(10px);
                }

                .task-details-fade-enter-active {
                    opacity: 1;
                    transform: translateY(0);
                    transition: opacity 300ms ease, transform 300ms ease;
                }

                .task-details-fade-exit {
                    opacity: 1;
                    transform: translateY(0);
                }

                .task-details-fade-exit-active {
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: opacity 300ms ease, transform 300ms ease;
                }
            `}</style>
			<Modal
				open={open}
				onCancel={onCancel}
				footer={null}
				width="90vw"
				destroyOnClose
				centered
				className="theme-manual-modal fixed-size-modal"
				styles={{
					content: {
						background: 'var(--modal-bg)',
						borderRadius: '24px',
						boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
						border: '1px solid var(--modal-border)',
						overflow: 'hidden',
						backdropFilter: 'blur(20px)',
						maxHeight: '90vh',
					},
					header: {
						background: 'var(--modal-header-bg)',
						borderBottom:
							'1px solid var(--modal-header-border)',
						padding: '20px 24px 16px 24px',
						borderRadius: '24px 24px 0 0',
					},
					body: {
						background: 'transparent',
						padding: '20px',
						borderRadius: '0 0 24px 24px',
						maxHeight: 'calc(90vh - 100px)',
						overflowY: 'auto',
					},
				}}
			>
				<Title
					level={4}
					className="text-center mb-4 text-[color:var(--modal-title-color)] font-poppins font-semibold"
				>
					Let&apos;s Create Your Project
				</Title>
				{content}
			</Modal>
		</>
	)
}

export default ManualCreationModal