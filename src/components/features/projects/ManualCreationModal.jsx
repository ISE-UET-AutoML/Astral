import React from 'react'
import MarkdownRenderer from 'src/components/shared/utilities/MarkdownRenderer'
import ProjectBaseModal from './ProjectBaseModal'
import { Button as GradientButton } from 'src/components/shared/ui/button'
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

// Simple replacements for Ant Design Typography components
const Title = ({ level = 4, style = {}, children, ...props }) => {
	const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}`
	return (
		<HeadingTag
			style={{
				margin: 0,
				fontFamily: 'Poppins, sans-serif',
				...style,
			}}
			{...props}
		>
			{children}
		</HeadingTag>
	)
}

const Text = ({ style = {}, children, ...props }) => (
	<p
		style={{
			margin: 0,
			fontFamily: 'Poppins, sans-serif',
			...style,
		}}
		{...props}
	>
		{children}
	</p>
)

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
	const [name, setName] = React.useState(initialProjectName)
	const [description, setDescription] = React.useState(initialDescription)
	const [taskType, setTaskType] = React.useState(initialTaskType)
	const [errors, setErrors] = React.useState({})

	const selectedIndex = Array.isArray(isSelected)
		? isSelected.findIndex((item) => item === true)
		: -1
	// const selectedProjectType = selectedIndex !== -1 ? projType[selectedIndex] : null
	const selectedTask = selectedIndex !== -1 ? taskCards[selectedIndex] : null
	const displayTask = selectedTask

	React.useEffect(() => {
		if (open) {
			setName(initialProjectName)
			setDescription(initialDescription)
			setTaskType(initialTaskType)
			setErrors({})
		}
	}, [
		open,
		initialProjectName,
		initialDescription,
		initialTaskType,
	])

	const validate = () => {
		const trimmedName = name.trim()
		const newErrors = {}

		if (!trimmedName) {
			newErrors.name = 'Please enter project name!'
		} else if (trimmedName.length < 3) {
			newErrors.name = 'Name must be at least 3 characters'
		} else if (!/^[\p{L}0-9 _-]+$/u.test(trimmedName)) {
			newErrors.name =
				'Only letters, numbers, spaces, _ and - are allowed.'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		if (!validate()) return

		onSubmit({
			name: name.trim(),
			description: description.trim(),
			task_type: taskType,
			visibility: initialVisibility,
			license: initialLicense,
			expected_accuracy: initialExpectedAccuracy,
		})
	}

	const handleSelectType = (e, idx) => {
		onSelectType(e, idx)
		setTaskType(projType[idx])
	}

	const content = (
		<form
			onSubmit={handleSubmit}
			className="theme-form theme-manual-form"
			style={{
				height: '95%',
				display: 'flex',
				flexDirection: 'column',
				scrollbarWidth: 'thin',
				scrollbarColor: '#94a3b8 transparent',
			}}
		>
			{/* Two-column overall layout: left = fields + task list, right = task details */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1.1fr 0.9fr',
					gap: 20,
					alignItems: 'stretch',
					height: 'calc(85vh - 180px)',
					overflow: 'hidden' /* Prevent overall overflow */,
				}}
			>
				{/* Left column */}
				<div
					style={{
						borderRight: '2px solid #0ea5e9',
						paddingRight: '12px',
						display: 'flex',
						flexDirection: 'column',
						overflow:
							'hidden' /* Prevent overflow in left column */,
					}}
				>
					<div style={{ marginBottom: 16 }}>
						<label
							htmlFor="project-name"
							style={{
								display: 'block',
								marginBottom: 8,
								color: 'var(--form-label-color)',
								fontFamily: 'Poppins, sans-serif',
								fontWeight: 600,
							}}
						>
							Project Name
						</label>
						<input
							id="project-name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="E.g., Customer Churn Predictor"
							className="w-full px-3 py-2 rounded-2xl mx-1 border bg-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
							style={{
								borderColor: 'var(--input-border)',
								color: 'var(--text)',
							}}
						/>
						{errors.name && (
							<p
								style={{
									marginTop: 4,
									color: '#f97373',
									fontSize: 12,
									fontFamily: 'Poppins, sans-serif',
								}}
							>
								{errors.name}
							</p>
						)}
					</div>

					{/* Description */}
					<div style={{ marginBottom: 16 }}>
						<label
							htmlFor="project-description"
							style={{
								display: 'block',
								marginBottom: 8,
								color: 'var(--form-label-color)',
								fontFamily: 'Poppins, sans-serif',
								fontWeight: 600,
							}}
						>
							Description
						</label>
						<input
							id="project-description"
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe your project's goals and requirements..."
							className="w-full px-3 py-2 rounded-2xl mx-1 border bg-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
							style={{
								borderColor: 'var(--input-border)',
								color: 'var(--text)',
							}}
						/>
					</div>

					{/* Task list box */}
					<div
						className="task-selection-container"
						style={{
							borderRadius: '16px',
							background: 'var(--filter-bg)',
							border: '1px solid var(--filter-border)',
							overflow: 'hidden',
							marginTop: 8,
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							minHeight: 0 /* Quan trọng để flex container có thể scroll */,
							scrollbarWidth: 'thin',
							scrollbarColor: '#94a3b8 transparent',
						}}
					>
						<Title
							level={4}
							style={{
								textAlign: 'center',
								margin: '12px 0',
								color: 'var(--title-project)',
								fontWeight: 700,
								fontFamily: 'Poppins, sans-serif',
								flexShrink: 0,
							}}
						>
							Choose Your Task
						</Title>
						<div
							className="task-list-column"
							style={{
								padding: '0 16px 16px 20px',
								borderTop: '1px solid var(--border)',
								flex: 1,
								overflowY: 'auto',
								minHeight: 0 /* Quan trọng để scroll hoạt động */,
								scrollbarWidth: 'thin',
								scrollbarColor: '#94a3b8 transparent',
							}}
						>
							<div
								style={{
									display: 'grid',
									gridTemplateColumns:
										'repeat(3, minmax(0, 1fr))',
									gap: '12px',
									paddingTop: '12px',
								}}
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
											style={{
												cursor: 'pointer',
												padding: '14px',
												borderRadius: '16px',
												border: '2px solid var(--border)',
												background: isTaskSelected
													? 'var(--selection-bg)'
													: 'var(--card-gradient)',
												transition: 'all 0.3s ease',
												position: 'relative',
												minHeight: '120px',
												overflow: 'hidden',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<div
												style={{
													display: 'flex',
													alignItems: 'flex-start',
													gap: '12px',
												}}
											>
												<div
													style={{
														fontSize: '24px',
														lineHeight: 1,
														marginTop: '2px',
													}}
												>
													{task.icon}
												</div>
												<div style={{ flex: 1 }}>
													<Title
														level={5}
														style={{
															margin: '0 0 4px 0',
															color: 'var(--text)',
															fontSize: '14px',
															fontWeight: 600,
															fontFamily:
																'Poppins, sans-serif',
														}}
														className="task-title"
													>
														{task.title}
													</Title>
												</div>

												{isTaskSelected && (
													<div
														style={{
															position:
																'absolute',
															top: '16px',
															right: '16px',
															width: '24px',
															height: '24px',
															borderRadius: '50%',
															background:
																'var(--button-gradient)',
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
															color: '#ffffff',
															fontSize: '14px',
															fontWeight: 'bold',
														}}
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
					style={{
						padding: '0 20px 20px 20px',
						overflowY: 'auto',
						display: 'flex',
						flexDirection: 'column',
						minHeight: 0 /* Quan trọng để scroll hoạt động */,
					}}
				>
					{displayTask ? (
						<div
							className="task-details"
							style={{
								width: '100%',
								minWidth: '300px',
								maxWidth: '100%',
							}}
						>
							<div
								style={{
									textAlign: 'center',
									marginBottom: '24px',
								}}
							>
								<Title
									level={3}
									style={{
										margin: '0 0 8px 0',
										color: 'var(--text)',
										fontWeight: 700,
										fontFamily: 'Poppins, sans-serif',
									}}
								>
									{displayTask.title}
								</Title>
								<Text
									style={{
										color: 'var(--secondary-text)',
										fontSize: '14px',
										lineHeight: '1.5',
										fontFamily: 'Poppins, sans-serif',
									}}
								>
									{displayTask.subtitle}
								</Text>
							</div>

							<div
								style={{
									width: '95%',
									height: '320px',
									borderRadius: '16px',
									overflow: 'hidden',
									marginBottom: '20px',
									boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
									border: '2px solid var(--border-hover)',
								}}
							>
								<img
									src={displayTask.image}
									alt={displayTask.title}
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
									}}
								/>
							</div>

							{/* Long explanation block (if provided) */}
							{displayTask.explain && (
								<div
									style={{
										background: 'var(--card-gradient)',
										border: '2px solid var(--border)',
										borderRadius: '16px',
										padding: '20px',
										marginBottom: '24px',
									}}
								>
									<Title
										level={5}
										style={{
											margin: '0 0 12px 0',
											color: 'var(--text, #ffffff)',
											fontFamily: 'Poppins, sans-serif',
											textAlign: 'center',
										}}
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
									style={{
										background: 'var(--card-gradient)',
										border: '2px solid var(--border)',
										borderRadius: '16px',
										padding: '20px',
										marginBottom: '24px',
									}}
								>
									<Title
										level={5}
										style={{
											margin: '0 0 16px 0',
											color: 'var(--text)',
											fontFamily: 'Poppins, sans-serif',
											textAlign: 'center',
										}}
									>
										Example
									</Title>
									<div style={{ marginBottom: '12px' }}>
										<Text
											style={{
												color: 'var(--secondary-text)',
												fontSize: '11px',
												fontWeight: 700,
												textTransform: 'uppercase',
												letterSpacing: '0.5px',
												fontFamily:
													'Poppins, sans-serif',
												display: 'block',
												marginBottom: '6px',
											}}
										>
											INPUT:
										</Text>
										<Text
											style={{
												color: 'var(--text)',
												fontSize: '13px',
												fontWeight: 500,
												fontFamily:
													'Poppins, sans-serif',
												lineHeight: '1.4',
											}}
										>
											{displayTask.example.input}
										</Text>
									</div>
									<div>
										<Text
											style={{
												color: 'var(--secondary-text)',
												fontSize: '11px',
												fontWeight: 700,
												textTransform: 'uppercase',
												letterSpacing: '0.5px',
												fontFamily:
													'Poppins, sans-serif',
												display: 'block',
												marginBottom: '6px',
											}}
										>
											OUTPUT:
										</Text>
										<Text
											style={{
												color: 'var(--accent-text)',
												fontSize: '13px',
												fontWeight: 600,
												fontFamily:
													'Poppins, sans-serif',
												lineHeight: '1.4',
											}}
										>
											{displayTask.example.output}
										</Text>
									</div>
									{displayTask.example_explain && (
										<div style={{ marginTop: '12px' }}>
											<Text
												style={{
													color: 'var(--secondary-text)',
													fontSize: '12px',
													fontFamily:
														'Poppins, sans-serif',
													whiteSpace: 'pre-wrap',
												}}
											>
												{displayTask.example_explain}
											</Text>
										</div>
									)}
								</div>
							)}

							<div
								style={{
									background: 'var(--tag-gradient)',
									border: '1px solid var(--tag-border)',
									borderRadius: '12px',
									padding: '16px',
									textAlign: 'center',
									marginBottom: '24px',
								}}
							>
								<Text
									style={{
										color: 'var(--secondary-text)',
										fontSize: '11px',
										fontWeight: 600,
										textTransform: 'uppercase',
										letterSpacing: '0.5px',
										fontFamily: 'Poppins, sans-serif',
										display: 'block',
										marginBottom: '6px',
									}}
								>
									Expected Training Time
								</Text>
								<Text
									style={{
										color: 'var(--text)',
										fontSize: '14px',
										fontWeight: 600,
										fontFamily: 'Poppins, sans-serif',
									}}
								>
									{displayTask.timeToTrain}
								</Text>
							</div>
						</div>
					) : (
						<div
							style={{
								textAlign: 'center',
								color: 'var(--secondary-text)',
								fontFamily: 'Poppins, sans-serif',
							}}
						>
							<div
								style={{
									fontSize: '48px',
									marginBottom: '16px',
									opacity: 0.5,
								}}
							>
								🎯
							</div>
							<Title
								level={4}
								style={{
									color: 'var(--secondary-text)',
									fontFamily: 'Poppins, sans-serif',
									fontWeight: 500,
								}}
							>
								Select a task type to see details
							</Title>
							<Text
								style={{
									color: 'var(--secondary-text)',
									fontSize: '14px',
									fontFamily: 'Poppins, sans-serif',
								}}
							>
								Choose from the options on the left to learn
								more
							</Text>
						</div>
					)}
				</div>
			</div>

			{/* Submit - fixed at bottom */}
			<div
				style={{
					marginTop: 'auto',
					position: 'sticky',
					bottom: 0,
					background: 'transparent',
					zIndex: 10,
					display: 'flex',
					justifyContent: 'flex-end',
					gap: 8,
					paddingTop: 8,
				}}
			>
				<button
					type="button"
					onClick={onCancel}
					className="px-8 py-2 rounded-xl border border-slate-500 text-slate-200 text-sm hover:bg-slate-700/60 transition-colors"
					style={{
						marginTop: 5,
					}}
				>
					Cancel
				</button>
				<GradientButton
					type="submit"
					size="sm"
					disabled={selectedIndex === -1}
					className="!h-10 !rounded-xl"
					style={{ marginTop: 5 }}
				>
					Create Project
				</GradientButton>
			</div>
		</form>
	)

	return (
		<>
			<ProjectBaseModal open={open} onCancel={onCancel} className="theme-manual-modal">
				<Title
					level={4}
					style={{
						textAlign: 'center',
						marginBottom: 16,
						color: 'var(--modal-title-color)',
						fontFamily: 'Poppins, sans-serif',
						fontWeight: 600,
					}}
				>
					Let&apos;s Create Your Project
				</Title>
				{content}
			</ProjectBaseModal>
		</>
	)
}

export default ManualCreationModal