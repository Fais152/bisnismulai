"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { MessageBubble } from "@/components/chatbot/MessageBubble";
import { TypingIndicator } from "@/components/chatbot/TypingIndicator";
import { SuggestedQuestions } from "@/components/chatbot/SuggestedQuestions";
import { EmptyState } from "@/components/chatbot/EmptyState";
import { useChatbot } from "@/hooks/useChatbot";
import { UserContext } from "@/types/chatbot";
import { Window } from "@/components/retro/Window";

export default function BizBotPage() {
  const [input, setInput] = useState("");
  const [userContext, setUserContext] = useState<UserContext | undefined>();
  const [usageCount, setUsageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, error, suggestedQuestions, sendMessage, clearMessages } = useChatbot(userContext);

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

  useEffect(() => {
    const userMsgs = messages.filter((m) => m.role === "user").length;
    setUsageCount(userMsgs);
  }, [messages]);

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
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] min-h-[500px]">
      <Window
        title="🤖 BizBot AI — Asisten Konsultan Bisnis"
        icon="🤖"
        className="h-full flex flex-col"
        menuBar={
          <>
            <span className="menubar-item" onClick={clearMessages}>File (Hapus Chat)</span>
            <span className="menubar-item">Bantuan</span>
          </>
        }
        statusBar={`Status: ${isLoading ? "Mengetik..." : "Online"} | Sisa limit hari ini: ${30 - usageCount}/30`}
      >
        <div className="flex flex-col h-full bg-[#C0C0C0] dark:bg-[#1A1A1A] p-2 gap-2">
          
          {/* Chat History Area */}
          <div className="flex-1 bg-[#FFFFFF] dark:bg-[#000000] win-inset overflow-y-auto p-2">
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
              <div className="mx-2 p-2 win-panel text-[13px] bg-[#FFFFE1] border-none text-[#800000]">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-end gap-2 shrink-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pertanyaan... (Enter untuk kirim)"
              rows={2}
              disabled={isLoading}
              className="input-retro flex-1 resize-none h-12 text-[13px]"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="btn-retro btn-retro-primary h-12 w-20 text-[13px] font-bold"
            >
              Kirim
            </button>
          </div>
        </div>
      </Window>
    </div>
  );
}
