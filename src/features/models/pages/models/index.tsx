import ModelCard from "./card";
import { useEffect, useState, useCallback } from "react";
import { getModels } from "src/features/models/api/model";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "src/components/ui/card";
import { useTheme } from "src/theme/ThemeProvider";
import { Network as ModelIcon, Folder as EmptyIcon } from "lucide-react";

export default function ProjectModels() {
  const { id: projectId } = useParams();
  const { theme } = useTheme();
  const [models, setModels] = useState([]);

  const getListModels = useCallback(async () => {
    if (!projectId) return;
    const { data } = await getModels(projectId);
    const sortedData = data.sort((a, b) => b.id - a.id);
    setModels(sortedData);
  }, [projectId]);

  useEffect(() => {
    getListModels();
  }, [getListModels]);

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-slate-950">
      <div className="relative z-10 w-full px-3 py-6 sm:px-4 lg:px-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 dark:bg-blue-500 p-2">
              <ModelIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Models
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {models.length} Models
              </p>
            </div>
          </div>
        </div>

        {/* Models List */}
        {models.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {models.map((model) => (
              <ModelCard
                key={model.id}
                model={{ ...model, project_id: projectId }}
              />
            ))}
          </div>
        ) : (
          <Card className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 rounded-full bg-gray-100 dark:bg-slate-800 p-4">
                <EmptyIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                No Models
              </h3>
              <p className="max-w-md text-center text-gray-600 dark:text-gray-400">
                You haven't created any models yet. Start by training a model to
                create your first model.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
