export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
}

export interface ChatResponse {
  id: string;
  last_updated: string;
  message_count: number;
  title: string;
}

export interface LLMResponse {
  chat_id: string;
  user_message: string;
  llm_response: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface User {
  username: string;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreateChatResponse {
  message: string;
  chat_id: string;
}
