import React from 'react'
import { Tooltip } from 'antd'

const ProjectHeader = ({ onNewProject }) => {

    return (
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold mb-0 text-gray-900 bg-gradient-to-r from-[#5C8DFF] to-[#5C8DFF] bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-[#5C8DFF] dark:to-[#5C8DFF] dark:bg-clip-text">
                    Projects
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-0 max-w-lg">
                    Create and manage your AI projects. Choose from various types of machine learning models to solve your specific problems.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Tooltip title="Create a new project with AI assistance or manual setup">
                    <button
                        onClick={onNewProject}
                        className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-white border-none bg-gradient-to-r from-blue-700 to-blue-600"
                    >
                        New Project
                    </button>
                </Tooltip>
            </div>
        </div>
    )
}

export default ProjectHeader