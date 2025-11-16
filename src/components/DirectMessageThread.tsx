import { useState, useEffect, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PaperPlaneRight, ArrowLeft } from '@phosphor-icons/react';
import { DirectMessage, DirectMessageConversation } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface DirectMessageThreadProps {
  conversation: DirectMessageConversation;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
  onBack?: () => void;
  onMessageSent?: (conversationId: string) => void;
}

export function DirectMessageThread({
  conversation,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onBack,
  onMessageSent
}: DirectMessageThreadProps) {
  const [messages, setMessages] = useKV<DirectMessage[]>(`dm-${conversation.id}`, []);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const otherParticipant = conversation.participant1.id === currentUserId
    ? conversation.participant2
    : conversation.participant1;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    setMessages((current) =>
      (current || []).map(msg =>
        msg.senderId !== currentUserId && !msg.read
          ? { ...msg, read: true }
          : msg
      )
    );
  }, [conversation.id, currentUserId, setMessages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: DirectMessage = {
      id: `dm-msg-${Date.now()}`,
      conversationId: conversation.id,
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages((current) => [...(current || []), message]);
    setNewMessage('');

    if (onMessageSent) {
      onMessageSent(conversation.id);
    }

    toast.success('Message sent!');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50 glass-morphic">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2"
            >
              <ArrowLeft weight="bold" />
            </Button>
          )}
          <Avatar className="w-10 h-10 ring-2 ring-background">
            <img src={otherParticipant.avatar} alt={otherParticipant.name} />
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold">{otherParticipant.name}</h3>
              <Badge variant="outline" className="text-xs">
                {otherParticipant.role === 'the-pourer' ? '🍸 Bartender' :
                 otherParticipant.role === 'the-venue' ? '🏛️ Venue' : '🍺 Customer'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {messages?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">
                  Start the conversation with {otherParticipant.name}
                </p>
              </motion.div>
            ) : (
              messages?.map((message, index) => {
                const isOwn = message.senderId === currentUserId;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className="w-8 h-8 ring-2 ring-background shrink-0">
                      <img src={message.senderAvatar} alt={message.senderName} />
                    </Avatar>

                    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {isOwn ? 'You' : message.senderName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </span>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`px-4 py-3 rounded-2xl ${
                          isOwn
                            ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                            : 'glass-card'
                        }`}
                      >
                        <p className="text-sm break-words whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </motion.div>

                      {message.edited && (
                        <span className="text-xs text-muted-foreground italic mt-1">
                          Edited
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <Separator className="bg-border/30" />

      {/* Input */}
      <div className="p-4 glass-morphic">
        <div className="flex gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${otherParticipant.name}...`}
            className="flex-1 glass-card"
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <PaperPlaneRight weight="fill" className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
