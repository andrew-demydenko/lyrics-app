import cn from "classnames";
import { InputProps } from "@/types/form";

const Input: React.FC<InputProps> = ({
  className,
  label,
  error,
  type,
  register,
  value,
  placeholder,
  name,
  onChange,
}) => {
  const props = register
    ? { ...register }
    : {
        name,
        value,
        onChange,
      };

  return (
    <div className="mb-4">
      <label className={cn("form-label")} htmlFor={name || register?.name}>
        {label}
      </label>
      <input
        {...props}
        autoComplete="on"
        aria-invalid={error ? "true" : "false"}
        className={cn("form-input", className, {
          error,
        })}
        id={name || register?.name}
        type={type}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};
export default Input;
