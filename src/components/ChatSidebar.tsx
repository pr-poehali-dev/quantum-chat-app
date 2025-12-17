import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Chat } from '@/pages/Index';

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId: string;
  onSelectChat: (chatId: string) => void;
}

export default function ChatSidebar({ chats, selectedChatId, onSelectChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full lg:w-80 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Поиск чатов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filteredChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full p-4 flex items-start gap-3 hover:bg-accent/50 transition-colors border-b border-border/50 ${
              selectedChatId === chat.id ? 'bg-accent' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                {chat.avatar}
              </div>
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-accent rounded-full border-2 border-card" />
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                  {chat.time}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground truncate flex-1">
                  {chat.isTyping ? (
                    <span className="text-primary flex items-center gap-1">
                      <span>печатает</span>
                      <span className="flex gap-0.5">
                        <span className="animate-pulse-dot">.</span>
                        <span className="animate-pulse-dot" style={{ animationDelay: '0.2s' }}>.</span>
                        <span className="animate-pulse-dot" style={{ animationDelay: '0.4s' }}>.</span>
                      </span>
                    </span>
                  ) : (
                    chat.lastMessage
                  )}
                </p>
                {chat.unread > 0 && (
                  <Badge className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs flex-shrink-0">
                    {chat.unread}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
