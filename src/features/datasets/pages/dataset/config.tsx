import ImageClassDataView from 'src/features/datasets/components/View/ImageClassDataView'
import MultimodalClassDataView from 'src/features/datasets/components/View/MultimodalClassDataView'
import MultilabelImgClassDataView from 'src/features/datasets/components/View/MultilabelImgClassDataView'

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
