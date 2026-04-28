import { HardDriveDownload } from "lucide-react";

export function ExportProgressModal({ isExporting }) {
  if (!isExporting) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
          <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-center">
              <HardDriveDownload className="w-12 h-12 animate-pulse text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="px-8 py-6 text-center">
            <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
              Preparing Your Data
            </h3>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              The system is exporting labels and preparing your data for
              training.
              <br />
              <span className="text-sm mt-2 block text-gray-500 dark:text-gray-400">
                This process may take a few minutes. Please do not close this
                window.
              </span>
            </p>

            <div className="mt-6">
              <div className="flex justify-center gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
