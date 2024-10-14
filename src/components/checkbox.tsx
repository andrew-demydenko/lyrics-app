import React from "react";
import { CheckboxProps } from "@/types/form";
import cn from "classnames";

const Checkbox: React.FC<CheckboxProps> = ({
  className = "",
  label,
  description,
  error,
  type = "checkbox",
  register,
  value,
  name,
  onChange,
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center space-x-2">
        <input
          {...register}
          type={type}
          id={name || register?.name}
          name={name || register?.name}
          checked={value}
          onChange={(e) => {
            if (onChange) {
              onChange(e);
            } else if (register?.onChange) {
              register.onChange(e);
            }
          }}
          className={cn(
            "form-checkbox h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
            {
              "border-red-500": error,
            }
          )}
        />
        <label
          htmlFor={name || register?.name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
