import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { SocialThread } from '@/lib/types';
import { ChatCircleDots, Users, Fire, Clock } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { getRelativeTime } from '@/lib/time-utils';
import { THEME_COLOR_SCHEMES } from '@/lib/theme-config';

interface SocialThreadCardProps {
  thread: SocialThread;
  onClick: () => void;
}

export function SocialThreadCard({ thread, onClick }: SocialThreadCardProps) {
  const isLive = thread.type === 'live';
  const themeColors = thread.drinkingTheme ? THEME_COLOR_SCHEMES[thread.drinkingTheme] : null;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card p-6 rounded-2xl cursor-pointer relative overflow-hidden group"
      style={themeColors ? {
        borderColor: themeColors.borderColor,
      } : undefined}
    >
      {isLive && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, ${themeColors?.accent || 'oklch(0.75 0.16 85)'}, ${themeColors?.secondary || 'oklch(0.72 0.15 35)'})` }}
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-12 w-12">
          <img src={thread.author.avatar} alt={thread.author.name} className="object-cover" />
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg truncate">{thread.title}</h3>
            {isLive && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Badge variant="destructive" className="gap-1">
                  <Fire weight="fill" className="w-3 h-3" />
                  Live
                </Badge>
              </motion.div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            by {thread.author.name} • {thread.author.role === 'the-pourer' ? '🍸 Bartender' : '🍹 Member'}
          </p>
          
          <p className="text-sm text-foreground/80 line-clamp-2">{thread.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users weight="bold" className="w-4 h-4" />
          <span>{thread.participantCount}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <ChatCircleDots weight="bold" className="w-4 h-4" />
          <span>{thread.messageCount}</span>
        </div>
        
        <div className="flex items-center gap-1 ml-auto">
          <Clock weight="bold" className="w-4 h-4" />
          <span>{getRelativeTime(thread.lastActivity)}</span>
        </div>
      </div>
      
      {thread.tags.length > 0 && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {thread.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs"
              style={themeColors ? {
                backgroundColor: `${themeColors.primary}40`,
                color: themeColors.textPrimary,
                borderColor: themeColors.borderColor,
              } : undefined}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
        initial={false}
        style={{
          transform: 'translateX(-100%)',
        }}
        whileHover={{
          transform: 'translateX(100%)',
          transition: { duration: 0.6, ease: 'easeInOut' }
        }}
      />
    </motion.div>
  );
}
