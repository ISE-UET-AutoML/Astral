import { API_BASE_URL, API_URL } from 'src/constants/api'
import instance from './axios'

const URL = `${API_BASE_URL}/api/service/ml`
const AGGREGATE_URL = `${API_BASE_URL}/api/ml`

const getLatestModelVersionByModelId = (modelId) => {
    return instance.get(
        `${URL}/database_service/model-versions-service/latest?model_id=${modelId}`
    )
}

// fetch all versions for a given model
const getAllModelVersions = (modelId) => {
    return instance.get(
        `${URL}/database_service/model-versions-service?model_id=${modelId}`
    )
}

// fetch a specific version by its ID
const getModelVersionById = (versionId) => {
    return instance.get(
        `${URL}/database_service/model-versions-service/${versionId}`
    )
}

export {
    getLatestModelVersionByModelId,
    getAllModelVersions,
    getModelVersionById,
}
