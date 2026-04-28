import React from "react";
import { Check, X } from "lucide-react";
import ProjectBaseModal from "./ProjectBaseModal";
import ManualCreationFields from "./ManualCreationFields";
import ProjectTaskList from "./ProjectTaskList";
import ProjectTaskPreview from "./ProjectTaskPreview";
import { projType, taskCards } from "./projectTaskData";

const ManualCreationModal = ({
  open,
  onCancel,
  onSubmit,
  initialProjectName = "",
  initialDescription = "",
  initialTaskType = projType[0],
  initialVisibility = "private",
  initialLicense = "MIT",
  initialExpectedAccuracy = 75,
  isSelected,
  onSelectType,
}) => {
  const [name, setName] = React.useState(initialProjectName);
  const [description, setDescription] = React.useState(initialDescription);
  const [taskType, setTaskType] = React.useState(initialTaskType);
  const [errors, setErrors] = React.useState({});

  const selectedIndex = Array.isArray(isSelected)
    ? isSelected.findIndex((item) => item === true)
    : -1;
  const displayTask = selectedIndex !== -1 ? taskCards[selectedIndex] : null;

  React.useEffect(() => {
    if (open) {
      setName(initialProjectName);
      setDescription(initialDescription);
      setTaskType(initialTaskType);
      setErrors({});
    }
  }, [open, initialProjectName, initialDescription, initialTaskType]);

  const validate = () => {
    const trimmedName = name.trim();
    const newErrors = {};

    if (!trimmedName) {
      newErrors.name = "Please enter project name!";
    } else if (trimmedName.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (!/^[\p{L}0-9 _-]+$/u.test(trimmedName)) {
      newErrors.name = "Only letters, numbers, spaces, _ and - are allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      task_type: taskType,
      visibility: initialVisibility,
      license: initialLicense,
      expected_accuracy: initialExpectedAccuracy,
    });
  };

  const handleSelectType = (event, index) => {
    onSelectType(event, index);
    setTaskType(projType[index]);
  };

  return (
    <ProjectBaseModal open={open} onCancel={onCancel} className="max-h-[84vh]">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 max-h-[84vh] flex-col overflow-x-hidden"
      >
        <div className="shrink-0 border-b border-slate-200/80 px-6 py-5 dark:border-white/10">
          <div className="flex-1 items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                Create project
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Name the project, choose the machine learning task, and review
                the workflow before you create it.
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-hidden bg-slate-50/70 px-4 py-4 sm:px-6 sm:py-6 dark:bg-slate-950/40">
          <div className="grid gap-6 xl:grid-cols-[minmax(360px,0.82fr)_minmax(0,1.18fr)]">
            <div className="flex min-h-0 min-w-0 flex-col gap-5">
              <ManualCreationFields
                name={name}
                description={description}
                errors={errors}
                onNameChange={setName}
                onDescriptionChange={setDescription}
              />

              <div className="min-h-[360px] xl:max-h-[500px]">
                <ProjectTaskList
                  tasks={taskCards}
                  selectedFlags={isSelected}
                  projectTypes={projType}
                  onSelect={handleSelectType}
                />
              </div>
            </div>

            <div className="min-w-0">
              <ProjectTaskPreview task={displayTask} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200/80 bg-white px-6 py-4 dark:border-white/10 dark:bg-slate-950">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:bg-slate-950/70 dark:text-white dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Create Project
          </button>
        </div>
      </form>
    </ProjectBaseModal>
  );
};

export default ManualCreationModal;
