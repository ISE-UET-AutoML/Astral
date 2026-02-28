import { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import * as projectAPI from 'src/api/project'
import BackgroundShapes from 'src/components/landing/BackgroundShapes'
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
            <div className="min-h-screen relative font-poppins" style={{ background: 'var(--surface)' }}>
            {theme === 'dark' && (
                <BackgroundShapes width="1280px" height="1200px" grayVariant />
            )}
            {/* Pass data and update function via Outlet context */}
            {projectInfo && (
                <div className="relative z-10">
                    <Outlet context={{ ...data, updateFields, projectInfo }} />
                </div>
            )}
            </div>
        </>
    )
}
