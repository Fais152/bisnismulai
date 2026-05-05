"use client";

import { useState, useCallback, useEffect } from "react";
import { ChatMessage, UserContext } from "@/types/chatbot";

const STORAGE_KEY = "bizbot_messages";

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  suggestedQuestions: string[];
}

export function useChatbot(userContext?: UserContext) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    suggestedQuestions: [
      "Bagaimana cara menghitung harga jual yang tepat?",
      "Apa perbedaan CV dan PT untuk bisnis saya?",
      "Bisnis saya baru mulai, dari mana harus mulai?",
      "Bagaimana cara tahu bisnis saya sudah break-even?",
    ],
  });

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: ChatMessage[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setState((prev) => ({ ...prev, messages: parsed }));
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || state.isLoading) return;

      const userMessage: ChatMessage = {
        role: "user",
        parts: [{ text }],
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...state.messages, userMessage];

      setState((prev) => ({
        ...prev,
        messages: updatedMessages,
        isLoading: true,
        error: null,
        suggestedQuestions: [],
      }));

      try {
        const response = await fetch("/api/chatbot/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            conversation_history: state.messages.slice(-10),
            user_context: userContext,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Terjadi kesalahan.");
        }

        const botMessage: ChatMessage = {
          role: "model",
          parts: [{ text: data.reply }],
          timestamp: new Date().toISOString(),
        };

        const newMessages = [...updatedMessages, botMessage];

        // Persist to localStorage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
        } catch {
          // ignore storage errors
        }

        setState((prev) => ({
          ...prev,
          messages: newMessages,
          isLoading: false,
          suggestedQuestions: data.suggested_questions ?? [],
        }));
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err.message || "Terjadi kesalahan. Coba lagi.",
        }));
      }
    },
    [state.messages, state.isLoading, userContext]
  );

  const clearMessages = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      messages: [],
      isLoading: false,
      error: null,
      suggestedQuestions: [
        "Bagaimana cara menghitung harga jual yang tepat?",
        "Apa perbedaan CV dan PT untuk bisnis saya?",
        "Bisnis saya baru mulai, dari mana harus mulai?",
        "Bagaimana cara tahu bisnis saya sudah break-even?",
      ],
    });
  }, []);

  return { ...state, sendMessage, clearMessages };
}
