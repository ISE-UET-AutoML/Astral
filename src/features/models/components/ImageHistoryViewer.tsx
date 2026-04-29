import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Progress } from "src/components/ui/progress";
import { Badge } from "src/components/ui/badge";
import { Empty } from "src/components/ui/empty";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

const ImageHistoryViewer = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) {
    return <Empty />;
  }

  const currentPrediction = data[currentIndex] || {};
  const confidence = currentPrediction.confidence || 0;
  const confidencePercent = (confidence * 100).toFixed(2);

  const getConfidenceStatus = (conf) => {
    if (conf >= 0.9)
      return {
        label: "Excellent",
        icon: CheckCircle2,
        color:
          "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
        barColor: "bg-emerald-500",
        textColor: "text-emerald-600",
      };
    if (conf >= 0.75)
      return {
        label: "Good",
        icon: CheckCircle2,
        color: "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200",
        barColor: "bg-blue-500",
        textColor: "text-blue-600",
      };
    if (conf >= 0.6)
      return {
        label: "Medium",
        icon: AlertCircle,
        color:
          "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
        barColor: "bg-amber-500",
        textColor: "text-amber-600",
      };
    return {
      label: "Low",
      icon: XCircle,
      color: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
      barColor: "bg-red-500",
      textColor: "text-red-600",
    };
  };

  const confidenceStatus = getConfidenceStatus(confidence);
  const StatusIcon = confidenceStatus.icon;

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
        <button
          onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/20 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            {currentIndex + 1}
          </span>{" "}
          / {data.length}
        </div>
        <button
          onClick={() =>
            setCurrentIndex((p) => Math.min(data.length - 1, p + 1))
          }
          disabled={currentIndex === data.length - 1}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/20 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Image Display */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Original Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden bg-gray-100 h-80 flex items-center justify-center dark:bg-white/10">
                <img
                  src={currentPrediction.imageUrl}
                  alt={`Prediction ${currentPrediction.key}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Results */}
        <div className="space-y-4">
          {/* Predicted Class Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Class</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="text-sm font-bold bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                {currentPrediction.class?.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>

          {/* Confidence Score Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Confidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`text-3xl font-bold ${confidenceStatus.textColor}`}
                >
                  {confidencePercent}%
                </div>
                <Badge
                  className={`text-xs font-semibold ${confidenceStatus.color}`}
                >
                  {confidenceStatus.label}
                </Badge>
              </div>

              <Progress value={parseFloat(confidencePercent)} className="h-2" />

              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>

              <div
                className={`p-3 rounded-lg border-l-4 ${confidenceStatus.color}`}
              >
                <p className="text-xs font-medium">
                  {confidence >= 0.9 && "Highly confident prediction"}
                  {confidence >= 0.75 &&
                    confidence < 0.9 &&
                    "Good confidence level"}
                  {confidence >= 0.6 &&
                    confidence < 0.75 &&
                    "Moderate confidence"}
                  {confidence < 0.6 && "Low confidence - review recommended"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Gallery ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            {data.map((pred, index) => {
              const thumbConfidence = pred.confidence || 0;
              const thumbStatus = getConfidenceStatus(thumbConfidence);
              const isActive = currentIndex === index;

              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="relative group shrink-0 transition-transform hover:scale-105"
                >
                  <div
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      isActive
                        ? `border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700`
                        : "border-gray-200 dark:border-white/20"
                    }`}
                  >
                    <img
                      src={pred.imageUrl}
                      alt={`Thumbnail ${pred.key}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded px-2 py-0.5 text-xs font-bold text-white ${thumbStatus.barColor}`}
                  >
                    {(thumbConfidence * 100).toFixed(0)}%
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageHistoryViewer;
