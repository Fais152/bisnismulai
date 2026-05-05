"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { ChatWindow } from "./ChatWindow";
import { UserContext } from "@/types/chatbot";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [userContext, setUserContext] = useState<UserContext | undefined>();

  // Fetch user context for personalized responses
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

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {(!isOpen || isMinimized) && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:bg-primary/90 transition-colors"
            aria-label="Buka BizBot"
          >
            <MessageSquare className="h-6 w-6" />
            {/* Unread badge pulse */}
            {isMinimized && (
              <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            key="window"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-black/30"
            style={{
              // Desktop: fixed size | Mobile: nearly full screen
              width: "min(380px, calc(100vw - 24px))",
              height: "min(540px, calc(100vh - 80px))",
            }}
          >
            <ChatWindow
              onClose={handleClose}
              onMinimize={handleMinimize}
              userContext={userContext}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
