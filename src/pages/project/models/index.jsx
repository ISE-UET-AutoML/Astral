import ModelCard from './card'
import { useEffect, useState, useCallback } from 'react'
import { getModels } from 'src/api/model'
import { useParams } from 'react-router-dom'
import { Card, CardContent } from 'src/components/shared/ui/card'
import { useTheme } from 'src/theme/ThemeProvider'

// Simple SVG icons
const ModelIcon = ({ className, ...props }) => (
    <svg
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const EmptyIcon = ({ className, ...props }) => (
    <svg
        className={className}
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export default function ProjectModels() {
    const { id: projectId } = useParams()
    const { theme } = useTheme()
    const [models, setModels] = useState([])

    const getListModels = useCallback(async () => {
        if (!projectId) return;
        const { data } = await getModels(projectId)
        const sortedData = data.sort((a, b) => b.id - a.id)
        setModels(sortedData)
    }, [projectId])

    useEffect(() => {
        getListModels()
    }, [getListModels])

    return (
        <div className="relative min-h-screen bg-[var(--surface)]">
            <div className="relative z-10 p-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-xl bg-[var(--accent-gradient)] p-2">
                            <ModelIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--text)]">
                                Models
                            </h1>
                            <p className="mt-1 text-[var(--secondary-text)]">
                                {models.length} Models
                            </p>
                        </div>
                    </div>
                </div>

                {/* Models List */}
                {models.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {models.map((model) => (
                            <ModelCard key={model.id} model={{ ...model, project_id: projectId }} />
                        ))}
                    </div>
                ) : (
                    <Card className="rounded-2xl border border-[var(--border)] bg-[var(--card-gradient)] shadow-2xl">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-4 rounded-full bg-[var(--hover-bg)] p-4">
                                <EmptyIcon className="h-12 w-12 text-[var(--secondary-text)]" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-[var(--text)]">No Models</h3>
                            <p className="max-w-md text-center text-[var(--secondary-text)]">
                                You haven't created any models yet. Start by training a model to create your first model.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
