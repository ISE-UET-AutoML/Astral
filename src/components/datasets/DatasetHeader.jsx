import React from 'react'
import { Tooltip } from 'antd'

const DatasetHeader = ({ onNewDataset }) => {
    return (
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold mb-0 text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-[#5C8DFF] dark:to-[#65FFA0] dark:bg-clip-text">
                    Datasets
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-0">
                    Upload and manage your datasets. Organize your data for machine learning projects and label your data for training.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Tooltip title="Create a new dataset">
                    <button
                        onClick={onNewDataset}
                        className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-white bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] hover:from-[#16213e] hover:to-[#0f3460] border border-white/20"
                    >
                        New Dataset
                    </button>
                </Tooltip>
            </div>
        </div>
    )
}

export default DatasetHeader
