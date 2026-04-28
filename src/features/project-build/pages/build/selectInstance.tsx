import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import { Button } from "src/components/ui/button";
import { AutomaticInstancePanel } from "src/features/project-build/components/instances/AutomaticInstancePanel";
import { ManualInstancePanel } from "src/features/project-build/components/instances/ManualInstancePanel";
import { UserInfrastructurePanel } from "src/features/project-build/components/instances/UserInfrastructurePanel";
import { useSelectInstance } from "src/features/project-build/hooks/useSelectInstance";

const SelectInstance = () => {
  const {
    projectInfo,
    updateFields,
    selectedProject,
    trainingTags = [],
  } = useOutletContext();
  const navigate = useNavigate();
  const selectedTrainingTags = Array.isArray(trainingTags) ? trainingTags : [];
  const {
    activeTab,
    setActiveTab,
    isLoading,
    setIsLoading,
    isCreatingInstance,
    setIsCreatingInstance,
    isProcessing,
    formData,
    setFormData,
    instanceInfo,
    setInstanceInfo,
    sshKey,
    setSshKey,
    infrastructureData,
    setInfrastructureData,
    handleCopyToClipboard,
    handleInfrastructureChange,
    handleTrainingTimeChange,
    handleGpuNumberChange,
    handleDiskChange,
    handleManualConfigChange,
    handleStartTraining,
  } = useSelectInstance({
    projectInfo,
    selectedProject,
    updateFields,
    navigate,
    trainingTags: selectedTrainingTags,
  });

  const projectId = projectInfo?.id ?? projectInfo?._id;
  const canGoBackToTrainingMode = Boolean(selectedProject?.dataset_id);

  const handleBackToTrainingMode = () => {
    if (!projectId || isProcessing) return;
    navigate(`/app/project/${projectId}/build/chooseTrainingMode`);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-slate-950 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {canGoBackToTrainingMode && (
          <div className="mb-8">
            <Button
              type="button"
              disabled={isProcessing}
              onClick={handleBackToTrainingMode}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        )}
        <Tabs
          defaultValue="automatic"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="rounded-2xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-slate-900 overflow-hidden">
            <TabsList
              variant="line"
              className="w-full justify-start rounded-none bg-transparent border-b border-gray-300 dark:border-gray-700 h-22"
            >
              <TabsTrigger value="automatic" className="text-base">
                ⚡ Automatic Configuration
              </TabsTrigger>
              <TabsTrigger value="manual" className="text-base">
                🛠️ Manual Configuration
              </TabsTrigger>
              <TabsTrigger value="userInfras" className="text-base">
                🏗️ Your Infrastructure
              </TabsTrigger>
            </TabsList>
            <div className="p-8">
              <TabsContent value="automatic" className="mt-0">
                <AutomaticInstancePanel
                  formData={formData}
                  setFormData={setFormData}
                  isProcessing={isProcessing}
                  onStartTraining={handleStartTraining}
                  handleTrainingTimeChange={handleTrainingTimeChange}
                />
              </TabsContent>
              <TabsContent value="manual" className="mt-0">
                <ManualInstancePanel
                  formData={formData}
                  handleTrainingTimeChange={handleTrainingTimeChange}
                  handleManualConfigChange={handleManualConfigChange}
                  handleGpuNumberChange={handleGpuNumberChange}
                  handleDiskChange={handleDiskChange}
                  isProcessing={isProcessing}
                  onStartTraining={handleStartTraining}
                />
              </TabsContent>
              <TabsContent value="userInfras" className="mt-0">
                <UserInfrastructurePanel
                  formData={formData}
                  handleTrainingTimeChange={handleTrainingTimeChange}
                  sshKey={sshKey}
                  onCopySshKey={handleCopyToClipboard}
                  infrastructureData={infrastructureData}
                  handleInfrastructureChange={handleInfrastructureChange}
                  isProcessing={isProcessing}
                  onStartTraining={handleStartTraining}
                />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SelectInstance;
