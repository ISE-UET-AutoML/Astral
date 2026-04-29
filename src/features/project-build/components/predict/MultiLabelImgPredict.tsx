import React, { useState, useEffect } from "react";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "src/components/ui/alert";
import { Progress } from "src/components/ui/progress";
import { Badge } from "src/components/ui/badge";
import { Separator } from "src/components/ui/separator";
import { Spinner } from "src/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Undo,
  Lightbulb,
  Tags,
  AlertCircle,
} from "lucide-react";
import SolutionImage from "src/assets/images/Solution.png";
import * as experimentAPI from "src/features/project-build/api/experiment";
const MultiLabelImgPredict = ({
  predictResult,
  uploadedFiles,
  projectInfo,
}) => {
  const [explainImageUrl, setExplainImageUrl] = useState(
    Array(uploadedFiles.length).fill(SolutionImage),
  );
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incorrectPredictions, setIncorrectPredictions] = useState([]);
  const [showExplanation, setShowExplanation] = useState(
    Array(uploadedFiles.length).fill(false),
  );

  const currentPrediction = predictResult[currentIndex] || {};

  // Toggle explanation view
  const toggleExplanationView = (index) => {
    setShowExplanation((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = !updatedArray[index];
      return updatedArray;
    });
  };

  // Handle toggling prediction correctness
  const handlePredictionToggle = (index) => {
    setIncorrectPredictions((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // Render prediction tag grid
  const renderPredictionTags = () => {
    if (!currentPrediction || currentPrediction.class.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Predictions</AlertTitle>
          <AlertDescription>
            No prediction data available for this image
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentPrediction.class.map((label, idx) => {
          const confidence =
            label.confidence || currentPrediction.confidence || 0.75;
          const confidencePercent = Math.round(confidence * 100);

          let bgColor = "bg-emerald-50 dark:bg-emerald-950";
          let borderColor = "border-emerald-200 dark:border-emerald-800";
          let badgeColor =
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200";

          if (confidencePercent < 50) {
            bgColor = "bg-red-50 dark:bg-red-950";
            borderColor = "border-red-200 dark:border-red-800";
            badgeColor =
              "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200";
          } else if (confidencePercent < 75) {
            bgColor = "bg-amber-50 dark:bg-amber-950";
            borderColor = "border-amber-200 dark:border-amber-800";
            badgeColor =
              "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200";
          }

          return (
            <div
              key={idx}
              className={`rounded-lg border-2 ${borderColor} ${bgColor} p-3`}
            >
              <div className="mb-2 flex items-center justify-between">
                <Badge className={badgeColor}>{label.name || label}</Badge>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {confidencePercent}%
                </span>
              </div>
              <Progress value={confidencePercent} className="h-2" />
            </div>
          );
        })}
      </div>
    );
  };

  // Initialize explanation images
  useEffect(() => {
    if (uploadedFiles.length > 0 && explainImageUrl.length === 0) {
      setExplainImageUrl(Array(uploadedFiles.length).fill(SolutionImage));
    }

    // Initialize incorrect predictions based on confidence
    const initialIncorrect = predictResult
      .map((result, idx) => (result.confidence < 0.5 ? idx : null))
      .filter((idx) => idx !== null);
    setIncorrectPredictions(initialIncorrect);
  }, [uploadedFiles, predictResult]);

  const handleExplainSelectedImage = async (index) => {
    console.log("Explain image");
    setLoadingExplanation(true);

    // Giả lập tạo giải thích
    setTimeout(() => {
      // Giả lập có dữ liệu giải thích trả về
      // Trong thực tế, bạn sẽ cần uncomment và sử dụng phần API bình luận bên dưới
      setExplainImageUrl((prev) => {
        const updatedArray = [...prev];
        // Giả sử có một URL hình ảnh giải thích
        updatedArray[index] = URL.createObjectURL(uploadedFiles[index]);
        return updatedArray;
      });

      // Set this image to show explanation
      setShowExplanation((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = true;
        return updatedArray;
      });

      setLoadingExplanation(false);
    }, 1500);

    // Uncomment đoạn code dưới đây khi bạn có API thực tế
    /*
		const formData = new FormData()
		formData.append('files', uploadedFiles[index])
		formData.append('task', projectInfo.type)

		try {
			const { data } = await experimentAPI.explainData(
				experimentName,
				formData
			)
			const base64ImageString = data.explanation
			const fetchedImageUrl = `data:image/jpeg;base64,${base64ImageString}`

			setExplainImageUrl((prev) => {
				const updatedArray = [...prev]
				updatedArray[index] = fetchedImageUrl
				return updatedArray
			})

			// Set this image to show explanation
			setShowExplanation((prev) => {
				const updatedArray = [...prev]
				updatedArray[index] = true
				return updatedArray
			})

			console.log('Fetch successful')
			setLoadingExplanation(false)
		} catch (error) {
			console.error('Fetch error:', error.message)
			setLoadingExplanation(false)
		}
		*/
  };

  const renderExplanationHelpModal = () => {
    return (
      <Dialog
        open={explanationModalVisible}
        onOpenChange={setExplanationModalVisible}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Understanding AI Explanations</DialogTitle>
            <DialogDescription>
              Learn how to interpret the AI model's explanation visualization
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <img
              src={explainImageUrl[currentIndex]}
              alt="AI Explanation"
              className="w-full rounded-lg"
            />

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                How to Interpret
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                The highlighted areas show the regions of the image that most
                influenced the AI's decision:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <span className="font-semibold">Yellow/bright areas:</span>{" "}
                  These regions strongly support the predicted class
                </li>
              </ul>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>LIME Explanation Method</AlertTitle>
              <AlertDescription>
                LIME (Local Interpretable Model-agnostic Explanations) works by
                modifying small parts of the image and observing how the
                prediction changes, helping identify which features the model
                focuses on.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExplanationModalVisible(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <main className="p-6">
        {/* Main Content */}
        <Card>
          <CardContent className="space-y-6 pt-6">
            {/* Navigation Controls */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="default"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="font-semibold text-gray-900 dark:text-white">
                Image {currentIndex + 1} of {uploadedFiles.length}
              </span>
              <Button
                variant="default"
                disabled={currentIndex === uploadedFiles.length - 1}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Display */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {showExplanation[currentIndex]
                        ? "Explanation View"
                        : "Original Image"}
                    </CardTitle>
                    {explainImageUrl[currentIndex] !== SolutionImage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExplanationView(currentIndex)}
                      >
                        <Undo className="h-4 w-4 mr-1.5" />
                        {showExplanation[currentIndex]
                          ? "Show Original"
                          : "Show Explanation"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingExplanation ? (
                    <div className="flex items-center justify-center py-10">
                      <Spinner className="mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Generating explanation...
                      </span>
                    </div>
                  ) : (
                    <img
                      src={
                        showExplanation[currentIndex] &&
                        explainImageUrl[currentIndex] !== SolutionImage
                          ? explainImageUrl[currentIndex]
                          : URL.createObjectURL(uploadedFiles[currentIndex])
                      }
                      alt={
                        showExplanation[currentIndex]
                          ? "Explanation Image"
                          : "Original Image"
                      }
                      className="w-full object-contain"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Prediction Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Tags className="h-5 w-5" />
                    Prediction Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Grid of predicted Tags */}
                  {renderPredictionTags()}

                  {/* Prediction Feedback Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      variant={
                        incorrectPredictions.includes(currentIndex)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handlePredictionToggle(currentIndex)}
                    >
                      {incorrectPredictions.includes(currentIndex) ? (
                        <>
                          <CircleCheck className="h-4 w-4 mr-2" />
                          Mark as Correct
                        </>
                      ) : (
                        <>
                          <CircleX className="h-4 w-4 mr-2" />
                          Mark as Incorrect
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleExplainSelectedImage(currentIndex)}
                      disabled={explainImageUrl[currentIndex] !== SolutionImage}
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      {explainImageUrl[currentIndex] !== SolutionImage
                        ? "Explanation Generated"
                        : "Generate Explanation"}
                    </Button>
                  </div>

                  {/* AI Explanation Info Box */}
                  <div className="mt-4 p-4 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      How to Interpret Explanations
                    </h4>
                    <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <p>
                        <strong>Yellow/bright areas:</strong> Regions that
                        strongly support the predicted class
                      </p>
                      <p className="text-xs opacity-90">
                        Based on LIME (Local Interpretable Model-agnostic
                        Explanations) which identifies what features the model
                        focused on.
                      </p>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-blue-600 dark:text-blue-400"
                        onClick={() => setExplanationModalVisible(true)}
                      >
                        Learn more
                      </Button>
                    </div>
                  </div>

                  {renderExplanationHelpModal()}
                </CardContent>
              </Card>
            </div>

            {/* Thumbnail Gallery */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="flex gap-2">
                {uploadedFiles.map((data, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img
                      src={URL.createObjectURL(data)}
                      alt={`Thumbnail ${index + 1}`}
                      width={60}
                      height={60}
                      className={`object-cover rounded-lg cursor-pointer transition ${
                        currentIndex === index
                          ? "ring-2 ring-blue-500 opacity-100"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                    {incorrectPredictions.includes(index) && (
                      <div className="absolute -top-2 -right-2">
                        <CircleX className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MultiLabelImgPredict;
