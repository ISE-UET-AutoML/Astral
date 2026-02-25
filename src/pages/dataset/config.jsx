import ImageClassDataView from 'src/components/features/dataset/View/ImageClassDataView'
import MultimodalClassDataView from 'src/components/features/dataset/View/MultimodalClassDataView'
import MultilabelImgClassDataView from 'src/components/features/dataset/View/MultilabelImgClassDataView'

const config = {
	IMAGE_CLASSIFICATION: {
		datasetView: ImageClassDataView,
	},
	TEXT_CLASSIFICATION: {
		datasetView: MultimodalClassDataView,
	},
	TABULAR_CLASSIFICATION: {
		datasetView: MultimodalClassDataView,
	},
	MULTIMODAL_CLASSIFICATION: {
		datasetView: MultimodalClassDataView,
	},
	MULTILABEL_IMAGE_CLASSIFICATION: {
		datasetView: MultilabelImgClassDataView,
	},
}

export default config
