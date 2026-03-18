import ExperimentCard from './card'
import { useEffect, useState, useCallback } from 'react'
import { getAllExperiments } from 'src/api/experiment'
import { useParams } from 'react-router-dom'
import { Card, CardContent } from 'src/components/shared/ui/card'
import { useTheme } from 'src/theme/ThemeProvider'

// Simple SVG icons
const ExperimentIcon = ({ className, ...props }) => (
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
            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
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

export default function ProjectExperiments() {
    const { id: projectId } = useParams()
    const { theme } = useTheme()
    const [experiments, setExperiments] = useState([])

    const getListExperiments = useCallback(async () => {
        if (!projectId) return;
        const { data } = await getAllExperiments(projectId)
        const sortedData = data.sort((a, b) => b.id - a.id)
        setExperiments(sortedData)
    }, [projectId])

    useEffect(() => {
        getListExperiments()
    }, [getListExperiments])

    return (
        <div className="h-full overflow-y-auto bg-[var(--surface)]">
            <div className="relative z-10 w-full px-3 py-6 sm:px-4 lg:px-6 lg:py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-xl [background:var(--accent-gradient)] p-2">
                            <ExperimentIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--text)]">
                                Experiments
                            </h1>
                            <p className="mt-1 text-[var(--secondary-text)]">
                                {experiments.length} Experiments
                            </p>
                        </div>
                    </div>
                </div>

                {/* Experiments List */}
                {experiments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {experiments.map((experiment) => (
                            <ExperimentCard key={experiment.id} experiment={experiment} />
                        ))}
                    </div>
                ) : (
                    <Card className="rounded-2xl border border-[var(--border)] [background:var(--card-gradient)] shadow-2xl">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-4 rounded-full bg-[var(--hover-bg)] p-4">
                                <EmptyIcon className="h-12 w-12 text-[var(--secondary-text)]" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-[var(--text)]">No Experiments</h3>
                            <p className="max-w-md text-center text-[var(--secondary-text)]">
                                You haven't run any experiments yet. Start by training a model to create your first experiment.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
