import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chatService";
import { Message } from "@/models/types";
import { cn } from "@/lib/utils";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { toast } from "@/hooks/use-toast";

const Chat: React.FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  // Redirect to main page on page reload
  useEffect(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry?.type === 'reload') {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Fetch chat list
  const { data: chats = [], isLoading: chatsLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: chatService.getChats,
  });

  // Fetch messages for active chat
  const { data: fetchedMessages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => chatService.getChatMessages(chatId!),
    enabled: !!chatId,
  });

  // Sync local messages with fetched messages
  React.useEffect(() => {
    if (fetchedMessages.length > 0) {
      setLocalMessages(fetchedMessages);
    } else if (!chatId) {
      setLocalMessages([]);
    }
  }, [fetchedMessages, chatId]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => chatService.sendMessage(message, chatId),
    onSuccess: (response) => {
      // Update messages with AI response
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        content: response.llm_response,
      };
      setLocalMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      // If this was a new chat, update URL and refresh sidebar
      if (!chatId && response.chat_id) {
        navigate(`/chat/${response.chat_id}`, { replace: true });
      }
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error: any) => {
      setIsTyping(false);
      // Remove optimistic message on error
      setLocalMessages((prev) => prev.slice(0, -1));
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Create new chat
  const createNewChatMutation = useMutation({
    mutationFn: chatService.createNewChat,
    onSuccess: (response) => {
      setLocalMessages([]);
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      navigate(`/chat/${response.chat_id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create chat",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = useCallback(
    (content: string) => {
      // Optimistically add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
      };
      setLocalMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      sendMessageMutation.mutate(content);
    },
    [sendMessageMutation]
  );

  const handleNewChat = useCallback(async () => {
    // Check if there's already a chat with no human messages
    // We need to check each chat's actual messages to see if it has human messages
    let chatWithoutHumanMessages = null;
    
    for (const chat of chats) {
      try {
        const messages = await chatService.getChatMessages(chat.id);
        const hasHumanMessages = messages.some(msg => msg.role === "user");
        
        if (!hasHumanMessages) {
          chatWithoutHumanMessages = chat;
          break;
        }
      } catch (error) {
        // If we can't fetch messages, assume it's empty
        if (chat.message_count === 0) {
          chatWithoutHumanMessages = chat;
          break;
        }
      }
    }
    
    if (chatWithoutHumanMessages) {
      // Navigate to existing chat without human messages
      navigate(`/chat/${chatWithoutHumanMessages.id}`);
    } else {
      // Create new chat only if all existing chats have at least one human message
      createNewChatMutation.mutate();
    }
  }, [createNewChatMutation, chats, navigate]);

  return (
    <div className="h-screen bg-background">
      <ChatSidebar
        chats={chats}
        isLoading={chatsLoading}
        onNewChat={handleNewChat}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={cn(
        "h-screen flex flex-col transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "ml-0" : "ml-72"
      )}>
        <ChatWindow
          messages={localMessages}
          isLoading={messagesLoading && !!chatId}
          isTyping={isTyping}
          onSend={handleSendMessage}
        />
      </main>
    </div>
  );
};

export default Chat;
