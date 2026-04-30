import { useOutletContext, useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, SlidersHorizontal, Building2 } from "lucide-react";
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
    <div className="w-full px-6 py-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Select Instance
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure compute resources for your training run.
          </p>
        </div>
        {canGoBackToTrainingMode && (
          <Button
            type="button"
            variant="outline"
            disabled={isProcessing}
            onClick={handleBackToTrainingMode}
            className="shrink-0 gap-1.5 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="automatic"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList
          variant="line"
          className="mb-6 h-auto w-full justify-start rounded-none border-b border-gray-200 bg-transparent dark:border-white/10"
        >
          <TabsTrigger value="automatic" className="flex items-center gap-2 text-sm">
            <Zap className="size-4" />
            Automatic
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2 text-sm">
            <SlidersHorizontal className="size-4" />
            Manual
          </TabsTrigger>
          <TabsTrigger value="userInfras" className="flex items-center gap-2 text-sm">
            <Building2 className="size-4" />
            Your Infrastructure
          </TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
};

export default SelectInstance;
