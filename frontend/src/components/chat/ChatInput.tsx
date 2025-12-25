import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  placeholder = "Message AI...",
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
      <div className="relative flex items-end gap-2 bg-chat-input border border-border rounded-2xl p-2 shadow-lg">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent text-foreground placeholder:text-muted-foreground",
            "px-3 py-2 text-sm sm:text-base focus:outline-none",
            "max-h-[200px] min-h-[40px] sm:min-h-[44px]"
          )}
        />
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
          size="icon"
          className={cn(
            "h-10 w-10 sm:h-11 sm:w-11 rounded-xl shrink-0 transition-all",
            message.trim()
              ? "bg-primary hover:bg-primary/90 text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground text-center mt-2 px-4">
        <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
        <span className="sm:hidden">Tap send or press Enter</span>
      </p>
    </div>
  );
};

export default ChatInput;
