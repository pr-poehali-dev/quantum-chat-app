import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import funcUrls from '../../backend/func2url.json';

interface CreateChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  onChatCreated: () => void;
}

export default function CreateChatModal({ open, onOpenChange, userId, onChatCreated }: CreateChatModalProps) {
  const [chatName, setChatName] = useState('');
  const [chatType, setChatType] = useState<'group' | 'channel'>('group');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!chatName.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(funcUrls.chats, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify({
          name: chatName,
          chat_type: chatType,
          avatar_url: '',
          member_ids: []
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create chat');
      }

      toast({
        title: 'Успешно!',
        description: `${chatType === 'group' ? 'Группа' : 'Канал'} создан${chatType === 'group' ? 'а' : ''}`
      });

      setChatName('');
      onChatCreated();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать чат',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Создать новый чат</DialogTitle>
        </DialogHeader>

        <Tabs value={chatType} onValueChange={(v) => setChatType(v as 'group' | 'channel')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="group">
              <Icon name="Users" size={16} className="mr-2" />
              Группа
            </TabsTrigger>
            <TabsTrigger value="channel">
              <Icon name="Radio" size={16} className="mr-2" />
              Канал
            </TabsTrigger>
          </TabsList>

          <TabsContent value="group" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Название группы</Label>
              <Input
                id="group-name"
                placeholder="Например: Команда разработчиков"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-3">
                <Icon name="Users" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Групповой чат</p>
                  <p className="text-xs text-muted-foreground">
                    Создайте группу для общения с несколькими участниками. Все участники могут отправлять сообщения.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="channel" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="channel-name">Название канала</Label>
              <Input
                id="channel-name"
                placeholder="Например: Новости компании"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-3">
                <Icon name="Radio" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Канал</p>
                  <p className="text-xs text-muted-foreground">
                    Создайте канал для односторонней рассылки. Только администраторы могут отправлять сообщения.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl"
          >
            Отмена
          </Button>
          <Button
            onClick={handleCreate}
            disabled={loading || !chatName.trim()}
            className="flex-1 rounded-xl"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Создание...
              </>
            ) : (
              <>
                <Icon name="Plus" size={16} className="mr-2" />
                Создать
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
