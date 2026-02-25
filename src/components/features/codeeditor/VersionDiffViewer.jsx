import { useState } from 'react'
import { Button } from 'src/components/shared/ui/button'
import { workspaceApi } from 'src/api/workspace'
import { toast } from 'sonner'
/**
 * Simple version diff viewer component
 * Shows file-by-file changes between two versions
 * 
 * Usage:
 * <VersionDiffViewer appId={appId} fromVersion={1} toVersion={2} />
 */
const VersionDiffViewer = ({ appId, fromVersion, toVersion }) => {
    const [diffData, setDiffData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const loadDiff = async () => {
        if (!appId || fromVersion == null || toVersion == null) {
            toast.error('Invalid version parameters')
            return
        }
        setIsLoading(true)
        try {
            const data = await workspaceApi.getVersionDiff(appId, fromVersion, toVersion)
            setDiffData(data)
        } catch (error) {
            console.error('Failed to load diff:', error)
            toast.error('Failed to load version diff')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="flex flex-col h-full bg-white border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-700">
                        Version Diff: v{fromVersion} → v{toVersion}
                    </h3>
                    {diffData && (
                        <span className="text-xs text-gray-500">
                            ({diffData.files_changed} {diffData.files_changed === 1 ? 'file' : 'files'} changed)
                        </span>
                    )}
                </div>
                <Button
                    size="sm"
                    onClick={loadDiff}
                    disabled={isLoading}
                    className="bg-blue-500 text-white"
                >
                    {isLoading ? 'Loading...' : diffData ? 'Refresh' : 'Show Diff'}
                </Button>
            </div>
            {/* Diff Content */}
            <div className="flex-1 overflow-auto p-4">
                {!diffData ? (
                    <div className="text-center text-gray-400 py-8">
                        Click "Show Diff" to compare versions
                    </div>
                ) : diffData.files?.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No changes between these versions
                    </div>
                ) : (
                    <div className="space-y-4">
                        {diffData.files?.map((file, idx) => (
                            <div
                                key={idx}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                                {/* File Header */}
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-mono font-semibold text-gray-700">
                                            {file.path}
                                        </span>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded ${file.status === 'added'
                                                    ? 'bg-green-100 text-green-700'
                                                    : file.status === 'deleted'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}
                                        >
                                            {file.status}
                                        </span>
                                    </div>
                                </div>
                                {/* Diff Content */}
                                <div className="bg-gray-900 p-4 overflow-x-auto">
                                    <pre className="text-xs font-mono text-gray-100 whitespace-pre">
                                        {file.diff}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Git Info */}
                {diffData?.git_enabled && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-gray-600">
                        <div className="font-semibold mb-1">Git Commits:</div>
                        <div className="font-mono space-y-1">
                            <div>From: {diffData.from_commit?.substring(0, 8)}</div>
                            <div>To: {diffData.to_commit?.substring(0, 8)}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default VersionDiffViewer
