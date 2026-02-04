import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "font-display font-bold  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-black text-white shadow-sm hover:shadow-md hover:bg-white hover:text-black focus:ring-gray-500 transform hover:scale-105",
    secondary:
      "bg-transparent border-2 border-black text-black hover:bg-black hover:text-white",
    ghost:
      "bg-transparent border-2 border-white text-white hover:text-black",
    accent:
      "bg-white border-2 text-black hover:bg-black hover:border-white hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2 text-md",
    lg: "px-10 py-5 text-xl",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
