import api from "./api";
import { ChatResponse, LLMResponse, Message, CreateChatResponse } from "@/models/types";

export const chatService = {
  async getChats(): Promise<ChatResponse[]> {
    try {
      const response = await api.get("/api/chats");
      // Backend returns ChatsResponse with nested 'chats' array
      const chatsData = response.data?.chats;
      return Array.isArray(chatsData) ? chatsData : [];
    } catch (error) {
      console.error('Error fetching chats:', error);
      return [];
    }
  },

  async getChatMessages(chatId: string): Promise<Message[]> {
    try {
      const response = await api.get(`/api/chats/${chatId}/messages`);
      const messages = response.data?.messages || [];
      
      // Map backend message format to frontend format
      return messages.map((msg: any, index: number) => ({
        id: `${chatId}-${index}`,
        role: msg.type === "human" ? "user" : 
              msg.type === "ai" ? "assistant" : 
              msg.type === "system" ? "system" : "assistant",
        content: msg.content,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  },

  async sendMessage(message: string, chatId?: string): Promise<LLMResponse> {
    const payload: { message: string; chat_id?: string } = { message };
    if (chatId) {
      payload.chat_id = chatId;
    }
    const response = await api.post<LLMResponse>("/api/chat", payload);
    return response.data;
  },

  async createNewChat(): Promise<CreateChatResponse> {
    const response = await api.post<CreateChatResponse>("/api/chats/new");
    return response.data;
  },
};
