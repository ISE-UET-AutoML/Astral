import { API_BASE_URL, API_URL } from 'src/constants/api'
import instance from './axios'

const URL = `${API_BASE_URL}/api/service/ml`
const AGGREGATE_URL = `${API_BASE_URL}/api/ml`

const getLatestModelVersionByModelId = (modelId) => {
    return instance.get(
        `${URL}/database_service/model-versions-service/latest?model_id=${modelId}`
    )
}

const getAllModelVersions = (modelId) => {
    return instance.get(
        `${URL}/database_service/model-versions-service?model_id=${modelId}`
    )
}

const getModelVersionById = (versionId) => {
    return instance.get(
        `${URL}/database_service/model-versions-service/${versionId}`
    )
}

const getMetricsForModelVersion = (modelVersionId) => {
    return instance.get(
        `${URL}/database_service/model_metrics_service/all?model_version_id=${modelVersionId}`
    )
}

export {
    getLatestModelVersionByModelId,
    getAllModelVersions,
    getModelVersionById,
    getMetricsForModelVersion,
}
