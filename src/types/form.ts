import {
  FieldValues,
  UseFormRegisterReturn,
  FieldError,
} from "react-hook-form";

export interface InputProps {
  className?: string;
  register?: UseFormRegisterReturn<keyof FieldValues>;
  label?: string;
  error?: FieldError;
  type?: string;
  value?: string | number;
  placeholder?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TextareaProps {
  className?: string;
  register?: UseFormRegisterReturn<keyof FieldValues>;
  label: string;
  error?: FieldError;
  rows?: number;
  value?: string;
  name?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface CheckboxProps {
  className?: string;
  label: string;
  description?: string;
  error?: FieldError;
  type?: "checkbox" | "toggle";
  register?: UseFormRegisterReturn<keyof FieldValues>;
  value?: boolean;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
