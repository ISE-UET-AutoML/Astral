import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "src/components/ui/alert";
import { Button } from "src/components/ui/button";
import { CheckCircle, Rocket, StopCircle, Trash2 } from "lucide-react";

export function DeployCloudServerCard({ deployData }) {
  if (!deployData) return null;

  const isOnline = deployData.status === "ONLINE";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4 dark:border-white/10">
        <span className="w-1 h-5 rounded-full bg-blue-500 shrink-0" />
        <Rocket className="size-4 text-blue-500 dark:text-blue-400" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Cloud Server
        </h2>
      </div>
      <div className="px-5 py-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Alert className="min-h-28 border-gray-200 bg-gray-50/80 dark:border-white/10 dark:bg-white/5">
              {isOnline ? (
                <StopCircle className="size-4 text-amber-600 dark:text-amber-300" />
              ) : (
                <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-300" />
              )}
              <AlertTitle>
                {isOnline ? "Shut down server instance" : "Start server instance"}
              </AlertTitle>
              <AlertDescription>
                {isOnline
                  ? "Gracefully stops the running server instance without deleting it."
                  : "Powers on the server so it can handle deployment operations."}
              </AlertDescription>
            </Alert>
            <Button
              type="button"
              className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500/40 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {isOnline ? <StopCircle className="size-4" /> : <CheckCircle className="size-4" />}
              {isOnline ? "Shut down" : "Start"}
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <Alert
              variant="destructive"
              className="min-h-28 border-red-200 bg-red-50/70 dark:border-red-400/20 dark:bg-red-500/10"
            >
              <Trash2 className="size-4" />
              <AlertTitle>Delete server instance</AlertTitle>
              <AlertDescription>
                Permanently removes the server and associated data. This action
                is irreversible.
              </AlertDescription>
            </Alert>
            <Button
              type="button"
              variant="destructive"
              className="h-10 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
            >
              <Trash2 className="size-4" />
              Delete Server
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
