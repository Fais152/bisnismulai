export interface ChatPart {
  text: string;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: ChatPart[];
  timestamp: string;
}

export interface UserContext {
  current_phase?: number;
  business_type?: string;
  health_score?: number;
}

export interface ChatbotRequest {
  message: string;
  conversation_history: ChatMessage[];
  user_context?: UserContext;
}

export interface ChatbotResponse {
  reply: string;
  suggested_questions: string[];
}

export interface ChatbotError {
  error: string;
}
