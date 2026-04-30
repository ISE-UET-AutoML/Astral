import React from "react";

const ManualCreationFields = ({
  name,
  description,
  errors,
  onNameChange,
  onDescriptionChange,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label
          htmlFor="project-name"
          className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300"
        >
          Project name
        </label>
        <input
          id="project-name"
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Customer Churn Predictor"
          className="h-10 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
        />
        {errors.name && (
          <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-300">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="project-description"
          className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <input
          id="project-description"
          type="text"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="What should this model solve?"
          className="h-10 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
        />
      </div>
    </div>
  );
};

export default ManualCreationFields;
