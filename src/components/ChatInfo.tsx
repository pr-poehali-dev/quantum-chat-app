import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { Chat } from '@/pages/Index';

interface ChatInfoProps {
  chat: Chat;
}

export default function ChatInfo({ chat }: ChatInfoProps) {
  const isGroup = chat.id === '2';

  return (
    <div className="w-80 border-l border-border bg-card overflow-y-auto scrollbar-hide">
      <div className="p-6 text-center border-b border-border">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-5xl mx-auto mb-4">
          {chat.avatar}
        </div>
        <h2 className="text-xl font-semibold mb-1">{chat.name}</h2>
        <p className="text-sm text-muted-foreground">
          {chat.isOnline ? 'в сети' : 'не в сети'}
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            О чате
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
              <Icon name="Bell" size={20} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Уведомления</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
              <Icon name="Star" size={20} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">В избранное</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {isGroup && (
          <div className="space-y-2 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Участники (3)
            </h3>
            <div className="space-y-2">
              {[
                { name: 'Михаил Иванов', avatar: '👨‍💼', role: 'Админ' },
                { name: 'Екатерина Попова', avatar: '👩‍💻', role: 'Участник' },
                { name: 'Дмитрий Сидоров', avatar: '👨‍🎨', role: 'Участник' }
              ].map((member, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full rounded-xl" size="sm">
                <Icon name="UserPlus" size={16} className="mr-2" />
                Добавить участника
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Медиа и файлы
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {['🖼️', '📄', '🎵', '🎥', '📊', '🗂️'].map((emoji, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg bg-muted flex items-center justify-center text-2xl hover:bg-accent/50 cursor-pointer transition-colors"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10">
            <Icon name="Archive" size={18} className="mr-2" />
            Архивировать чат
          </Button>
          <Button variant="ghost" className="w-full justify-start rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10">
            <Icon name="Trash2" size={18} className="mr-2" />
            Удалить чат
          </Button>
        </div>
      </div>
    </div>
  );
}
