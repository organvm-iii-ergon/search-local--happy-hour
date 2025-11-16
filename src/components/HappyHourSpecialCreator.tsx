import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Deal, DealType, DayOfWeek } from '@/lib/types';
import {
  BeerBottle,
  Wine,
  Martini,
  ForkKnife,
  Sparkle,
  Clock
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface HappyHourSpecialCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (deal: Omit<Deal, 'id'>) => void;
  venueId: string;
}

const DEAL_TYPES: { type: DealType; label: string; icon: React.ReactNode }[] = [
  { type: 'beer', label: 'Beer Specials', icon: <BeerBottle weight="fill" className="w-5 h-5" /> },
  { type: 'wine', label: 'Wine Specials', icon: <Wine weight="fill" className="w-5 h-5" /> },
  { type: 'cocktails', label: 'Cocktail Specials', icon: <Martini weight="fill" className="w-5 h-5" /> },
  { type: 'food', label: 'Food Specials', icon: <ForkKnife weight="fill" className="w-5 h-5" /> },
  { type: 'all', label: 'All Drinks', icon: <Sparkle weight="fill" className="w-5 h-5" /> }
];

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

export function HappyHourSpecialCreator({
  open,
  onOpenChange,
  onSubmit,
  venueId
}: HappyHourSpecialCreatorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<DealType>('cocktails');
  const [price, setPrice] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = () => {
    // Validation
    if (title.trim().length < 5) {
      toast.error('Title must be at least 5 characters');
      return;
    }

    if (description.trim().length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    if (!price.trim()) {
      toast.error('Please specify a price or discount');
      return;
    }

    if (selectedDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }

    if (!startTime || !endTime) {
      toast.error('Please specify start and end times');
      return;
    }

    // Validate time range
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (start >= end) {
      toast.error('End time must be after start time');
      return;
    }

    const deal: Omit<Deal, 'id'> = {
      title: title.trim(),
      description: description.trim(),
      type: selectedType,
      price: price.trim(),
      daysActive: selectedDays,
      timeRange: {
        start: startTime,
        end: endTime
      }
    };

    onSubmit(deal);

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedType('cocktails');
    setPrice('');
    setSelectedDays([]);
    setStartTime('');
    setEndTime('');
    onOpenChange(false);

    toast.success('Happy hour special created!', {
      description: 'Your special is now live and visible to customers.'
    });
  };

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkle weight="fill" className="text-accent" />
            Create Happy Hour Special
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Title */}
          <div>
            <Label className="text-sm font-bold mb-2 block">
              Special Title *
              <span className="text-muted-foreground font-normal ml-2">(min 5 characters)</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., '2-for-1 Cocktails', '$5 Drafts', 'Wine Wednesday'"
              className="glass-card"
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground mt-2 text-right">
              {title.length} / 100 characters
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-bold mb-2 block">
              Description *
              <span className="text-muted-foreground font-normal ml-2">(min 10 characters)</span>
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the special in detail. What drinks or food items are included? Any exclusions or special terms?"
              className="min-h-[100px] glass-card resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-2 text-right">
              {description.length} / 500 characters
            </div>
          </div>

          {/* Deal Type */}
          <div>
            <Label className="text-sm font-bold mb-3 block">
              Special Type *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {DEAL_TYPES.map((dealType) => {
                const isSelected = selectedType === dealType.type;
                return (
                  <motion.button
                    key={dealType.type}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedType(dealType.type)}
                    className={`glass-morphic p-4 rounded-2xl text-sm font-semibold transition-all ${
                      isSelected
                        ? 'ring-2 ring-accent bg-accent/10'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={isSelected ? 'text-accent' : 'text-muted-foreground'}>
                        {dealType.icon}
                      </div>
                      <span className="text-xs">{dealType.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Price */}
          <div>
            <Label className="text-sm font-bold mb-2 block">
              Price or Discount *
            </Label>
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., '$5', '50% off', '2-for-1', 'Buy 1 Get 1'"
              className="glass-card"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Enter the discounted price or discount description
            </p>
          </div>

          {/* Days Active */}
          <div>
            <Label className="text-sm font-bold mb-3 block">
              Active Days *
              <span className="text-muted-foreground font-normal ml-2">
                (select all that apply)
              </span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDays.includes(day.value);
                return (
                  <motion.button
                    key={day.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleDay(day.value)}
                    className={`glass-morphic p-3 rounded-2xl text-sm font-semibold transition-all ${
                      isSelected
                        ? 'ring-2 ring-accent bg-accent/10'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked={isSelected} />
                      {day.label}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-bold mb-2 block flex items-center gap-2">
                <Clock weight="fill" className="text-accent" />
                Start Time *
              </Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="glass-card"
              />
            </div>
            <div>
              <Label className="text-sm font-bold mb-2 block flex items-center gap-2">
                <Clock weight="fill" className="text-accent" />
                End Time *
              </Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="glass-card"
              />
            </div>
          </div>

          {/* Summary */}
          {selectedDays.length > 0 && startTime && endTime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-4 rounded-2xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkle weight="fill" className="text-accent" />
                <span className="font-bold text-sm">Preview</span>
              </div>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Active:</strong>{' '}
                  {selectedDays.map(d => DAYS_OF_WEEK.find(day => day.value === d)?.label).join(', ')}
                </p>
                <p>
                  <strong>Time:</strong> {startTime} - {endTime}
                </p>
                {price && <p><strong>Price:</strong> {price}</p>}
              </div>
            </motion.div>
          )}

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
              Create Special
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
