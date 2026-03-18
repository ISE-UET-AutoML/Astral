import { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import * as projectAPI from 'src/api/project'
import { useTheme } from 'src/theme/ThemeProvider'

export default function ProjectBuild() {
    const { id: projectID } = useParams()
    const { theme } = useTheme()
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
            <div className="relative h-full min-h-0 font-poppins" style={{ background: 'var(--surface)' }}>
            {projectInfo && (
                <Outlet context={{ ...data, updateFields, projectInfo }} />
            )}
            </div>
        </>
    )
}
