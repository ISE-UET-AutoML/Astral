import ImagePredict from 'src/components/features/predict/ImagePredict'
import TextPredict from 'src/components/features/predict/TextPredict'
import TabularPredict from 'src/components/features/predict/TabularPredict'
import MultimodalPredict from 'src/components/features/predict/MultimodalPredict'
import MultilabelTabularClassificationPredict from 'src/components/features/predict/MultilabelTabularClassificationPredict'
import TabularClassificationPredict from 'src/components/features/predict/TabularClassificationPredict'
import LabelingTextClassification from 'src/pages/project/build/labelData/labeling/LabelingTextClassification'
import LabelingImageClassification from 'src/pages/project/build/labelData/labeling/LabelingImageClassification'
import MultiLabelImgPredict from 'src/components/features/predict/MultiLabelImgPredict'
import TextLiveInfer from 'src/components/features/liveinfer/TextLiveInfer'
import AudioClassificationPredict from 'src/components/features/predict/AudioClassificationPredict'
import { UploadTypes } from 'src/constants/file'

// Empty component fallback
const EmptyLiveInfer = () => <></>

const config = {
	IMAGE_CLASSIFICATION: {
		afterUploadURL: 'chooseTrainingMode',
		folder: UploadTypes.FOLDER,
		labelingView: LabelingImageClassification,
		predictView: ImagePredict,
		liveInferView: EmptyLiveInfer,
	},
	TEXT_CLASSIFICATION: {
		folder: UploadTypes.CSV_SINGLE,
		afterUploadURL: 'chooseTrainingMode',
		labelingView: LabelingTextClassification,
		predictView: TextPredict,
		liveInferView: TextLiveInfer,
	},
	MULTILABEL_TEXT_CLASSIFICATION: {
		folder: UploadTypes.CSV_SINGLE,
		afterUploadURL: 'chooseTrainingMode',
		labelingView: LabelingTextClassification,
		predictView: TextPredict,
		liveInferView: TextLiveInfer,
	},
	TABULAR_CLASSIFICATION: {
		folder: UploadTypes.CSV_SINGLE,
		afterUploadURL: 'chooseTrainingMode',
		labelingView: LabelingTextClassification,
		predictView: TabularClassificationPredict,
		liveInferView: EmptyLiveInfer,
	},
	TABULAR_REGRESSION: {
		folder: UploadTypes.CSV_SINGLE,
		afterUploadURL: 'chooseTrainingMode',
		labelingView: LabelingTextClassification,
		predictView: TabularPredict,
		liveInferView: EmptyLiveInfer,
	},
	MULTILABEL_TABULAR_CLASSIFICATION: {
		folder: UploadTypes.CSV_SINGLE,
		afterUploadURL: 'chooseTrainingMode',
		labelingView: LabelingTextClassification,
		predictView: MultilabelTabularClassificationPredict,
		liveInferView: EmptyLiveInfer,
	},
	TIME_SERIES_FORECASTING: {
		afterUploadURL: 'chooseTrainingMode',
		folder: UploadTypes.CSV_SINGLE,
		labelingView: LabelingTextClassification,
		predictView: TabularPredict,
		liveInferView: EmptyLiveInfer,
	},
	MULTIMODAL_CLASSIFICATION: {
		afterUploadURL: 'chooseTrainingMode',
		folder: UploadTypes.CSV_SINGLE,
		labelingView: LabelingTextClassification,
		predictView: MultimodalPredict,
		liveInferView: EmptyLiveInfer,
	},
	MULTILABEL_IMAGE_CLASSIFICATION: {
		afterUploadURL: 'chooseTrainingMode',
		folder: UploadTypes.CSV_SINGLE,
		labelingView: LabelingTextClassification,
		predictView: MultiLabelImgPredict,
		liveInferView: EmptyLiveInfer,
	},
	SEMANTIC_SEGMENTATION: {
		afterUploadURL: 'chooseTrainingMode',
		folder: UploadTypes.FOLDER,
		labelingView: LabelingImageClassification,
		predictView: ImagePredict,
		liveInferView: EmptyLiveInfer,
	},
	CLUSTERING: {
		folder: UploadTypes.CSV_SINGLE,
		afterUploadURL: 'chooseTrainingMode',
		labelingView: LabelingTextClassification,
		predictView: TabularClassificationPredict,
		liveInferView: EmptyLiveInfer,
	},
	AUDIO_CLASSIFICATION: {
		afterUploadURL: 'chooseTrainingMode',
		folder: UploadTypes.FOLDER,
		labelingView: LabelingImageClassification,
		predictView: AudioClassificationPredict,
		liveInferView: EmptyLiveInfer,
	},
	VIDEO_CLASSIFICATION: {
		afterUploadURL: 'chooseTrainingMode',
		folder: UploadTypes.FOLDER,
		labelingView: LabelingImageClassification,
		predictView: ImagePredict,
		liveInferView: EmptyLiveInfer,
	},
	ANOMALY_DETECTION: {
		folder: UploadTypes.CSV_SINGLE,
		afterUploadURL: 'chooseTrainingMode',
		labelingView: LabelingTextClassification,
		predictView: TabularClassificationPredict,
		liveInferView: EmptyLiveInfer,
	},
}

export default config
