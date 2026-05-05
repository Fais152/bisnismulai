"use client";

import { useRef, useEffect, useState, KeyboardEvent } from "react";
import { X, Minimize2, Send, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { EmptyState } from "./EmptyState";
import { useChatbot } from "@/hooks/useChatbot";
import { UserContext } from "@/types/chatbot";

interface ChatWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  userContext?: UserContext;
}

export function ChatWindow({ onClose, onMinimize, userContext }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, isLoading, error, suggestedQuestions, sendMessage, clearMessages } = useChatbot(userContext);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectQuestion = (q: string) => {
    setInput(q);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-card/80 backdrop-blur-sm shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/30">
          <span className="text-white font-bold text-sm">B</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">BizBot</p>
          <p className="text-[11px] text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Asisten Bisnis AI • Online
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearMessages}
            title="Hapus riwayat"
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={onMinimize}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-1 scroll-smooth">
        {messages.length === 0 ? (
          <EmptyState onSelectQuestion={handleSelectQuestion} />
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {/* Suggested questions after last bot message */}
            {!isLoading && suggestedQuestions.length > 0 && (
              <SuggestedQuestions questions={suggestedQuestions} onSelect={handleSelectQuestion} />
            )}
          </>
        )}
        {isLoading && <TypingIndicator />}
        {error && (
          <div className="mx-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-3 border-t border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="flex items-end gap-2 bg-background border border-border/60 rounded-xl px-3 py-2 focus-within:border-primary/50 focus-within:ring-1 ring-primary/20 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya seputar bisnis kamu..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground/60 max-h-28 disabled:opacity-50"
            style={{ lineHeight: "1.5" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 text-center mt-1.5">Enter = kirim · Shift+Enter = baris baru</p>
      </div>
    </div>
  );
}
