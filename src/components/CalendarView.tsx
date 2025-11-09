import { useState } from 'react';
import { CalendarEvent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CalendarBlank, Clock, MapPin, Users, Ticket, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { THEME_COLOR_SCHEMES, THEME_ICONS } from '@/lib/theme-config';

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onRSVP: (eventId: string) => void;
  rsvpdEvents: string[];
}

export function CalendarView({ events, onEventClick, onRSVP, rsvpdEvents }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array(startDayOfWeek).fill(null);
  
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, date);
    });
  };
  
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarBlank weight="fill" className="w-6 h-6 text-accent" />
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="glass-morphic"
            >
              <CaretLeft weight="bold" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="glass-morphic"
            >
              <CaretRight weight="bold" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-bold text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {paddingDays.map((_, index) => (
            <div key={`padding-${index}`} className="aspect-square" />
          ))}
          
          {daysInMonth.map((day) => {
            const dayEvents = getEventsForDate(day);
            const hasEvents = dayEvents.length > 0;
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square p-2 rounded-xl relative
                  transition-all duration-200
                  ${isSelected ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' : ''}
                  ${!isSelected && hasEvents ? 'bg-accent/20 hover:bg-accent/30' : ''}
                  ${!isSelected && !hasEvents ? 'hover:bg-muted/50' : ''}
                  ${isToday && !isSelected ? 'ring-2 ring-accent' : ''}
                `}
              >
                <div className="text-sm font-semibold">{format(day, 'd')}</div>
                
                {hasEvents && (
                  <div className="flex gap-1 justify-center mt-1 flex-wrap">
                    {dayEvents.slice(0, 3).map((event, idx) => {
                      const themeColors = event.drinkingTheme ? THEME_COLOR_SCHEMES[event.drinkingTheme] : null;
                      return (
                        <div
                          key={`${event.id}-${idx}`}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: themeColors?.accent || 'oklch(0.75 0.16 85)'
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {selectedDate && selectedDateEvents.length > 0 && (
          <motion.div
            key={selectedDate.toISOString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">
                Events on {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <Badge variant="secondary">{selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}</Badge>
            </div>
            
            {selectedDateEvents.map((event) => (
              <EventDetailCard
                key={event.id}
                event={event}
                onClick={() => onEventClick(event)}
                onRSVP={() => onRSVP(event.id)}
                isRSVPd={rsvpdEvents.includes(event.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface EventDetailCardProps {
  event: CalendarEvent;
  onClick: () => void;
  onRSVP: () => void;
  isRSVPd: boolean;
}

function EventDetailCard({ event, onClick, onRSVP, isRSVPd }: EventDetailCardProps) {
  const themeColors = event.drinkingTheme ? THEME_COLOR_SCHEMES[event.drinkingTheme] : null;
  const themeIcon = event.drinkingTheme ? THEME_ICONS[event.drinkingTheme] : null;
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass-card p-6 rounded-2xl cursor-pointer"
      onClick={onClick}
      style={themeColors ? {
        borderColor: themeColors.borderColor,
      } : undefined}
    >
      {event.image && (
        <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-bold text-lg">{event.title}</h4>
            {themeIcon && (
              <span className="text-2xl">{themeIcon}</span>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock weight="bold" className="w-4 h-4" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin weight="bold" className="w-4 h-4" />
              <span className="truncate">{event.venueName}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users weight="bold" className="w-4 h-4" />
              <span>{event.rsvpCount} going{event.maxCapacity ? ` / ${event.maxCapacity}` : ''}</span>
            </div>
            
            {event.price && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Ticket weight="bold" className="w-4 h-4" />
                <span>{event.price}</span>
              </div>
            )}
          </div>
          
          {event.tags.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {event.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs"
                  style={themeColors ? {
                    backgroundColor: `${themeColors.primary}40`,
                    color: themeColors.textPrimary,
                  } : undefined}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/50">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onRSVP();
          }}
          className={`w-full ${isRSVPd ? 'bg-secondary' : 'bg-gradient-to-r from-primary to-accent'}`}
          style={themeColors && !isRSVPd ? {
            background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.accent})`,
          } : undefined}
        >
          {isRSVPd ? '✓ RSVP\'d' : 'RSVP'}
        </Button>
      </div>
    </motion.div>
  );
}
