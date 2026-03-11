import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tooltip, message } from 'antd'
import {
    HistoryOutlined,
    CloudDownloadOutlined,
    TrophyOutlined,
    RocketOutlined,
    BarChartOutlined,
    InfoCircleOutlined,
    ExperimentOutlined,
    DownOutlined
} from '@ant-design/icons'

import * as mlServiceAPI from 'src/api/mlService'
import * as modelServiceAPI from 'src/api/model'
import * as modelVersionServiceAPI from 'src/api/model_version'
import { useTheme } from 'src/theme/ThemeProvider'

// Hàm render Tag trạng thái
const getAccuracyStatus = (score) => {
    const baseClass = "px-3 py-1 rounded text-xs text-white font-poppins font-medium inline-block text-center min-w-[90px]"
    if (score >= 0.9) return <span className={`${baseClass} bg-gradient-to-br from-[#10b981] to-[#34d399]`}>Excellent</span>
    if (score >= 0.7) return <span className={`${baseClass} bg-gradient-to-br from-[#3b82f6] to-[#60a5fa]`}>Good</span>
    if (score >= 0.6) return <span className={`${baseClass} bg-gradient-to-br from-[#f59e0b] to-[#fbbf24]`}>Medium</span>
    return <span className={`${baseClass} bg-gradient-to-br from-[#ef4444] to-[#f87171]`}>Bad</span>
}

function toNormalCase(str) {
    if (!str) return "Null"
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const ModelView = () => {
    const { theme } = useTheme()
    const navigate = useNavigate()
    const { modelId, id } = useParams()
    const [model, setModel] = useState({})
    const [metrics, setMetrics] = useState([])
    const [versions, setVersions] = useState([])
    const [selectedVersion, setSelectedVersion] = useState(null)
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(true)

    const handleVersionSelect = async (versionId) => {
        try {
            const res = await modelVersionServiceAPI.getModelVersionById(versionId)
            if (res.status === 200) {
                setSelectedVersion(res.data)
                // fetch metrics for this version
                await fetchVersionMetrics(res.data.id)
            }
        } catch (err) {
            console.log("Error fetching version details", err)
        }
    }

    const fetchVersionMetrics = async (modelVersionId) => {
        setMetrics([])
        try {
            const metricsRes = await modelVersionServiceAPI.getMetricsForModelVersion(modelVersionId)
            if (metricsRes.status !== 200) throw new Error("Cannot get metrics")
            
            const metricsData = metricsRes.data || []
            const formattedMetrics = metricsData.map((item) => ({
                key: item.id,
                metric: item.metric_name || 'Unknown',
                value: parseFloat(item.score).toFixed(2),
                description: item.description || 'No description',
                status: getAccuracyStatus(item.score),
            }))
            setMetrics(formattedMetrics)
        }
        catch (error) {
            console.log("Error while getting metrics", error)
        }
    }

    useEffect(() => {
        const fetchModel = async () => {
            try {
                const modelRes = await modelServiceAPI.getModelById(modelId)
                if (modelRes.status !== 200) throw new Error("Cannot find model")
                
                const modelData = modelRes.data
                setModel(modelData)
            }
            catch (error) {
                console.log("Error while getting model", error)
            }
        }

        const loadVersions = async () => {
            try {
                const verRes = await modelVersionServiceAPI.getAllModelVersions(modelId)
                if (verRes.status === 200) {
                    const list = verRes.data || []
                    setVersions(list)
                    if (list.length) {
                        // sort descending by version number and pick first (latest)
                        const sorted = [...list].sort((a, b) => b.version - a.version)
                        handleVersionSelect(sorted[0].id)
                    }
                }
            } catch (err) {
                console.log("Error fetching model versions", err)
            }
        }

        fetchModel()
        loadVersions()
    }, [modelId])

    return (
        <div className="min-h-screen relative w-full bg-[var(--surface)] font-poppins text-[var(--text)]">
            {/* Chỉnh lại padding và giới hạn chiều rộng để cân đối với Sidebar */}
            <div className="relative z-10 w-full p-6 lg:p-8 flex flex-col gap-6">
                
                {/* Version Selector */}
                {versions.length > 0 && (
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-[var(--text)]">Model Version:</label>
                        <select
                            value={selectedVersion?.id || ''}
                            onChange={(e) => handleVersionSelect(Number(e.target.value))}
                            className="border border-[var(--border)] rounded px-3 py-2 bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--hover-bg)] transition-colors text-sm"
                        >
                            {versions
                                .sort((a, b) => b.version - a.version)
                                .map((v) => (
                                    <option key={v.id} value={v.id}>
                                        v{v.version}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}
                
                {/* 1. TOP METRICS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group rounded-2xl border border-[var(--border)] border-opacity-20 shadow-lg p-6 bg-[linear-gradient(135deg,var(--hover-bg)_0%,rgba(255,255,255,0.02)_100%)]">
                        <div className="text-[var(--secondary-text)] text-sm mb-3">Model {toNormalCase(metrics[0]?.metric)} Score</div>
                        <div className="text-4xl font-bold flex items-center gap-3">
                            <TrophyOutlined className="text-[#10b981]" />
                            <span className="bg-gradient-to-br from-[#10b981] to-[#34d399] bg-clip-text text-transparent">
                                {metrics[0]?.value ? (metrics[0]?.value * 100).toFixed(2) : 'NaN'}%
                            </span>
                        </div>
                    </div>

                    <div className="group rounded-2xl border border-[var(--border)] border-opacity-20 shadow-lg p-6 bg-[linear-gradient(135deg,var(--hover-bg)_0%,rgba(255,255,255,0.02)_100%)]">
                        <div className="text-[var(--secondary-text)] text-sm mb-3">Model Size</div>
                        <div className="text-4xl font-bold flex items-center gap-3">
                            <CloudDownloadOutlined className="text-[#f59e0b]" />
                            <span className="bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent">
                                {(selectedVersion?.metadata?.model_size || model.metadata?.model_size) || 0} MB
                            </span>
                        </div>
                    </div>

                    <div className="group rounded-2xl border border-[var(--border)] border-opacity-20 shadow-lg p-6 bg-[linear-gradient(135deg,var(--hover-bg)_0%,rgba(255,255,255,0.02)_100%)] overflow-hidden">
                        <div className="text-[var(--secondary-text)] text-sm mb-3">Model Name</div>
                        <div className="text-3xl font-bold flex items-center gap-3 truncate">
                            <ExperimentOutlined className="text-[#3b82f6]" />
                            <span className="text-[var(--text)] truncate">{model.name || 'Unknown'}</span>
                        </div>
                    </div>
                </div>

                {/* 2. NEXT STEPS SECTION */}
                <div className="rounded-3xl border border-[var(--border)] border-opacity-10 shadow-2xl p-6 lg:p-8 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.06)_100%)]">
                    <h2 className="text-xl font-bold text-[var(--text)] mb-6">Next Steps</h2>
                    
                    {/* Chỉnh các card bên trong đồng đều bằng h-full */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                        
                        {/* Deploy Card */}
                        <div className="flex flex-col h-full rounded-2xl border bg-[linear-gradient(135deg,rgba(16,185,129,0.05),rgba(52,211,153,0.05))] border-[rgba(16,185,129,0.2)]">
                            <div className="p-6 flex flex-col gap-2 flex-1">
                                <div className="flex items-center gap-2 text-[var(--text)] font-semibold text-lg">
                                    <RocketOutlined className="text-emerald-500" /> Deploy Model
                                </div>
                                <div className="text-[var(--secondary-text)] text-sm leading-relaxed">
                                    Instantly transform your trained model into a production-ready solution for real-world predictions.
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate(`/app/project/${id}/build/deployView?modelId=${modelId}`)}
                                className="mx-6 mb-6 mt-auto py-3 rounded-xl font-bold flex justify-center items-center gap-2 bg-gradient-to-br from-[#10b981] to-[#34d399] text-white hover:opacity-90 transition-opacity"
                            >
                                <RocketOutlined /> Deploy Now
                            </button>
                        </div>

                        {/* Download Card */}
                        <div className="flex flex-col h-full rounded-2xl border bg-[linear-gradient(135deg,rgba(245,158,11,0.05),rgba(251,191,36,0.05))] border-[rgba(245,158,11,0.2)]">
                            <div className="p-6 flex flex-col gap-2 flex-1">
                                <div className="flex items-center gap-2 text-[var(--text)] font-semibold text-lg">
                                    <CloudDownloadOutlined className="text-amber-500" /> Download Weights
                                </div>
                                <div className="text-[var(--secondary-text)] text-sm leading-relaxed">
                                    Securely export and preserve your model's learned parameters for future iterations or transfer learning.
                                </div>
                            </div>
                            <button 
                                onClick={async () => {
                                    const urlResponse = await mlServiceAPI.getModelUrl(modelId)
                                    if (urlResponse.status !== 200) message.error("Failed to download model.")
                                    else window.location.href = urlResponse.data
                                }}
                                className="mx-6 mb-6 mt-auto py-3 rounded-xl font-bold flex justify-center items-center gap-2 bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] text-white hover:opacity-90 transition-opacity"
                            >
                                <CloudDownloadOutlined /> Download
                            </button>
                        </div>

                        {/* Retrain Card */}
                        <div className="flex flex-col h-full rounded-2xl border bg-[linear-gradient(135deg,rgba(59,130,246,0.05),rgba(96,165,250,0.05))] border-[rgba(59,130,246,0.2)]">
                            <div className="p-6 flex flex-col gap-2 flex-1">
                                <div className="flex items-center gap-2 text-[var(--text)] font-semibold text-lg">
                                    <HistoryOutlined className="text-blue-500" /> Refine Model
                                </div>
                                <div className="text-[var(--secondary-text)] text-sm leading-relaxed">
                                    Continuously improve your model's performance by initiating a new training cycle with enhanced data.
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate(`/app/project/${id}/model/${modelId}/retrain`)}
                                className="mx-6 mb-6 mt-auto py-3 rounded-xl font-bold flex justify-center items-center gap-2 bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] text-white hover:opacity-90 transition-opacity"
                            >
                                <HistoryOutlined /> Retrain Model
                            </button>
                        </div>

                    </div>
                </div>

                {/* 3. EXPANDABLE DETAILS SECTION */}
                <div className="rounded-3xl border border-[var(--border)] border-opacity-10 shadow-2xl p-6 lg:p-8 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.06)_100%)]">
                    <button 
                        onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                        className="text-lg font-bold text-[var(--text)] hover:text-[#3b82f6] transition-colors flex items-center gap-3 w-fit"
                    >
                        <BarChartOutlined className="text-[#3b82f6]" />
                        {isDetailsExpanded ? 'Hide Details' : 'Show Detailed Model'}
                    </button>

                    {isDetailsExpanded && (
                        <div className="flex flex-col gap-6 mt-6">
                            
                            {/* Metadata */}
                            <div className="rounded-2xl border border-[var(--border)] border-opacity-20 p-6 bg-[var(--hover-bg)]">
                                <div className="flex items-baseline gap-2 mb-6">
                                    <h3 className="text-lg font-bold text-[var(--text)]">Metadata</h3>
                                    <span className="text-xs text-[var(--secondary-text)]">(Details about the model and its expected input, output)</span>
                                </div>
                                
                                <div className="flex flex-col gap-4">
                                    {Object.entries((selectedVersion?.metadata || model.metadata) || {}).map(([key, value]) => (
                                        <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-4 pb-4 border-b border-[var(--border)] border-opacity-30 last:border-0 last:pb-0">
                                            <span className="px-4 py-1.5 rounded bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] text-white text-sm font-medium min-w-[140px] text-center shrink-0">
                                                {key}
                                            </span>

                                            <div className="flex-1 overflow-x-auto pt-1">
                                                {Array.isArray(value) ? (
                                                    key === "sample_data" && typeof value[0] === "object" && value[0] !== null ? (
                                                        <table className="w-full text-left border-collapse rounded-xl overflow-hidden border border-[var(--border)]">
                                                            <thead className="bg-[#1e293b] text-slate-300 text-sm">
                                                                <tr>
                                                                    {Object.keys(value[0]).map((colKey) => (
                                                                        <th key={colKey} className="px-4 py-3 font-semibold capitalize border-b border-[var(--border)]">{colKey}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody className="text-sm">
                                                                {value.map((row, idx) => (
                                                                    <tr key={idx} className="bg-transparent hover:bg-slate-800/50 border-b border-[var(--border)] last:border-0 transition-colors">
                                                                        {Object.values(row).map((cellVal, cIdx) => (
                                                                            <td key={cIdx} className="px-4 py-3 text-[var(--text)]">
                                                                                {cellVal?.toString() || <em className="text-slate-500">(empty)</em>}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {value.map((item, idx) =>
                                                                typeof item === "object" && item !== null ? (
                                                                    <span key={idx} style={{ borderColor: item.color, color: item.color, backgroundColor: `${item.color}15` }} className="px-3 py-1 border rounded text-sm text-center min-w-[100px]">
                                                                        {item.name} {item.label ? `(${item.label})` : ""}
                                                                    </span>
                                                                ) : (
                                                                    <span key={idx} className="px-3 py-1 bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] text-white rounded text-sm">
                                                                        {item}
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    )
                                                ) : typeof value === "object" && value !== null ? (
                                                    <details className="group border border-[var(--border)] rounded-xl overflow-hidden bg-slate-800/30 w-fit min-w-[300px]">
                                                        <summary className="cursor-pointer px-5 py-2.5 font-medium text-sm flex justify-between items-center outline-none list-none text-[#3b82f6]">
                                                            View Details <DownOutlined className="text-xs transition-transform group-open:-rotate-180" />
                                                        </summary>
                                                        <div className="p-5 bg-black/20 border-t border-[var(--border)] flex flex-col gap-3">
                                                            {Object.entries(value).map(([subKey, subValue]) => (
                                                                <div key={subKey} className="flex flex-wrap items-center gap-3">
                                                                    <span className="px-3 py-1 bg-gradient-to-br from-[#10b981] to-[#34d399] text-white rounded text-xs min-w-[100px] text-center font-medium">{subKey}</span>
                                                                    <span className="text-sm text-[var(--text)]">{subValue?.toString() || <em className="text-slate-500">(empty)</em>}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </details>
                                                ) : (
                                                    <span className="text-sm flex items-center">{value?.toString() || <em className="text-slate-500">(empty)</em>}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Metrics Table */}
                            <div className="rounded-2xl border border-[var(--border)] border-opacity-20 p-6 bg-[var(--hover-bg)]">
                                <div className="flex items-baseline gap-2 mb-6">
                                    <h3 className="text-lg font-bold text-[var(--text)]">Model Metrics</h3>
                                    <span className="text-xs italic text-[var(--secondary-text)]">(Detail about how well the model make predictions)</span>
                                </div>
                                
                                <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                                    <table className="w-full text-left border-collapse whitespace-nowrap">
                                        <thead className="bg-[#1e293b] text-slate-300 text-sm">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold border-b border-[var(--border)]">Metric</th>
                                                <th className="px-6 py-4 font-semibold border-b border-[var(--border)]">Value</th>
                                                <th className="px-6 py-4 font-semibold border-b border-[var(--border)]">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {metrics.map((record) => (
                                                <tr key={record.key} className="bg-transparent hover:bg-slate-800/50 text-[var(--text)] border-b border-[var(--border)] last:border-0 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <Tooltip title={record.description}>
                                                            <span className="cursor-help font-medium">{record.metric}</span>
                                                            <InfoCircleOutlined className="text-[#3b82f6] ml-2" />
                                                        </Tooltip>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold">{record.value}</td>
                                                    <td className="px-6 py-4">{record.status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ModelView