import { useState, useEffect } from 'react';
import ChatSidebar from '@/components/ChatSidebar';
import ChatWindow from '@/components/ChatWindow';
import ChatInfo from '@/components/ChatInfo';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

export interface Message {
  id: string;
  text: string;
  time: string;
  isSent: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  isTyping?: boolean;
  messages: Message[];
}

export default function Index() {
  const [isDark, setIsDark] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string>('1');
  const [showInfo, setShowInfo] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Анна Смирнова',
      avatar: '👩‍💼',
      lastMessage: 'Отлично, тогда до встречи!',
      time: '14:32',
      unread: 2,
      isOnline: true,
      messages: [
        { id: '1', text: 'Привет! Как дела?', time: '14:28', isSent: false, status: 'read' },
        { id: '2', text: 'Привет! Всё отлично, работаю над проектом', time: '14:29', isSent: true, status: 'read' },
        { id: '3', text: 'Круто! Можем созвониться сегодня вечером?', time: '14:30', isSent: false, status: 'read' },
        { id: '4', text: 'Да, конечно! В 19:00 подойдёт?', time: '14:31', isSent: true, status: 'delivered' },
        { id: '5', text: 'Отлично, тогда до встречи!', time: '14:32', isSent: false, status: 'sent' }
      ]
    },
    {
      id: '2',
      name: 'Команда Quantum',
      avatar: '🚀',
      lastMessage: 'Михаил: Добавил новые фичи',
      time: '13:15',
      unread: 5,
      isOnline: true,
      isTyping: true,
      messages: [
        { id: '1', text: 'Всем привет! Начинаем стендап', time: '13:00', isSent: false },
        { id: '2', text: 'Я закончил работу над UI компонентами', time: '13:05', isSent: true },
        { id: '3', text: 'Отлично! Я работаю над бэкендом', time: '13:10', isSent: false },
        { id: '4', text: 'Добавил новые фичи', time: '13:15', isSent: false }
      ]
    },
    {
      id: '3',
      name: 'Максим Петров',
      avatar: '👨‍💻',
      lastMessage: 'Посмотри код, пожалуйста',
      time: '12:45',
      unread: 0,
      isOnline: false,
      messages: [
        { id: '1', text: 'Привет! Отправил PR на ревью', time: '12:40', isSent: false },
        { id: '2', text: 'Посмотрю сегодня вечером!', time: '12:42', isSent: true },
        { id: '3', text: 'Посмотри код, пожалуйста', time: '12:45', isSent: false }
      ]
    },
    {
      id: '4',
      name: 'Елена Волкова',
      avatar: '👩‍🎨',
      lastMessage: 'Спасибо за фидбек!',
      time: 'Вчера',
      unread: 0,
      isOnline: false,
      messages: [
        { id: '1', text: 'Готовы новые дизайны', time: 'Вчера', isSent: false },
        { id: '2', text: 'Выглядит отлично!', time: 'Вчера', isSent: true },
        { id: '3', text: 'Спасибо за фидбек!', time: 'Вчера', isSent: false }
      ]
    }
  ]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setShowInfo(false);
        setShowSidebar(!selectedChatId);
      } else {
        setShowInfo(true);
        setShowSidebar(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedChatId]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  const handleSendMessage = (text: string) => {
    if (!selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      status: 'sent'
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: text,
              time: newMessage.time
            }
          : chat
      )
    );

    setTimeout(() => {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
                )
              }
            : chat
        )
      );
    }, 1000);

    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Звучит отлично! 👍',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isSent: false
      };

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [...chat.messages, replyMessage],
                lastMessage: replyMessage.text,
                time: replyMessage.time,
                isTyping: false
              }
            : chat
        )
      );
    }, 3000);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleBackToChats = () => {
    setShowSidebar(true);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-2xl">
            ⚛️
          </div>
          <div>
            <h1 className="text-lg font-semibold">Quantum Chat</h1>
            <p className="text-xs text-muted-foreground">Безопасные сообщения</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-xl"
          >
            <Icon name={isDark ? 'Sun' : 'Moon'} size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Icon name="Settings" size={20} />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {(!isMobile || showSidebar) && (
          <ChatSidebar
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={handleChatSelect}
          />
        )}

        {(!isMobile || !showSidebar) && selectedChat && (
          <ChatWindow
            chat={selectedChat}
            onSendMessage={handleSendMessage}
            onBack={isMobile ? handleBackToChats : undefined}
          />
        )}

        {!isMobile && showInfo && selectedChat && (
          <ChatInfo chat={selectedChat} />
        )}
      </div>
    </div>
  );
}
