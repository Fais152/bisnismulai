import React from "react";
import { cn } from "@/lib/utils";

interface RetroInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function RetroInput({ label, className, id, ...props }: RetroInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label-retro">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn("input-retro", className)}
        {...props}
      />
    </div>
  );
}

interface RetroTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function RetroTextarea({ label, className, id, ...props }: RetroTextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label-retro">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "input-retro resize-none",
          className
        )}
        {...props}
      />
    </div>
  );
}

interface RetroSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

export function RetroSelect({ label, className, id, children, ...props }: RetroSelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label-retro">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn("input-retro", className)}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
