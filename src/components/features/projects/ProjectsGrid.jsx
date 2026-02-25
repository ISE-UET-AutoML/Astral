import React from 'react'
import ProjectCard from 'src/pages/projects/card'

const ProjectsGrid = ({ projects, getProjects, onCreateProject }) => {
    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">No Projects Yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Start by creating your first AI project</p>
                <button
                    onClick={onCreateProject}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-lg"
                >
                    Create Project
                </button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    getProjects={getProjects}
                />
            ))}
        </div>
    )
}

export default ProjectsGrid
