"use client";

import * as React from "react";
import { PropsWithChildren } from "react";
import Link from "next/link";
import cn from "classnames";

export interface TButton {
  href?: string;
  onClick?: () => void;
  type?: "submit" | "button";
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "primaryOutline"
    | "secondaryOutline"
    | "dangerOutline";
  className?: string;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  active?: boolean;
}

const Button: React.FC<PropsWithChildren<TButton>> = ({
  onClick,
  href,
  children,
  type = "button",
  className,
  disabled,
  variant = "primary",
  size = "md",
  active,
}) => {
  const baseStyles =
    "inline-block font-semibold rounded focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800`,
    secondary: `bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:ring-gray-200 active:bg-gray-500`,
    danger: `bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800`,

    primaryOutline: `border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-100 focus:ring-blue-500 active:bg-blue-200`,
    secondaryOutline: `border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-200 active:bg-gray-200`,
    dangerOutline: `border border-red-600 text-red-600 bg-transparent hover:bg-red-100 focus:ring-red-500 active:bg-red-200`,
  };

  const sizeStyle = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "hover:shadow-lg";

  const activeStyles = active
    ? {
        primary: `!bg-blue-800`,
        secondary: `!bg-gray-500 !text-white`,
        danger: `!bg-red-800`,
        primaryOutline: `!bg-blue-200 !border-blue-800`, // Для Outline варианта
        secondaryOutline: `!bg-gray-200 !border-gray-500`,
        dangerOutline: `!bg-red-200 !border-red-800`,
      }
    : {};

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          baseStyles,
          variants[variant],
          disabledStyles,
          sizeStyle[size],
          activeStyles[variant],
          className
        )}
      >
        {children}
      </Link>
    );
  } else {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick ? onClick : undefined}
        className={cn(
          baseStyles,
          variants[variant],
          disabledStyles,
          sizeStyle[size],
          activeStyles[variant],
          className
        )}
      >
        {children}
      </button>
    );
  }
};

export default Button;
