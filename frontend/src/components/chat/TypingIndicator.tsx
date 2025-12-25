import React from "react";
import { Bot } from "lucide-react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="flex items-center gap-1 px-4 py-3">
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0s" }} />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0.2s" }} />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
};

export default TypingIndicator;
