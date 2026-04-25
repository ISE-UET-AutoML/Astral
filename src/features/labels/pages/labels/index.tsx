import React, { useReducer, useEffect, useState } from 'react'
import { Button as UiButton } from 'src/components/ui/button'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { toast } from 'sonner'
import { Plus as PlusOutlined } from 'lucide-react'
import LabelProjectCard from './card'
import CreateLabelProjectModal from './CreateLabelProjectModal'
import { createLbProject, getLbProjects, deleteProject } from 'src/features/labels/api/labelProject'
import { snakeToCamel } from 'src/utils/mapper'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const getToastContent = (value) => typeof value === 'object' && value?.content ? value.content : value
const message = { success: (value) => toast.success(getToastContent(value)), error: (value) => toast.error(getToastContent(value)), warning: (value) => toast.warning(getToastContent(value)), info: (value) => toast.info(getToastContent(value)), loading: (value) => toast.loading(getToastContent(value)) }
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }

const { Title } = Typography

const getCookies = (name) => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if(parts.length === 2) {
		return parts.pop().split(';').shift();
	}
	return null;
}

const initialState = {
	projects: [],
	isLoading: false,
	showCreator: false,
}

export default function LabelProjects() {
	const [projectState, updateProjectState] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		initialState
	)

	const [deletingIds, setDeletingIds] = useState(new Set())

	const getLabelProjects = async () => {
		try {
			const userId = getCookies('x-user-id');
			if (!userId) {
				console.error("User ID cookie not found");
				message.error("User not authenticated. Cannot fetch projects.");
				return;
			}
			const response = await getLbProjects(userId)
			console.log(snakeToCamel(response.data))

			updateProjectState({
				projects: snakeToCamel(response.data),
				isLoading: false
			})
		} catch (error) {
			console.error('Error fetching label projects:', error)
			message.error('Failed to fetch projects.');
			updateProjectState({ isLoading: false })
		}
	}

	const handleCreateProject = async (payload) => {
		try {
			const response = await createLbProject(payload)
			if (response.status === 201) {
				updateProjectState({ showCreator: false })
				getLabelProjects() // Refresh list after creation
			}
			console.log('Project created:', snakeToCamel(response.data))
		} catch (error) {
			console.error('Error creating label project:', error)
		}
	}

	const handleDeleteProject = async (projectId) => {
		setDeletingIds(prev => new Set(prev).add(projectId))
		try {
			await deleteProject(projectId)
			message.success('Project deleted successfully!')
			await getLabelProjects()
		} catch (error) {
			console.error('Error deleting label project:', error)
			message.error('Failed to project')
		} finally {
			setDeletingIds(prev => {
				const newSet = new Set(prev)
				newSet.delete(projectId)
				return newSet
			})
		}
	}

	useEffect(() => {
		getLabelProjects()
	}, [])

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<Title level={3}>Label Projects</Title>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => updateProjectState({ showCreator: true })}
				>
					New Label Project
				</Button>
			</div>

			{projectState.isLoading ? (
				<div className="text-center py-8">
					<p>Loading projects...</p>
				</div>
			) : projectState.projects.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{projectState.projects.map((project) => (
						<LabelProjectCard
							key={project.id}
							project={project}
							onDelete={() => handleDeleteProject(project.id)}
							isDeleting={deletingIds.has(project.id)}
						/>
					))}
				</div>
			) : (
				<Card className="text-center">
					<Title level={4}>No Label Projects Found</Title>
					<p>Get started by creating a new label project to annotate your data.</p>
				</Card>
			)}

			<CreateLabelProjectModal
				visible={projectState.showCreator}
				onCancel={() => updateProjectState({ showCreator: false })}
				onCreate={handleCreateProject}
			/>
		</div>
	)
}