import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Bell,
  CheckCircle,
  Star,
  Briefcase,
  ChatCircleDots,
  CalendarBlank,
  Trophy,
  Users,
  X
} from '@phosphor-icons/react';
import { Notification } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void;
}

const NOTIFICATION_ICONS = {
  review: <Star weight="fill" className="w-5 h-5 text-accent" />,
  application: <Briefcase weight="fill" className="w-5 h-5 text-primary" />,
  message: <ChatCircleDots weight="fill" className="w-5 h-5 text-secondary" />,
  rsvp: <CalendarBlank weight="fill" className="w-5 h-5 text-accent" />,
  achievement: <Trophy weight="fill" className="w-5 h-5 text-accent" />,
  follow: <Users weight="fill" className="w-5 h-5 text-primary" />,
  event: <CalendarBlank weight="fill" className="w-5 h-5 text-secondary" />,
  job: <Briefcase weight="fill" className="w-5 h-5 text-accent" />
};

export function NotificationCenter({ onNotificationClick }: NotificationCenterProps) {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', []);
  const [open, setOpen] = useState(false);

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      (current || []).map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      (current || []).map(n => ({ ...n, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    setOpen(false);
  };

  const sortedNotifications = [...(notifications || [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            className="relative glass-morphic border-border/50 hover:border-accent/50 transition-all duration-300"
          >
            <motion.div
              animate={{
                scale: unreadCount > 0 ? [1, 1.2, 1] : 1
              }}
              transition={{
                duration: 2,
                repeat: unreadCount > 0 ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <Bell weight={unreadCount > 0 ? 'fill' : 'regular'} />
            </motion.div>
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2"
                >
                  <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs pulse-glow">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-0 glass-morphic border-border/50"
        align="end"
        sideOffset={10}
      >
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell weight="fill" className="text-accent" />
              <h3 className="font-bold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </div>
          {(notifications || []).length > 0 && (
            <div className="flex gap-2 mt-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="flex-1 text-xs glass-morphic border-accent/30 hover:border-accent"
                >
                  <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="flex-1 text-xs glass-morphic border-border/30 hover:border-border"
              >
                <X className="w-3 h-3 mr-1" weight="bold" />
                Clear all
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {(notifications || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Bell className="w-16 h-16 text-muted-foreground/30 mb-4" weight="fill" />
                <p className="text-sm text-muted-foreground font-semibold mb-1">
                  No notifications yet
                </p>
                <p className="text-xs text-muted-foreground">
                  We'll notify you when something happens
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              <AnimatePresence mode="popLayout">
                {sortedNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`glass-morphic p-3 rounded-xl cursor-pointer transition-all hover:bg-muted/50 ${
                      !notification.read ? 'ring-1 ring-accent/30 bg-accent/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        !notification.read ? 'bg-accent/10' : 'bg-muted/30'
                      }`}>
                        {NOTIFICATION_ICONS[notification.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm font-semibold ${
                            !notification.read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-accent rounded-full shrink-0 mt-1"
                            />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {(notifications || []).length > 0 && (
          <>
            <Separator className="bg-border/30" />
            <div className="p-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-accent hover:text-accent hover:bg-accent/10 font-semibold"
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
