import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/models/types";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import HeroSection from "./HeroSection";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  onSend: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  isTyping,
  onSend,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (messages.length === 0 && !isLoading) {
    return <HeroSection onSend={onSend} isLoading={isTyping} />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {messages
                .filter((message) => message.role !== "system")
                .map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
        <ChatInput onSend={onSend} isLoading={isTyping} />
      </div>
    </div>
  );
};

export default ChatWindow;
