import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Chat } from '@/pages/Index';

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (text: string) => void;
  onBack?: () => void;
}

export default function ChatWindow({ chat, onSendMessage, onBack }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="border-b border-border bg-card px-4 py-3 flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden">
            <Icon name="ChevronLeft" size={20} />
          </Button>
        )}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
            {chat.avatar}
          </div>
          {chat.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold">{chat.name}</h2>
          <p className="text-xs text-muted-foreground">
            {chat.isOnline ? 'в сети' : 'не в сети'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Icon name="Phone" size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Icon name="Video" size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Icon name="MoreVertical" size={20} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {chat.messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'} animate-slide-in`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                msg.isSent
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card text-foreground rounded-bl-md border border-border'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs ${
                msg.isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                <span>{msg.time}</span>
                {msg.isSent && msg.status && (
                  <span className="ml-1">
                    {msg.status === 'sent' && <Icon name="Check" size={14} />}
                    {msg.status === 'delivered' && (
                      <div className="flex -space-x-1">
                        <Icon name="Check" size={14} />
                        <Icon name="Check" size={14} />
                      </div>
                    )}
                    {msg.status === 'read' && (
                      <div className="flex -space-x-1 text-accent">
                        <Icon name="Check" size={14} />
                        <Icon name="Check" size={14} />
                      </div>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {chat.isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-dot"></span>
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-dot" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-dot" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border bg-card p-4">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl flex-shrink-0">
            <Icon name="Paperclip" size={20} />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Введите сообщение..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="rounded-2xl pr-10 resize-none"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-xl"
            >
              <Icon name="Smile" size={20} />
            </Button>
          </div>
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            className="rounded-xl flex-shrink-0"
            size="icon"
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
