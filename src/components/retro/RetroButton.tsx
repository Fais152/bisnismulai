import React from "react";
import { cn } from "@/lib/utils";

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger";
  children: React.ReactNode;
}

export function RetroButton({
  variant = "default",
  children,
  className,
  ...props
}: RetroButtonProps) {
  return (
    <button
      className={cn(
        "btn-retro",
        variant === "primary" && "btn-retro-primary",
        variant === "danger" && "btn-retro-danger",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
