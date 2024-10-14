import cn from "classnames";
import { TextareaProps } from "@/types/form";

const Textarea: React.FC<TextareaProps> = ({
  className,
  label,
  error,
  register,
  value,
  rows,
  placeholder,
  name,
  onChange,
}: TextareaProps) => {
  const props = register
    ? { ...register }
    : {
        name: name,
        value: value,
        onChange: onChange,
      };

  return (
    <div>
      <label className={cn("form-label")} htmlFor={name || register?.name}>
        {label}
      </label>
      <textarea
        {...props}
        aria-invalid={error ? "true" : "false"}
        className={cn("form-textarea", className, {
          error,
        })}
        placeholder={placeholder}
        rows={rows}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};
export default Textarea;
