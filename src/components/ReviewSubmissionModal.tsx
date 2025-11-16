import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkle } from '@phosphor-icons/react';
import { Review, Venue } from '@/lib/types';
import { toast } from 'sonner';

interface ReviewSubmissionModalProps {
  venue: Venue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (review: Omit<Review, 'id' | 'userId' | 'date' | 'helpfulCount'>) => void;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
}

const SUGGESTED_TAGS = [
  'Great Atmosphere',
  'Excellent Service',
  'Good Value',
  'Creative Cocktails',
  'Cozy Vibes',
  'Perfect for Groups',
  'Date Night',
  'Live Music',
  'Outdoor Seating',
  'Happy Hour Deal',
  'Knowledgeable Staff',
  'Unique Selection'
];

export function ReviewSubmissionModal({
  venue,
  open,
  onOpenChange,
  onSubmit,
  currentUserId,
  currentUserName,
  currentUserAvatar
}: ReviewSubmissionModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Please write at least 10 characters');
      return;
    }

    if (!venue) return;

    const review: Omit<Review, 'id' | 'userId' | 'date' | 'helpfulCount'> = {
      userName: currentUserName,
      userAvatar: currentUserAvatar,
      venueId: venue.id,
      rating,
      comment: comment.trim(),
      tags: selectedTags,
      photos: []
    };

    onSubmit(review);

    // Reset form
    setRating(0);
    setComment('');
    setSelectedTags([]);
    onOpenChange(false);

    toast.success('Review submitted!', {
      description: 'Thank you for sharing your experience'
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (!venue) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Write a Review for {venue.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-bold mb-3">Your Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    weight="fill"
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-accent'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </motion.button>
              ))}
              {rating > 0 && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-2 text-lg font-bold"
                >
                  {rating}.0
                </motion.span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-bold mb-3">
              Your Review
              <span className="text-muted-foreground font-normal ml-2">(minimum 10 characters)</span>
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience at this venue. What did you like? What could be improved?"
              className="min-h-[150px] glass-card resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-2 text-right">
              {comment.length} / 500 characters
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold mb-3 flex items-center gap-2">
              <Sparkle weight="fill" className="text-accent" />
              Add Tags (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <motion.button
                    key={tag}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTag(tag)}
                  >
                    <Badge
                      variant={isSelected ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                          : 'hover:border-accent/50'
                      }`}
                    >
                      {tag}
                    </Badge>
                  </motion.button>
                );
              })}
            </div>
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
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
