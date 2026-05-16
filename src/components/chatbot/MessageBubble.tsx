"use client";

import { ChatMessage } from "@/types/chatbot";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
}

function renderText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
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
    <div className={cn("flex flex-col mb-2 px-2", isUser ? "items-end" : "items-start")}>
      <span className="text-[11px] font-bold mb-0.5 text-[#000080]">
        {isUser ? "Anda" : "BizBot AI"}
      </span>
      <div
        className="win-inset px-3 py-2 text-[13px] leading-relaxed max-w-[85%]"
        style={{
          background: isUser ? "#FFFFE1" : "#FFFFFF",
          color: "#000000",
        }}
      >
        <div className="space-y-0.5">{renderText(text)}</div>
      </div>
      <p className="text-[10px] mt-0.5 text-[#808080]">
        {new Date(message.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}
