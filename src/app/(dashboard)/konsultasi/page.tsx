"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { motion, Variants } from "framer-motion";
import { Bot, MessageSquare, Send, Trash2, Zap, Clock } from "lucide-react";
import { MessageBubble } from "@/components/chatbot/MessageBubble";
import { TypingIndicator } from "@/components/chatbot/TypingIndicator";
import { SuggestedQuestions } from "@/components/chatbot/SuggestedQuestions";
import { EmptyState } from "@/components/chatbot/EmptyState";
import { useChatbot } from "@/hooks/useChatbot";
import { UserContext } from "@/types/chatbot";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

export default function BizBotPage() {
  const [input, setInput] = useState("");
  const [userContext, setUserContext] = useState<UserContext | undefined>();
  const [usageCount, setUsageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, error, suggestedQuestions, sendMessage, clearMessages } = useChatbot(userContext);

  // Fetch user context
  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          setUserContext({
            current_phase: data.current_phase ?? 1,
            business_type: data.business_type ?? undefined,
            health_score: data.health_score ?? undefined,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Track usage count from messages
  useEffect(() => {
    const userMsgs = messages.filter((m) => m.role === "user").length;
    setUsageCount(userMsgs);
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6 h-full">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/30">
              <Bot className="h-5 w-5 text-white" />
            </div>
            BizBot AI
          </h1>
          <p className="text-muted-foreground mt-1">Asisten konsultan bisnis virtual — tanya apa saja seputar bisnis kamu.</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="glass-panel rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Sisa hari ini:</span>
            <span className="font-bold text-primary">{30 - usageCount}</span>
            <span className="text-muted-foreground">/ 30</span>
          </div>
          <div className="glass-panel rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-emerald-500" />
            <span className="font-medium text-emerald-500">Online</span>
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <motion.div
        variants={item}
        className="glass-panel rounded-2xl overflow-hidden flex flex-col"
        style={{ height: "calc(100vh - 280px)", minHeight: "400px" }}
      >
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1 scroll-smooth">
          {messages.length === 0 ? (
            <EmptyState onSelectQuestion={handleSelectQuestion} />
          ) : (
            <>
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {!isLoading && suggestedQuestions.length > 0 && (
                <SuggestedQuestions questions={suggestedQuestions} onSelect={handleSelectQuestion} />
              )}
            </>
          )}
          {isLoading && <TypingIndicator />}
          {error && (
            <div className="mx-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 p-4 border-t border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="flex items-end gap-3">
            <div className="flex-1 flex items-end gap-2 bg-background border border-border/60 rounded-xl px-4 py-3 focus-within:border-primary/50 focus-within:ring-1 ring-primary/20 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya seputar bisnis kamu... (Enter = kirim, Shift+Enter = baris baru)"
                rows={1}
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground/60 max-h-32 disabled:opacity-50"
                style={{ lineHeight: "1.6" }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-primary/20 shrink-0"
            >
              <Send className="h-5 w-5" />
            </button>
            <button
              onClick={clearMessages}
              title="Hapus riwayat"
              className="p-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border/50 transition-all shrink-0"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground/50 mt-2 flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            BizBot hanya membahas topik bisnis. Riwayat chat tersimpan di perangkat ini.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
