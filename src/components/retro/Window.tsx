"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface WindowProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  statusBar?: string;
  menuBar?: React.ReactNode;
  toolbar?: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  /** If true, window is inside a layout (not full window) */
  embedded?: boolean;
}

export function Window({
  title,
  icon,
  children,
  className,
  titleClassName,
  statusBar,
  menuBar,
  toolbar,
  onClose,
  onMinimize,
  onMaximize,
  embedded = true,
}: WindowProps) {
  return (
    <div
      className={cn(
        "win-panel flex flex-col",
        embedded ? "w-full" : "min-w-[320px]",
        className
      )}
    >
      {/* Title Bar */}
      <div className={cn("win-titlebar", titleClassName)}>
        <div className="flex items-center gap-1 overflow-hidden">
          {icon && (
            <span className="text-base leading-none shrink-0">{icon}</span>
          )}
          <span className="text-base font-bold truncate leading-none">{title}</span>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="win-control-btn"
              title="Minimize"
              aria-label="Minimize"
            >
              _
            </button>
          )}
          {onMaximize && (
            <button
              onClick={onMaximize}
              className="win-control-btn"
              title="Maximize"
              aria-label="Maximize"
            >
              □
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="win-control-btn"
              title="Close"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Menu Bar */}
      {menuBar && (
        <div className="menubar-retro border-b border-[var(--win-shadow-med)]">
          {menuBar}
        </div>
      )}

      {/* Toolbar */}
      {toolbar && (
        <div className="bg-[var(--win-button-face,#C0C0C0)] border-b border-[var(--win-shadow-med)] px-2 py-1 flex items-center gap-1">
          {toolbar}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-0">
        {children}
      </div>

      {/* Status Bar */}
      {statusBar && (
        <div className="win-statusbar">
          <span className="win-statusbar-item">{statusBar}</span>
        </div>
      )}
    </div>
  );
}

/** Standalone WindowContainer for dialogs (no outer margin) */
export function WindowDialog({
  title,
  icon,
  children,
  className,
  onClose,
}: Pick<WindowProps, "title" | "icon" | "children" | "className" | "onClose">) {
  return (
    <div className={cn("win-panel", className)}>
      <div className="win-titlebar">
        <div className="flex items-center gap-1">
          {icon && <span className="text-base">{icon}</span>}
          <span className="text-base font-bold leading-none">{title}</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="win-control-btn">✕</button>
        )}
      </div>
      {children}
    </div>
  );
}
