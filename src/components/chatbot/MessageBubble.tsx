"use client";

import { ChatMessage } from "@/types/chatbot";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
}

// Simple markdown-like renderer for bold (**text**) and bullet points
function renderText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
    );

    if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <li key={i} className="ml-4 list-disc">
          {rendered}
        </li>
      );
    }
    if (line.trim() === "") return <br key={i} />;
    return <span key={i} className="block">{rendered}</span>;
  });
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const text = message.parts[0]?.text ?? "";

  return (
    <div className={cn("flex items-end gap-2 px-4 py-1", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-xs font-bold text-primary mb-1">
          B
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card border border-border/50 text-foreground rounded-bl-sm"
        )}
      >
        <div className="space-y-0.5">{renderText(text)}</div>
        <p className={cn("text-[10px] mt-1.5 select-none", isUser ? "text-primary-foreground/60 text-right" : "text-muted-foreground")}>
          {new Date(message.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
