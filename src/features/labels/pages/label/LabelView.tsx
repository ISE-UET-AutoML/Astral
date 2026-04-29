import React, { useState, useRef, useEffect } from "react";
import { Progress } from "src/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Trash2,
  Save,
  Pencil,
} from "lucide-react";

const getToastContent = (value) =>
  typeof value === "object" && value?.content ? value.content : value;
const message = {
  success: (value) => toast.success(getToastContent(value)),
  error: (value) => toast.error(getToastContent(value)),
  warning: (value) => toast.warning(getToastContent(value)),
  info: (value) => toast.info(getToastContent(value)),
  loading: (value) => toast.loading(getToastContent(value)),
};

const getLabelColor = (label) => {
  const colors = {
    car: "#3b82f6",
    truck: "#10b981",
    motorcycle: "#f97316",
    bus: "#ec4899",
    bicycle: "#8b5cf6",
    pedestrian: "#06b6d4",
  };
  return colors[label] || "#6b7280";
};

// Sample project data (would come from route params in real app)
const sampleProject = {
  _id: "674a8e2f123456789abcdef1",
  name: "Vehicle Detection System",
  labels: ["car", "truck", "motorcycle", "bus", "bicycle", "pedestrian"],
  currentItem: 0,
  totalItems: 100,
};

// Sample image items for annotation
const sampleImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    annotations: [
      {
        id: 1,
        label: "car",
        x: 100,
        y: 150,
        width: 200,
        height: 120,
        confidence: 0.95,
      },
    ],
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop",
    annotations: [],
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
    annotations: [],
  },
];

export default function LabelView() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState(sampleProject.labels[0]);
  const [annotations, setAnnotations] = useState(
    sampleImages[0].annotations || [],
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [editingAnnotation, setEditingAnnotation] = useState(null);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const currentImage = sampleImages[currentImageIndex];

  // Handle mouse events for drawing bounding boxes
  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    setIsDrawing(true);
    setCurrentBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !canvasRef.current || !currentBox) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    setCurrentBox({
      ...currentBox,
      width: x - currentBox.x,
      height: y - currentBox.y,
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentBox) return;

    // Only create annotation if box has minimum size
    if (Math.abs(currentBox.width) > 10 && Math.abs(currentBox.height) > 10) {
      const newAnnotation = {
        id: Date.now(),
        label: selectedLabel,
        x: Math.min(currentBox.x, currentBox.x + currentBox.width),
        y: Math.min(currentBox.y, currentBox.y + currentBox.height),
        width: Math.abs(currentBox.width),
        height: Math.abs(currentBox.height),
        confidence: 1.0,
      };

      setAnnotations([...annotations, newAnnotation]);
      message.success(`Added ${selectedLabel} annotation`);
    }

    setIsDrawing(false);
    setCurrentBox(null);
  };

  // Draw annotations on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing annotations
    annotations.forEach((annotation, index) => {
      const color = getLabelColor(annotation.label);
      ctx.strokeStyle =
        selectedAnnotation === annotation.id ? "#ff4d4f" : color;
      ctx.lineWidth = selectedAnnotation === annotation.id ? 3 : 2;
      ctx.fillStyle = color + "20";

      // Draw bounding box
      ctx.fillRect(
        annotation.x * zoom,
        annotation.y * zoom,
        annotation.width * zoom,
        annotation.height * zoom,
      );
      ctx.strokeRect(
        annotation.x * zoom,
        annotation.y * zoom,
        annotation.width * zoom,
        annotation.height * zoom,
      );

      // Draw label
      ctx.fillStyle = color;
      ctx.font = "14px Arial";
      ctx.fillText(
        `${annotation.label} (${(annotation.confidence * 100).toFixed(0)}%)`,
        annotation.x * zoom,
        annotation.y * zoom - 5,
      );
    });

    // Draw current drawing box
    if (currentBox && isDrawing) {
      ctx.strokeStyle = getLabelColor(selectedLabel);
      ctx.lineWidth = 2;
      ctx.strokeRect(
        currentBox.x * zoom,
        currentBox.y * zoom,
        currentBox.width * zoom,
        currentBox.height * zoom,
      );
    }
  }, [
    annotations,
    currentBox,
    isDrawing,
    selectedLabel,
    zoom,
    selectedAnnotation,
  ]);

  const getLabelColor = (label) => {
    const colors = {
      car: "#3b82f6",
      truck: "#10b981",
      motorcycle: "#f97316",
      bus: "#ec4899",
      bicycle: "#8b5cf6",
      pedestrian: "#06b6d4",
    };
    return colors[label] || "#6b7280";
  };

  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (canvas && image) {
      canvas.width = image.width;
      canvas.height = image.height;
    }
  };

  const navigateImage = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(currentImageIndex + 1, sampleImages.length - 1)
        : Math.max(currentImageIndex - 1, 0);

    if (newIndex !== currentImageIndex) {
      setCurrentImageIndex(newIndex);
      setAnnotations(sampleImages[newIndex].annotations || []);
      setSelectedAnnotation(null);
    }
  };

  const deleteAnnotation = (annotationId) => {
    setAnnotations(annotations.filter((ann) => ann.id !== annotationId));
    setSelectedAnnotation(null);
    message.success("Annotation deleted");
  };

  const saveAnnotations = () => {
    // In real app, this would save to backend
    console.log("Saving annotations:", annotations);
    message.success("Annotations saved successfully");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 dark:bg-slate-950 dark:border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {sampleProject.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-48">
              <Progress
                value={Math.round(
                  ((currentImageIndex + 1) / sampleImages.length) * 100,
                )}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentImageIndex + 1} / {sampleImages.length}
            </span>
            <button
              onClick={saveAnnotations}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col dark:bg-slate-950 dark:border-white/10">
          {/* Tools */}
          <div className="p-4 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
              Tools
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  Label
                </label>
                <select
                  value={selectedLabel}
                  onChange={(e) => setSelectedLabel(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white"
                >
                  {sampleProject.labels.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  Zoom
                </label>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setZoom(Math.min(zoom + 0.2, 3))}
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/15"
                          aria-label="Zoom in"
                        >
                          <ZoomIn className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Zoom In</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/15"
                          aria-label="Zoom out"
                        >
                          <ZoomOut className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Zoom Out</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <button
                    onClick={() => setZoom(1)}
                    className="flex-1 h-10 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/15"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Annotations List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 dark:text-white">
              Annotations ({annotations.length})
            </h3>

            <div className="space-y-2">
              {annotations.map((annotation) => (
                <div
                  key={annotation.id}
                  onClick={() =>
                    setSelectedAnnotation(
                      selectedAnnotation === annotation.id
                        ? null
                        : annotation.id,
                    )
                  }
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedAnnotation === annotation.id
                      ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className="h-3 w-3 rounded flex-shrink-0 mt-1"
                        style={{
                          backgroundColor: getLabelColor(annotation.label),
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {annotation.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(annotation.confidence * 100)}% confidence
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAnnotation(annotation.id);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white transition hover:bg-red-50 dark:border-white/20 dark:bg-white/10 dark:hover:bg-red-950"
                      aria-label="Delete annotation"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {annotations.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No annotations yet
              </p>
            )}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navigation */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center dark:bg-slate-950 dark:border-white/10">
            <button
              disabled={currentImageIndex === 0}
              onClick={() => navigateImage("prev")}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/20 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Image {currentImageIndex + 1}
            </span>

            <button
              disabled={currentImageIndex === sampleImages.length - 1}
              onClick={() => navigateImage("next")}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue-600 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Canvas Container */}
          <div
            ref={containerRef}
            className="flex-1 overflow-auto bg-gray-100 p-4 dark:bg-slate-800"
          >
            <div className="relative inline-block">
              <img
                ref={imageRef}
                src={currentImage.url}
                alt="Annotation target"
                className="max-w-none rounded-lg"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                }}
                onLoad={handleImageLoad}
                draggable={false}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 cursor-crosshair rounded-lg"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => {
                  setIsDrawing(false);
                  setCurrentBox(null);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-t border-blue-200 px-6 py-3 dark:bg-blue-950 dark:border-blue-900">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <span className="font-semibold">Instructions:</span> Select a label
          and zoom level, then click and drag on the image to create bounding
          boxes. Click annotations in the sidebar to highlight them.
        </p>
      </div>
    </div>
  );
}
