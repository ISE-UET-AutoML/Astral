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

import { Select } from 'src/components/shared/ui/Select'
import * as mlServiceAPI from 'src/api/mlService'
import * as modelServiceAPI from 'src/api/model'
import * as modelVersionServiceAPI from 'src/api/model_version'

const METRIC_MAP = {
  1: {
    name: "ACCURACY",
    description: "Proportion of correctly predicted samples",
  },
  2: {
    name: "F1",
    description: "Harmonic mean of precision and recall",
  },
  3: {
    name: "PRECISION",
    description: "Proportion of positive identifications that are correct",
  },
  4: {
    name: "RECALL",
    description: "Proportion of actual positives that are correctly identified",
  },
  5: {
    name: "F1_MACRO",
    description: "Macro-averaged F1 score across classes",
  },
  6: {
    name: "PRECISION_MACRO",
    description: "Macro-averaged precision across classes",
  },
  7: {
    name: "RECALL_MACRO",
    description: "Macro-averaged recall across classes",
  },
  8: {
    name: "IOU",
    description: "Intersection over Union, ratio of overlap to union of predicted and true regions",
  },
  9: {
    name: "MEAN_SQUARED_ERROR",
    description: "Average of squared differences between predicted and actual values",
  },
  10: {
    name: "MEAN_ABSOLUTE_ERROR",
    description: "Average of absolute differences between predicted and actual values",
  },
  11: {
    name: "R2_SCORE",
    description: "Coefficient of determination, proportion of variance explained by the model",
  },
  12: {
    name: "LOG_LOSS",
    description: "Logarithmic loss for probabilistic classification models",
  },
  13: {
    name: "SILHOUETTE_SCORE",
    description: "Measures how similar an object is to its own cluster compared to other clusters",
  },
  14: {
    name: "CALINSKI_HARABASZ_SCORE",
    description: "Ratio of between-cluster dispersion to within-cluster dispersion",
  },
  15: {
    name: "DAVIES_BOULDIN_SCORE",
    description: "Average similarity between each cluster and its most similar one, lower is better",
  },
};

const getAccuracyStatus = (score) => {
    const base = "px-3 py-1 rounded text-xs font-medium inline-block text-center min-w-[90px] border"
    if (score >= 0.9) return <span className={`${base} bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30`}>Excellent</span>
    if (score >= 0.7) return <span className={`${base} bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30`}>Good</span>
    if (score >= 0.6) return <span className={`${base} bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30`}>Medium</span>
    return <span className={`${base} bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30`}>Bad</span>
}

const ModelView = () => {
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
            const formattedMetrics = metricsData.map((item) => {
                const metricInfo = METRIC_MAP[item.metric_id] || { name: 'Unknown', description: 'No description' }
                return {
                    key: item.id,
                    metric: metricInfo.name,
                    value: parseFloat(item.score).toFixed(2),
                    description: metricInfo.description,
                    status: getAccuracyStatus(item.score),
                }
            })
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
                if (modelRes.status !== 200) {
                    message.error("Failed to load model info")
                    return
                }
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
        <div className="w-full min-h-0 bg-white dark:bg-[var(--surface)] font-poppins text-gray-900 dark:text-white mb-5">
            <div className="w-full px-4 pt-6 pb-10 lg:px-6 lg:pt-8 lg:pb-12 flex flex-col gap-6">

                {/* Version Selector */}
                {versions.length > 0 && (
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Model Version:</label>
                        <Select
                            value={selectedVersion?.id}
                            onChange={(v) => handleVersionSelect(Number(v))}
                            placeholder="Select version"
                            options={[...versions].sort((a, b) => b.version - a.version).map((v) => ({
                                value: v.id,
                                label: `v${v.version}`,
                            }))}
                            className="w-[140px]"
                        />
                    </div>
                )}

                {/* 1. TOP METRICS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-blue-100 dark:border-blue-500/20 p-6 bg-blue-50 dark:bg-blue-500/10">
                        <div className="text-blue-500 dark:text-blue-400 text-sm font-medium mb-2">Model Score</div>
                        <div className="text-4xl font-bold flex items-center gap-3 text-blue-600 dark:text-blue-300">
                            <TrophyOutlined className="text-blue-400 dark:text-blue-500 text-3xl" />
                            {(() => {
                                const accuracyMetric = metrics.find(m => m.metric === 'ACCURACY')
                                return accuracyMetric ? (accuracyMetric.value * 100).toFixed(2) : '—'
                            })()}%
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 bg-gray-50 dark:bg-white/5">
                        <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Model Size</div>
                        <div className="text-4xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                            <CloudDownloadOutlined className="text-gray-400 dark:text-gray-500 text-3xl" />
                            {(selectedVersion?.metadata?.model_size?.toFixed(2) || model.metadata?.model_size?.toFixed(2)) || 0} MB
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 bg-gray-50 dark:bg-white/5 overflow-hidden">
                        <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Model Name</div>
                        <div className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white truncate">
                            <ExperimentOutlined className="text-gray-400 dark:text-gray-500 shrink-0" />
                            <span className="truncate">{model.name || 'Unknown'}</span>
                        </div>
                    </div>
                </div>

                {/* 2. NEXT STEPS SECTION */}
                <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 lg:p-8 bg-gray-50 dark:bg-white/5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-5 rounded-full bg-blue-500 inline-block" />
                        Next Steps
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">

                        <div className="flex flex-col h-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[var(--surface)]">
                            <div className="p-5 flex flex-col gap-2 flex-1">
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                                    <RocketOutlined /> Deploy Model
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                    Instantly transform your trained model into a production-ready solution for real-world predictions.
                                </div>
                            </div>
                            <div className="px-5 pb-5">
                                <button
                                    onClick={() => navigate(`/app/project/${id}/build/deployView?modelId=${modelId}&modelVersionId=${selectedVersion?.version}`)}
                                    className="w-full py-2.5 rounded-xl font-semibold flex justify-center items-center gap-2 text-white text-sm hover:opacity-90 transition-opacity"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                                >
                                    <RocketOutlined /> Deploy Now
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col h-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[var(--surface)]">
                            <div className="p-5 flex flex-col gap-2 flex-1">
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                                    <CloudDownloadOutlined /> Download Weights
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                    Securely export and preserve your model's learned parameters for future iterations or transfer learning.
                                </div>
                            </div>
                            <div className="px-5 pb-5">
                                <button
                                    onClick={async () => {
                                        const urlResponse = await mlServiceAPI.getModelUrl(modelId)
                                        if (urlResponse.status !== 200) message.error("Failed to download model.")
                                        else window.location.href = urlResponse.data
                                    }}
                                    className="w-full py-2.5 rounded-xl font-semibold flex justify-center items-center gap-2 text-sm border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/15 transition-colors"
                                >
                                    <CloudDownloadOutlined /> Download
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col h-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[var(--surface)]">
                            <div className="p-5 flex flex-col gap-2 flex-1">
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                                    <HistoryOutlined /> Refine Model
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                    Continuously improve your model's performance by initiating a new training cycle with enhanced data.
                                </div>
                            </div>
                            <div className="px-5 pb-5">
                                <button
                                    onClick={() => navigate(`/app/project/${id}/model/${modelId}/retrain`)}
                                    className="w-full py-2.5 rounded-xl font-semibold flex justify-center items-center gap-2 text-sm border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/15 transition-colors"
                                >
                                    <HistoryOutlined /> Retrain Model
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. EXPANDABLE DETAILS SECTION */}
                <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 lg:p-8 bg-gray-50 dark:bg-white/5">
                    <button
                        onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                        className="text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 w-fit"
                    >
                        <span className="w-1 h-5 rounded-full bg-blue-500 inline-block" />
                        <BarChartOutlined className="text-blue-500 dark:text-blue-400" />
                        {isDetailsExpanded ? 'Hide Details' : 'Show Details'}
                    </button>

                    {isDetailsExpanded && (
                        <div className="flex flex-col gap-5 mt-6">

                            {/* Metadata */}
                            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[var(--surface)]">
                                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
                                    <span className="w-1 h-5 rounded-full bg-blue-500 shrink-0" />
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Metadata</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Details about the model and its expected input, output</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 p-3">
                                    {Object.entries((selectedVersion?.metadata || model.metadata) || {}).map(([key, value]) => (
                                        <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                            <span className="px-3 py-1 rounded-xl text-xs font-medium min-w-[130px] text-center shrink-0 bg-gray-100 dark:bg-white/10 text-blue-700 dark:text-blue-300 border border-gray-200 dark:border-white/15">
                                                {key}
                                            </span>
                                            <div className="flex-1 overflow-x-auto">
                                                {Array.isArray(value) ? (
                                                    key === "sample_data" && typeof value[0] === "object" && value[0] !== null ? (
                                                        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                                                        <table className="w-full text-left border-collapse text-sm">
                                                            <thead className="bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                                                                <tr>
                                                                    {Object.keys(value[0]).map((colKey) => (
                                                                        <th key={colKey} className="px-4 py-2.5 font-semibold capitalize border-b border-gray-200 dark:border-white/10">{colKey}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {value.map((row, idx) => (
                                                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-100 dark:border-white/10 last:border-0 transition-colors">
                                                                        {Object.values(row).map((cellVal, cIdx) => (
                                                                            <td key={cIdx} className="px-4 py-2.5 text-gray-700 dark:text-gray-300">
                                                                                {cellVal?.toString() || <em className="text-gray-400">(empty)</em>}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {value.map((item, idx) =>
                                                                typeof item === "object" && item !== null ? (
                                                                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/15">
                                                                        {item.name} {item.label ? `(${item.label})` : ""}
                                                                    </span>
                                                                ) : (
                                                                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/15">
                                                                        {item}
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    )
                                                ) : typeof value === "object" && value !== null ? (
                                                    <details className="group border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden w-fit min-w-[280px]">
                                                        <summary className="cursor-pointer px-4 py-2 text-sm flex justify-between items-center outline-none list-none text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-white/5 font-medium">
                                                            View Details <DownOutlined className="text-xs transition-transform group-open:-rotate-180 ml-2" />
                                                        </summary>
                                                        <div className="px-4 pb-4 pt-3 border-t border-gray-100 dark:border-white/10 flex flex-col gap-2">
                                                            {Object.entries(value).map(([subKey, subValue]) => (
                                                                <div key={subKey} className="flex flex-wrap items-center gap-2">
                                                                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium min-w-[90px] text-center bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/15">{subKey}</span>
                                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{subValue?.toString() || <em className="text-gray-400">(empty)</em>}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </details>
                                                ) : (
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{value?.toString() || <em className="text-gray-400">(empty)</em>}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Metrics Table */}
                            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[var(--surface)]">
                                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
                                    <span className="w-1 h-5 rounded-full bg-blue-500 shrink-0" />
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Model Metrics</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Detail about how well the model make predictions</p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto rounded-b-xl">
                                    <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                                        <thead className="bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                                            <tr>
                                                <th className="px-6 py-3 font-semibold border-b border-gray-100 dark:border-white/10">Metric</th>
                                                <th className="px-6 py-3 font-semibold border-b border-gray-100 dark:border-white/10">Value</th>
                                                <th className="px-6 py-3 font-semibold border-b border-gray-100 dark:border-white/10">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-700 dark:text-gray-300">
                                            {metrics.map((record) => (
                                                <tr key={record.key} className="hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-100 dark:border-white/10 last:border-0 transition-colors">
                                                    <td className="px-6 py-3">
                                                        <Tooltip title={record.description}>
                                                            <span className="cursor-help font-medium">{record.metric}</span>
                                                            <InfoCircleOutlined className="text-gray-400 ml-2 text-xs" />
                                                        </Tooltip>
                                                    </td>
                                                    <td className="px-6 py-3 font-semibold">{record.value}</td>
                                                    <td className="px-6 py-3">{record.status}</td>
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