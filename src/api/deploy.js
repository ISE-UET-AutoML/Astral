import { API_BASE_URL, API_URL } from 'src/constants/api'
import instance from './axios'

const URL = `${API_BASE_URL}/api/service/ml`
const AGGREGATE_URL = `${API_BASE_URL}/api/ml`
const ADAPTIVE_URL = `${API_BASE_URL}/api/service/adaptive_model_to_app`

const getDeployedModel = (modelId) => {
	return instance.get(
		`${URL}/database_service/model_deploy_service/all?model_id=${modelId}`
	)
}

const getAllDeployedModel = (projectId) => {
	return instance.get(
		`${URL}/database_service/aggregator_service/all_deployed_models?project_id=${projectId}`
	)
}

const getDeployData = (deployId) => {
	return instance.get(
		`${URL}/database_service/model_deploy_service/find?deploy_id=${deployId}`
	)
}

const getDeployStatus = (modelId, deployModelId) => {
	return instance.get(
		`${AGGREGATE_URL}/model/${modelId}/${deployModelId}/deploy-progress`
	)
}

const getGenAppsList = (projectId, limit = 8, offset = 0) => {
	const params = { limit, offset }
	if (projectId) params.project_id = projectId
	return instance.get(`${ADAPTIVE_URL}/generated_app/list`, { params })
}

/**
 * Gen app từ một model có sẵn (adaptive-model-to-app pipeline).
 * Gọi POST /pipeline/run của service adaptive_model_to_app qua gateway.
 */
const genApp = ({ modelId, projectId, name, taskType, metadata }) => {
	const payload = {
		task: taskType || 'image_classification',
		name: name || null,
		project_id: projectId || null,
		model_id: String(modelId),
		requirements: '',
		skip_rent: false,
		instance_id: null,
		skip_deploy: false,
		metadata: metadata || null,
	}

	return instance.post(`${ADAPTIVE_URL}/pipeline/run`, payload)
}

export {
	getDeployedModel,
	getAllDeployedModel,
	getDeployData,
	getDeployStatus,
	getGenAppsList,
	genApp,
}
