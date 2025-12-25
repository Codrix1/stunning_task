import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, MessageSquare, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatResponse } from "@/models/types";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  chats: ChatResponse[];
  isLoading: boolean;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  isLoading,
  onNewChat,
  isCollapsed,
  onToggle,
}) => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { user, logout } = useAuth();

  const handleChatClick = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const truncateTitle = (title: string, maxLength = 30) => {
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "w-0 overflow-hidden" : "w-72"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h1 className="text-lg font-semibold gradient-text">PromptCraft</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={onNewChat}
            className="w-full justify-start gap-2 bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground border border-sidebar-border"
          >
            <Plus className="h-4 w-4" />
            New Prompt Session
          </Button>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 pb-4">
            {isLoading ? (
              <div className="space-y-2 p-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-sidebar-accent/50 rounded-md animate-pulse"
                  />
                ))}
              </div>
            ) : chats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No prompt sessions yet
              </p>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    chatId === chat.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 opacity-70" />
                  <span className="text-sm truncate">
                    {truncateTitle(chat.title)}
                  </span>
                </button>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <span className="text-sm text-sidebar-foreground truncate">
              {user?.username || "User"}
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Toggle button when collapsed */}
      {isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 bg-sidebar border border-sidebar-border hover:bg-sidebar-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};

export default ChatSidebar;
