import { API_BASE_URL, API_URL } from 'src/constants/api'
import instance from './axios'

const URL = `${API_BASE_URL}/api/service/ml`
const AGGREGATE_URL = `${API_BASE_URL}/api/ml`

const getLatestModelVersionByModelId = (modelId) => {
    return instance.get(
        `${URL}/database_service/model-versions-service/latest?model_id=${modelId}`
    )
}


export {
    getLatestModelVersionByModelId
}
