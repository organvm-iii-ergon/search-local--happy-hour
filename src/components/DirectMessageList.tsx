import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MagnifyingGlass, ChatCircleDots, Envelope } from '@phosphor-icons/react';
import { DirectMessageConversation } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface DirectMessageListProps {
  conversations: DirectMessageConversation[];
  currentUserId: string;
  onSelectConversation: (conversation: DirectMessageConversation) => void;
  selectedConversationId?: string;
}

export function DirectMessageList({
  conversations,
  currentUserId,
  onSelectConversation,
  selectedConversationId
}: DirectMessageListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participant1.id === currentUserId
      ? conv.participant2
      : conv.participant1;

    return otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedConversations = filteredConversations.sort((a, b) => {
    const aTime = a.lastMessage?.timestamp || a.createdAt;
    const bTime = b.lastMessage?.timestamp || b.createdAt;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ChatCircleDots weight="fill" className="text-accent" />
          Messages
        </h2>
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" weight="bold" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 glass-card"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <AnimatePresence mode="popLayout">
            {sortedConversations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-12 rounded-3xl text-center mt-4"
              >
                <Envelope className="w-16 h-16 mx-auto mb-4 text-muted-foreground" weight="thin" />
                <h3 className="text-xl font-bold mb-2">No conversations yet</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'No conversations match your search'
                    : 'Start a conversation with a bartender or venue'}
                </p>
              </motion.div>
            ) : (
              sortedConversations.map((conversation, index) => {
                const otherParticipant = conversation.participant1.id === currentUserId
                  ? conversation.participant2
                  : conversation.participant1;

                const isSelected = conversation.id === selectedConversationId;

                return (
                  <motion.button
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectConversation(conversation)}
                    className={`w-full text-left p-4 rounded-2xl mb-2 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-primary/10 to-accent/10 ring-2 ring-accent'
                        : 'glass-card hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12 ring-2 ring-background">
                          <img src={otherParticipant.avatar} alt={otherParticipant.name} />
                        </Avatar>
                        {conversation.unreadCount > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                          >
                            <span className="text-xs font-bold text-white">
                              {conversation.unreadCount}
                            </span>
                          </motion.div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold truncate">
                              {otherParticipant.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {otherParticipant.role === 'the-pourer' ? '🍸 Bartender' :
                               otherParticipant.role === 'the-venue' ? '🏛️ Venue' : '🍺 Customer'}
                            </Badge>
                          </div>
                          {conversation.lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), {
                                addSuffix: true
                              })}
                            </span>
                          )}
                        </div>

                        {conversation.lastMessage && (
                          <p className={`text-sm truncate ${
                            conversation.unreadCount > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'
                          }`}>
                            {conversation.lastMessage.senderId === currentUserId && 'You: '}
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
