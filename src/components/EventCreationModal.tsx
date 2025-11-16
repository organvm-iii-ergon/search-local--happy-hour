import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ThemedEvent, DrinkingTheme, Venue } from '@/lib/types';
import { CalendarBlank, Clock, MapPin, Sparkle, Users, CurrencyDollar } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface EventCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: Omit<ThemedEvent, 'id'>) => void;
  bartenderId: string;
  bartenderName: string;
  venues: Venue[];
}

const DRINKING_THEMES: { value: DrinkingTheme; label: string; icon: string }[] = [
  { value: 'famous-drunks', label: 'Famous Drunks', icon: '👑' },
  { value: 'literary', label: 'Literary', icon: '📚' },
  { value: 'archetypal', label: 'Archetypal', icon: '🎭' },
  { value: 'prohibition', label: 'Prohibition', icon: '🥃' },
  { value: 'ancient-rome', label: 'Ancient Rome', icon: '🏛️' }
];

export function EventCreationModal({
  open,
  onOpenChange,
  onSubmit,
  bartenderId,
  bartenderName,
  venues
}: EventCreationModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venueId, setVenueId] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<DrinkingTheme | null>(null);
  const [capacity, setCapacity] = useState('50');
  const [ticketPrice, setTicketPrice] = useState('');
  const [specialGuests, setSpecialGuests] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Please enter an event title');
      return;
    }

    if (!description.trim() || description.length < 20) {
      toast.error('Please enter a description (min 20 characters)');
      return;
    }

    if (!date) {
      toast.error('Please select a date');
      return;
    }

    if (!time) {
      toast.error('Please select a time');
      return;
    }

    if (!venueId) {
      toast.error('Please select a venue');
      return;
    }

    if (!selectedTheme) {
      toast.error('Please select a drinking theme');
      return;
    }

    const selectedVenue = venues.find(v => v.id === venueId);
    if (!selectedVenue) return;

    const event: Omit<ThemedEvent, 'id'> = {
      title: title.trim(),
      description: description.trim(),
      date: new Date(date + 'T' + time).toISOString(),
      venue: selectedVenue.name,
      venueId: venueId,
      host: bartenderName,
      hostId: bartenderId,
      theme: selectedTheme,
      capacity: parseInt(capacity) || 50,
      attendees: 0,
      ticketPrice: ticketPrice ? parseFloat(ticketPrice) : undefined,
      specialGuests: specialGuests.trim() || undefined,
      imageUrl: selectedVenue.imageUrl
    };

    onSubmit(event);

    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setVenueId('');
    setSelectedTheme(null);
    setCapacity('50');
    setTicketPrice('');
    setSpecialGuests('');
    onOpenChange(false);

    toast.success('Event created!', {
      description: 'Your themed event has been published'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CalendarBlank weight="fill" className="text-accent" />
            Create Themed Event
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Event Title */}
          <div>
            <Label className="text-sm font-bold mb-2 block">Event Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Literary Cocktail Night, Ancient Roman Wine Tasting..."
              className="glass-card"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-bold mb-2 block">
              Description *
              <span className="text-muted-foreground font-normal ml-2">(minimum 20 characters)</span>
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event, what makes it special, what guests can expect..."
              className="min-h-[120px] glass-card resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-2 text-right">
              {description.length} / 500 characters
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-bold mb-2 block flex items-center gap-2">
                <CalendarBlank weight="fill" className="text-accent" />
                Date *
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="glass-card"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label className="text-sm font-bold mb-2 block flex items-center gap-2">
                <Clock weight="fill" className="text-accent" />
                Time *
              </Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="glass-card"
              />
            </div>
          </div>

          {/* Venue Selection */}
          <div>
            <Label className="text-sm font-bold mb-2 block flex items-center gap-2">
              <MapPin weight="fill" className="text-accent" />
              Venue *
            </Label>
            <select
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="w-full glass-card p-3 rounded-xl border border-border/50 focus:border-accent/50 focus:outline-none bg-transparent"
            >
              <option value="">Select a venue...</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name} - {venue.neighborhood}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Selection */}
          <div>
            <Label className="text-sm font-bold mb-3 block flex items-center gap-2">
              <Sparkle weight="fill" className="text-accent" />
              Drinking Theme *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DRINKING_THEMES.map((theme) => {
                const isSelected = selectedTheme === theme.value;
                return (
                  <motion.button
                    key={theme.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTheme(theme.value)}
                    className={`glass-morphic p-4 rounded-2xl text-sm font-semibold transition-all ${
                      isSelected
                        ? 'ring-2 ring-accent bg-accent/10'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{theme.icon}</div>
                    <div>{theme.label}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Capacity and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-bold mb-2 block flex items-center gap-2">
                <Users weight="fill" className="text-accent" />
                Capacity
              </Label>
              <Input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="50"
                min="1"
                max="500"
                className="glass-card"
              />
            </div>
            <div>
              <Label className="text-sm font-bold mb-2 block flex items-center gap-2">
                <CurrencyDollar weight="fill" className="text-accent" />
                Ticket Price (Optional)
              </Label>
              <Input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                placeholder="Free"
                min="0"
                step="0.01"
                className="glass-card"
              />
            </div>
          </div>

          {/* Special Guests */}
          <div>
            <Label className="text-sm font-bold mb-2 block">
              Special Guests (Optional)
            </Label>
            <Input
              value={specialGuests}
              onChange={(e) => setSpecialGuests(e.target.value)}
              placeholder="e.g., Celebrity mixologist, Local author, Wine expert..."
              className="glass-card"
              maxLength={100}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <CalendarBlank className="w-4 h-4 mr-2" weight="fill" />
              Create Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
