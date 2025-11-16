import { useState, useEffect, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  PaperPlaneRight, 
  Smiley, 
  At,
  DotsThree,
  Pencil,
  Trash
} from '@phosphor-icons/react';
import { ChatMessage, UserRole } from '@/lib/types';
import { toast } from 'sonner';

interface ThreadChatProps {
  threadId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
  currentUserRole: UserRole;
  onMessageSent?: (threadId: string) => void;
}

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '🎉', '🍻', '🔥', '👀', '✨'];

export function ThreadChat({
  threadId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  currentUserRole,
  onMessageSent
}: ThreadChatProps) {
  const [messages, setMessages] = useKV<ChatMessage[]>(`thread-${threadId}-messages`, []);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const mentions = extractMentions(newMessage);

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      userId: currentUserId,
      userName: currentUserName,
      userAvatar: currentUserAvatar,
      userRole: currentUserRole,
      content: newMessage,
      timestamp: new Date().toISOString(),
      reactions: [],
      mentions,
      replyTo: replyTo || undefined
    };

    setMessages((current) => [...(current || []), message]);
    setNewMessage('');
    setReplyTo(null);
    toast.success('Message sent!');

    // Track thread participation for achievements
    if (onMessageSent) {
      onMessageSent(threadId);
    }
  };

  const handleEdit = (messageId: string) => {
    const message = messages?.find(m => m.id === messageId);
    if (message && message.userId === currentUserId) {
      setEditingId(messageId);
      setEditContent(message.content);
    }
  };

  const handleSaveEdit = (messageId: string) => {
    if (!editContent.trim()) return;

    setMessages((current) =>
      (current || []).map(msg =>
        msg.id === messageId
          ? { ...msg, content: editContent, edited: true, editedAt: new Date().toISOString() }
          : msg
      )
    );

    setEditingId(null);
    setEditContent('');
    toast.success('Message updated');
  };

  const handleDelete = (messageId: string) => {
    setMessages((current) =>
      (current || []).map(msg =>
        msg.id === messageId
          ? { ...msg, deleted: true, content: 'Message deleted' }
          : msg
      )
    );
    toast.success('Message deleted');
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((current) =>
      (current || []).map(msg => {
        if (msg.id !== messageId) return msg;

        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        const userHasReacted = existingReaction?.users.includes(currentUserId);

        if (userHasReacted) {
          return {
            ...msg,
            reactions: msg.reactions.map(r =>
              r.emoji === emoji
                ? {
                    ...r,
                    count: r.count - 1,
                    users: r.users.filter(id => id !== currentUserId)
                  }
                : r
            ).filter(r => r.count > 0)
          };
        } else {
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.emoji === emoji
                  ? { ...r, count: r.count + 1, users: [...r.users, currentUserId] }
                  : r
              )
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, users: [currentUserId] }]
            };
          }
        }
      })
    );
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const highlightMentions = (text: string): React.ReactNode => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span
            key={i}
            className="text-accent font-semibold bg-accent/10 px-1.5 py-0.5 rounded-md hover:bg-accent/20 transition-colors cursor-pointer"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const getReplyMessage = (replyToId: string) => {
    return messages?.find(m => m.id === replyToId);
  };

  return (
    <div className="flex flex-col h-[600px] glass-card rounded-3xl overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-muted/20">
        <h3 className="font-bold text-lg">Thread Chat</h3>
        <p className="text-sm text-muted-foreground">
          {messages?.length || 0} messages
        </p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {messages?.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                {message.replyTo && (
                  <div className="ml-12 mb-1 pl-4 border-l-2 border-muted text-xs text-muted-foreground">
                    <span className="font-medium">
                      Replying to {getReplyMessage(message.replyTo)?.userName}
                    </span>
                  </div>
                )}

                <div className="flex gap-3">
                  <Avatar className="w-10 h-10 ring-2 ring-border">
                    <img src={message.userAvatar} alt={message.userName} />
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{message.userName}</span>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {message.userRole === 'the-pourer' ? '🍸 Pourer' : 
                         message.userRole === 'the-venue' ? '🏛️ Venue' : '🍺 Drinker'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                      {message.edited && (
                        <span className="text-xs text-muted-foreground italic">(edited)</span>
                      )}
                    </div>

                    {editingId === message.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(message.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={() => handleSaveEdit(message.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className={`glass-morphic p-3 rounded-2xl ${message.deleted ? 'opacity-50' : ''}`}>
                        <p className="text-sm break-words">
                          {highlightMentions(message.content)}
                        </p>
                      </div>
                    )}

                    {message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {message.reactions.map((reaction) => (
                          <Popover key={reaction.emoji}>
                            <PopoverTrigger asChild>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleReaction(message.id, reaction.emoji)}
                                className={`px-2 py-1 rounded-full text-xs glass-morphic flex items-center gap-1 hover:bg-accent/10 transition-colors ${
                                  reaction.users.includes(currentUserId)
                                    ? 'ring-2 ring-accent bg-accent/5'
                                    : ''
                                }`}
                              >
                                <span>{reaction.emoji}</span>
                                <span className="font-medium">{reaction.count}</span>
                              </motion.button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2">
                              <div className="text-xs">
                                <p className="font-semibold mb-1">Reacted with {reaction.emoji}</p>
                                <p className="text-muted-foreground">
                                  {reaction.count} {reaction.count === 1 ? 'person' : 'people'}
                                </p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        ))}
                      </div>
                    )}
                  </div>

                  {message.userId === currentUserId && !message.deleted && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <DotsThree weight="bold" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-32 p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleEdit(message.id)}
                          >
                            <Pencil className="mr-2" size={16} />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-destructive"
                            onClick={() => handleDelete(message.id)}
                          >
                            <Trash className="mr-2" size={16} />
                            Delete
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  {!message.deleted && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Smiley weight="fill" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <div className="flex gap-1">
                            {EMOJI_REACTIONS.map((emoji) => (
                              <Button
                                key={emoji}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-lg"
                                onClick={() => handleReaction(message.id, emoji)}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50 bg-muted/20">
        {replyTo && (
          <div className="mb-2 px-3 py-2 bg-muted/50 rounded-xl flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Replying to {getReplyMessage(replyTo)?.userName}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setReplyTo(null)}
              className="h-6 px-2"
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0"
            onClick={() => {}}
          >
            <At weight="bold" />
          </Button>

          <Input
            placeholder="Type a message... (use @ to mention)"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1"
          />

          <Button
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="shrink-0 bg-gradient-to-r from-primary to-accent"
          >
            <PaperPlaneRight weight="fill" />
          </Button>
        </div>
      </div>
    </div>
  );
}
