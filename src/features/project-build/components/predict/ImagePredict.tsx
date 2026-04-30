import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "src/components/ui/button";
import { Spinner } from "src/components/ui/spinner";
import {
  CircleCheck,
  CircleX,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Undo2,
  Lightbulb,
  X,
} from "lucide-react";
import SolutionImage from "src/assets/images/Solution.png";
import * as experimentAPI from "src/features/project-build/api/experiment";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const ImagePredict = ({ predictResult, uploadedFiles, projectInfo }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const experimentName = searchParams.get("experimentName");

  const [explainImageUrl, setExplainImageUrl] = useState<string[]>(
    Array(uploadedFiles.length).fill(SolutionImage),
  );
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incorrectPredictions, setIncorrectPredictions] = useState<number[]>(
    [],
  );
  const [statistics, setStatistics] = useState({
    correct: 0,
    incorrect: 0,
    accuracy: 0 as number | string,
  });
  const [showExplanation, setShowExplanation] = useState<boolean[]>(
    Array(uploadedFiles.length).fill(false),
  );

  const currentPrediction = predictResult[currentIndex] || {};
  const confidencePct = Math.round((currentPrediction.confidence ?? 0) * 100);
  const isIncorrect = incorrectPredictions.includes(currentIndex);
  const hasExplanation = explainImageUrl[currentIndex] !== SolutionImage;

  const handlePredictionToggle = (index: number) => {
    setIncorrectPredictions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const toggleExplanationView = (index: number) => {
    setShowExplanation((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  useEffect(() => {
    if (uploadedFiles.length > 0 && explainImageUrl.length === 0) {
      setExplainImageUrl(Array(uploadedFiles.length).fill(SolutionImage));
    }
    const initialIncorrect = predictResult
      .map((r, idx) => (r.confidence < 0.5 ? idx : null))
      .filter((idx) => idx !== null);
    setIncorrectPredictions(initialIncorrect);
  }, [uploadedFiles]);

  useEffect(() => {
    const incorrect = incorrectPredictions.length;
    const total = uploadedFiles.length;
    setStatistics({
      correct: total - incorrect,
      incorrect,
      accuracy: total ? (((total - incorrect) / total) * 100).toFixed(1) : 0,
    });
  }, [incorrectPredictions, uploadedFiles]);

  const handleExplainSelectedImage = async (index: number) => {
    const formData = new FormData();
    setLoadingExplanation(true);
    formData.append("files", uploadedFiles[index]);
    formData.append("task", projectInfo.type);
    try {
      const { data } = await experimentAPI.explainData(
        experimentName,
        formData,
      );
      const fetchedImageUrl = `data:image/jpeg;base64,${data.explanation}`;
      setExplainImageUrl((prev) => {
        const next = [...prev];
        next[index] = fetchedImageUrl;
        return next;
      });
      setShowExplanation((prev) => {
        const next = [...prev];
        next[index] = true;
        return next;
      });
    } catch (error) {
      console.error("Explain error:", error.message);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const confidenceColor =
    (currentPrediction.confidence ?? 0) > 0.7
      ? "text-emerald-600 dark:text-emerald-400"
      : (currentPrediction.confidence ?? 0) > 0.4
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const progressIndicatorColor =
    (currentPrediction.confidence ?? 0) > 0.7
      ? "bg-emerald-500"
      : (currentPrediction.confidence ?? 0) > 0.4
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="space-y-4 p-4">
      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total Predictions",
            value: uploadedFiles.length,
            icon: (
              <HelpCircle className="size-4 text-blue-500 dark:text-blue-400" />
            ),
            accent: "border-blue-200 dark:border-blue-500/30",
          },
          {
            label: "Correct",
            value: statistics.correct,
            icon: (
              <CircleCheck className="size-4 text-emerald-500 dark:text-emerald-400" />
            ),
            accent: "border-emerald-200 dark:border-emerald-500/30",
          },
          {
            label: "Incorrect",
            value: statistics.incorrect,
            icon: <CircleX className="size-4 text-red-500 dark:text-red-400" />,
            accent: "border-red-200 dark:border-red-500/30",
          },
          {
            label: "Accuracy",
            value: `${statistics.accuracy}%`,
            icon: null,
            accent: "border-gray-200 dark:border-white/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={cx(
              "flex items-center gap-3 rounded-xl border bg-white px-4 py-3 dark:bg-slate-900",
              stat.accent,
            )}
          >
            {stat.icon}
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main panel */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
        {/* Navigation */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-white/10">
          <Button
            variant="outline"
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((p) => p - 1)}
            className="h-9 rounded-xl border-gray-200 px-3 dark:border-white/20 dark:bg-white/5"
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Image {currentIndex + 1} of {uploadedFiles.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentIndex === uploadedFiles.length - 1}
            onClick={() => setCurrentIndex((p) => p + 1)}
            className="h-9 rounded-xl border-gray-200 px-3 dark:border-white/20 dark:bg-white/5"
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-2">
          {/* Left: Image */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {showExplanation[currentIndex]
                  ? "Explanation View"
                  : "Original Image"}
              </span>
              {hasExplanation && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExplanationView(currentIndex)}
                  className="h-8 rounded-xl border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-300"
                >
                  <Undo2 className="size-3" />
                  {showExplanation[currentIndex]
                    ? "Show Original"
                    : "Show Explanation"}
                </Button>
              )}
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
              {loadingExplanation ? (
                <div className="flex min-h-60 items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Spinner className="size-5 text-blue-500" />
                  Generating explanation…
                </div>
              ) : (
                <img
                  src={
                    showExplanation[currentIndex] && hasExplanation
                      ? explainImageUrl[currentIndex]
                      : URL.createObjectURL(uploadedFiles[currentIndex])
                  }
                  alt={
                    showExplanation[currentIndex] ? "Explanation" : "Original"
                  }
                  className="w-full object-contain"
                />
              )}
            </div>
          </div>

          {/* Right: Prediction details */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                Prediction Results
              </div>
              {/* Class result */}
              <div
                className={cx(
                  "flex items-center gap-2 rounded-xl border px-4 py-3",
                  isIncorrect
                    ? "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-900/20"
                    : "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-900/20",
                )}
              >
                {isIncorrect ? (
                  <CircleX className="size-5 shrink-0 text-red-500" />
                ) : (
                  <CircleCheck className="size-5 shrink-0 text-emerald-500" />
                )}
                <div className="min-w-0">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Predicted Class
                  </span>
                  <div className="truncate text-sm font-bold uppercase text-gray-900 dark:text-white">
                    {currentPrediction.class ?? "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confidence Score
                </span>
                <span className={cx("text-sm font-bold", confidenceColor)}>
                  {confidencePct}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                <div
                  className={cx(
                    "h-full rounded-full transition-all",
                    progressIndicatorColor,
                  )}
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePredictionToggle(currentIndex)}
                className={cx(
                  "h-9 rounded-xl border px-4 text-sm font-semibold",
                  isIncorrect
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-300",
                )}
              >
                {isIncorrect ? (
                  <CircleCheck className="size-4" />
                ) : (
                  <CircleX className="size-4" />
                )}
                {isIncorrect ? "Mark as Correct" : "Mark as Incorrect"}
              </Button>
              <Button
                size="sm"
                disabled={hasExplanation || loadingExplanation}
                onClick={() => handleExplainSelectedImage(currentIndex)}
                className="h-9 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                {loadingExplanation ? (
                  <Spinner className="size-4" />
                ) : (
                  <Lightbulb className="size-4" />
                )}
                {hasExplanation
                  ? "Explanation Generated"
                  : "Generate Explanation"}
              </Button>
            </div>

            {/* Explanation info box */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                How to Interpret Explanations
              </div>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Yellow/bright areas:
                </span>{" "}
                Regions that strongly support the predicted class.
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Based on LIME — identifies what features the model focused on.
              </p>
              <button
                type="button"
                onClick={() => setExplanationModalVisible(true)}
                className="mt-2 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="border-t border-gray-200 px-5 py-3 dark:border-white/10">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {uploadedFiles.map((file, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cx(
                  "relative shrink-0 overflow-hidden rounded-lg transition-all",
                  currentIndex === index
                    ? "ring-2 ring-blue-500 ring-offset-1"
                    : "opacity-60 hover:opacity-90",
                )}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Thumbnail ${index + 1}`}
                  className="size-16 object-cover"
                />
                {incorrectPredictions.includes(index) && (
                  <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500">
                    <CircleX className="size-3 text-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation modal */}
      {explanationModalVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setExplanationModalVisible(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Understanding AI Explanations
              </h2>
              <button
                type="button"
                onClick={() => setExplanationModalVisible(false)}
                className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10"
              >
                <X className="size-4" />
              </button>
            </div>
            <img
              src={explainImageUrl[currentIndex]}
              alt="AI Explanation"
              className="mb-4 w-full rounded-xl"
            />
            <hr className="my-3 border-gray-200 dark:border-white/10" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              The highlighted areas show the regions of the image that most
              influenced the AI's decision:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Yellow/bright areas:
                </span>{" "}
                These regions strongly support the predicted class.
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-300">
              <span className="font-semibold">LIME</span> (Local Interpretable
              Model-agnostic Explanations) works by modifying small parts of the
              image and observing how the prediction changes.
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setExplanationModalVisible(false)}
                className="h-9 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePredict;
