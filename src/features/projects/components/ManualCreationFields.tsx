import React from "react";

const ManualCreationFields = ({
  name,
  description,
  errors,
  onNameChange,
  onDescriptionChange,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label
          htmlFor="project-name"
          className="mb-2 block text-sm font-semibold text-[var(--form-label-color)]"
        >
          Project name
        </label>
        <input
          id="project-name"
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Customer Churn Predictor"
          className="h-11 w-full rounded-xl border border-[var(--input-border)] bg-white/70 px-3 text-sm text-[var(--text)] outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:bg-white/5"
        />
        {errors.name && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="project-description"
          className="mb-2 block text-sm font-semibold text-[var(--form-label-color)]"
        >
          Description
        </label>
        <input
          id="project-description"
          type="text"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="What should this model solve?"
          className="h-11 w-full rounded-xl border border-[var(--input-border)] bg-white/70 px-3 text-sm text-[var(--text)] outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:bg-white/5"
        />
      </div>
    </div>
  );
};

export default ManualCreationFields;
