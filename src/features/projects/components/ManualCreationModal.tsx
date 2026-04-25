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
    <ProjectBaseModal
      open={open}
      onCancel={onCancel}
      maxWidth="max-w-[1180px]"
      className="theme-manual-modal max-w-[1120px]"
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[calc(90vh-80px)] min-h-0 flex-col overflow-hidden font-['Poppins',sans-serif]"
      >
        <div className="mb-5 flex shrink-0 items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--modal-title-color)]">
              Create project
            </h2>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              Name the project and choose the machine learning task.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:border-white/15 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:#94a3b8_transparent] [scrollbar-width:thin]">
          <div className="grid gap-5 lg:grid-cols-[minmax(360px,0.82fr)_minmax(0,1.18fr)]">
            <div className="flex min-h-0 flex-col gap-4">
              <ManualCreationFields
                name={name}
                description={description}
                errors={errors}
                onNameChange={setName}
                onDescriptionChange={setDescription}
              />
              <div className="min-h-[360px] lg:max-h-[520px]">
                <ProjectTaskList
                  tasks={taskCards}
                  selectedFlags={isSelected}
                  projectTypes={projType}
                  onSelect={handleSelectType}
                />
              </div>
            </div>

            <ProjectTaskPreview task={displayTask} />
          </div>
        </div>

        <div className="mt-5 flex shrink-0 items-center justify-end gap-3 border-t border-[var(--border)] pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Check className="h-4 w-4" />
            Create Project
          </button>
        </div>
      </form>
    </ProjectBaseModal>
  );
};

export default ManualCreationModal;
