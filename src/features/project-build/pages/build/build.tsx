import { useEffect, useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import * as projectAPI from 'src/features/projects/api/project'
import { useTheme } from 'src/theme/ThemeProvider'

const buildDraftKey = (projectId) => `astral:build:draft:${projectId}`

export default function ProjectBuild() {
	const { id: projectID } = useParams()
	const location = useLocation()
	const [projectInfo, setProjectInfo] = useState(null)
	const [data, setData] = useState({})

	useEffect(() => {
		const fetchProjectInfo = async () => {
			try {
				const response = await projectAPI.getProjectById(projectID)
				setProjectInfo(response.data.project)
			} catch (error) {
				console.error('Error fetching project:', error)
			}
		}

		fetchProjectInfo()
	}, [projectID])

	useEffect(() => {
		const selectedProject = location.state?.selectedProject
		if (!selectedProject?.dataset_id) return
		setData((prev) => ({
			...prev,
			selectedProject,
			...(Array.isArray(location.state?.trainingTags)
				? { trainingTags: location.state.trainingTags }
				: {}),
		}))
	}, [location.state])

	// Restore label-project + training mode draft after full page refresh (session only).
	useEffect(() => {
		if (!projectID) return
		try {
			const raw = sessionStorage.getItem(buildDraftKey(projectID))
			if (!raw) return
			const draft = JSON.parse(raw)
			if (!draft?.selectedProject?.dataset_id) return
			const restoredTrainingTags = Array.isArray(draft.trainingTags)
				? draft.trainingTags
				: draft.trainingTag != null
					? [draft.trainingTag]
					: []
			setData((prev) => {
				if (prev.selectedProject?.dataset_id) return prev
				return {
					...prev,
					selectedProject: draft.selectedProject,
					...(restoredTrainingTags.length > 0
						? { trainingTags: restoredTrainingTags }
						: {}),
				}
			})
		} catch (e) {
			console.warn('build draft restore failed', e)
		}
	}, [projectID])

	useEffect(() => {
		if (!projectID || !data.selectedProject?.dataset_id) return
		try {
			sessionStorage.setItem(
				buildDraftKey(projectID),
				JSON.stringify({
					selectedProject: data.selectedProject,
					...(Array.isArray(data.trainingTags) &&
					data.trainingTags.length > 0
						? { trainingTags: data.trainingTags }
						: {}),
				})
			)
		} catch (e) {
			console.warn('build draft persist failed', e)
		}
	}, [projectID, data.selectedProject, data.trainingTags])

	// Function to update data state
	function updateFields(fields) {
		setData((prev) => ({ ...prev, ...fields }))
	}

	return (
		<>
			<style>{`
                body, html {
                    font-family: 'Poppins', sans-serif !important;
                }
                * {
                    font-family: 'Poppins', sans-serif !important;
                }
            `}</style>
			<div
				className="relative h-full min-h-0 font-poppins"
				style={{ background: 'var(--surface)' }}
			>
				{projectInfo && (
					<Outlet context={{ ...data, updateFields, projectInfo }} />
				)}
			</div>
		</>
	)
}
