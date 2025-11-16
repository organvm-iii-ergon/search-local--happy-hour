import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Star, 
  Clock, 
  ShareNetwork, 
  NavigationArrow,
  BeerBottle,
  Wine,
  Martini,
  ForkKnife,
  Sparkle,
  Users,
  CalendarBlank,
  ChatCircle
} from '@phosphor-icons/react';
import { Venue, DealType, Review } from '@/lib/types';
import { isDealActiveNow, formatTimeRange, getRelativeTime } from '@/lib/time-utils';
import { BartenderCard } from '@/components/BartenderCard';
import { EventCard } from '@/components/EventCard';
import { ReviewCard } from '@/components/ReviewCard';
import { MenuSection } from '@/components/MenuDisplay';
import { MOCK_REVIEWS } from '@/lib/mock-data';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface VenueDetailProps {
  venue: Venue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userReviews?: Review[];
  onWriteReview?: () => void;
}

const dealIcons: Record<DealType, React.ReactNode> = {
  beer: <BeerBottle className="w-5 h-5" weight="fill" />,
  wine: <Wine className="w-5 h-5" weight="fill" />,
  cocktails: <Martini className="w-5 h-5" weight="fill" />,
  food: <ForkKnife className="w-5 h-5" weight="fill" />,
  all: <Sparkle className="w-5 h-5" weight="fill" />
};

export function VenueDetail({ venue, open, onOpenChange, userReviews = [], onWriteReview }: VenueDetailProps) {
  const [activeTab, setActiveTab] = useState('deals');

  if (!venue) return null;

  const priceSymbol = '$'.repeat(venue.priceLevel);
  const mockReviews = venue.id in MOCK_REVIEWS ? MOCK_REVIEWS[venue.id] : [];
  const venueUserReviews = userReviews.filter(r => r.venueId === venue.id);
  const allReviews = [...venueUserReviews, ...mockReviews];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!', {
      duration: 3000,
    });
  };

  const handleGetDirections = () => {
    const address = encodeURIComponent(venue.address);
    window.open(`https://maps.google.com/?q=${address}`, '_blank');
  };

  const menuCategories = venue.menu ? 
    [...new Set(venue.menu.map(item => item.category))] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto glass-morphic-strong border-2 border-border/50 p-0">
        <AnimatePresence mode="wait">
          {open && venue && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <DialogHeader className="p-8 pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      {venue.name}
                    </DialogTitle>
                    {venue.description && (
                      <p className="text-muted-foreground text-lg mt-2 leading-relaxed">
                        {venue.description}
                      </p>
                    )}
                  </div>
                  {venue.followerCount && (
                    <motion.div
                      className="glass-morphic px-6 py-3 rounded-2xl ml-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center gap-2">
                        <Users weight="fill" className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-bold text-xl">{venue.followerCount.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">followers</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </DialogHeader>

              <div className="p-8 space-y-8">
                <motion.div 
                  className="relative overflow-hidden rounded-3xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="shimmer absolute inset-0 z-10 pointer-events-none" />
                  <img 
                    src={venue.image} 
                    alt={venue.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>

                <motion.div 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-morphic p-6 rounded-2xl"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Star weight="fill" className="w-7 h-7 text-accent" />
                      <span className="font-bold text-2xl">{venue.rating}</span>
                      <span className="text-muted-foreground text-base">({venue.reviewCount} reviews)</span>
                    </div>
                    <Separator orientation="vertical" className="h-8 bg-border/30 hidden sm:block" />
                    <span className="text-2xl font-bold text-secondary">{priceSymbol}</span>
                  </div>
                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" onClick={handleShare} className="glass-morphic border-border/50">
                        <ShareNetwork className="w-5 h-5 mr-2" />
                        Share
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="sm" onClick={handleGetDirections} className="bg-gradient-to-r from-primary to-accent shadow-lg">
                        <NavigationArrow className="w-5 h-5 mr-2" />
                        Directions
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  className="glass-morphic p-6 rounded-2xl"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" weight="fill" />
                    <div>
                      <div className="font-bold text-lg mb-1">{venue.address}</div>
                      <div className="text-muted-foreground text-base">{venue.neighborhood}</div>
                      {venue.distance && (
                        <div className="text-accent font-semibold mt-1">{venue.distance} miles away</div>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {venue.tags.map((tag, index) => (
                    <motion.div
                      key={tag}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4 + index * 0.05, type: 'spring', stiffness: 200 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Badge variant="secondary" className="text-sm px-4 py-2 bg-gradient-to-r from-muted to-muted/50 font-semibold">
                        <Sparkle className="w-4 h-4 mr-1" weight="fill" />
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>

                <Separator className="bg-border/30" />

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-2 rounded-3xl mb-6"
                  >
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 bg-transparent gap-2">
                      <TabsTrigger 
                        value="deals" 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-secondary data-[state=active]:text-accent-foreground rounded-2xl font-bold text-xs sm:text-sm"
                      >
                        <Clock className="w-4 h-4 mr-1 sm:mr-2" weight="fill" />
                        Deals
                      </TabsTrigger>
                      {venue.menu && venue.menu.length > 0 && (
                        <TabsTrigger 
                          value="menu"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground rounded-2xl font-bold text-xs sm:text-sm"
                        >
                          <Martini className="w-4 h-4 mr-1 sm:mr-2" weight="fill" />
                          Menu
                        </TabsTrigger>
                      )}
                      {venue.bartenders && venue.bartenders.length > 0 && (
                        <TabsTrigger 
                          value="bartenders"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-accent data-[state=active]:text-secondary-foreground rounded-2xl font-bold text-xs sm:text-sm"
                        >
                          <Users className="w-4 h-4 mr-1 sm:mr-2" weight="fill" />
                          Staff
                        </TabsTrigger>
                      )}
                      {venue.events && venue.events.length > 0 && (
                        <TabsTrigger 
                          value="events"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-secondary data-[state=active]:text-accent-foreground rounded-2xl font-bold text-xs sm:text-sm"
                        >
                          <CalendarBlank className="w-4 h-4 mr-1 sm:mr-2" weight="fill" />
                          Events
                        </TabsTrigger>
                      )}
                      <TabsTrigger 
                        value="reviews"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground rounded-2xl font-bold text-xs sm:text-sm"
                      >
                        <ChatCircle className="w-4 h-4 mr-1 sm:mr-2" weight="fill" />
                        Reviews
                      </TabsTrigger>
                    </TabsList>
                  </motion.div>

                  <TabsContent value="deals" className="mt-0">
                    <div>
                      <motion.h3 
                        className="font-bold text-3xl mb-6 flex items-center gap-3"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                      >
                        <Clock className="w-7 h-7 text-accent" weight="fill" />
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          Happy Hour Deals
                        </span>
                      </motion.h3>
                      <div className="space-y-4">
                        {venue.deals.map((deal, index) => {
                          const isActive = isDealActiveNow(deal);
                          return (
                            <motion.div 
                              key={deal.id}
                              className={`p-6 rounded-3xl border-2 transition-all duration-300 ${
                                isActive 
                                  ? 'glass-card border-accent shadow-lg pulse-glow stacked-element' 
                                  : 'glass-morphic border-border/50'
                              }`}
                              initial={{ opacity: 0, x: -30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <motion.div
                                    animate={isActive ? { rotate: [0, 10, -10, 0] } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    {dealIcons[deal.type]}
                                  </motion.div>
                                  <h4 className="font-bold text-xl">{deal.title}</h4>
                                </div>
                                <AnimatePresence>
                                  {isActive && (
                                    <motion.div
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      exit={{ scale: 0, rotate: 180 }}
                                    >
                                      <Badge className="bg-accent text-accent-foreground font-bold px-3 py-1 pulse-glow">
                                        <Sparkle className="w-3 h-3 mr-1" weight="fill" />
                                        Active Now
                                      </Badge>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <p className="text-base text-muted-foreground mb-3">
                                {deal.description}
                              </p>
                              <div className="flex items-center gap-6 text-base">
                                {deal.price && (
                                  <span className="font-bold text-xl text-secondary">
                                    {deal.price}
                                  </span>
                                )}
                                <span className="text-muted-foreground flex items-center gap-2">
                                  <Clock className="w-4 h-4" weight="fill" />
                                  {formatTimeRange(deal.timeRange)}
                                </span>
                              </div>
                              <div className="mt-3 pt-3 border-t border-border/30 text-sm text-muted-foreground font-medium">
                                {deal.daysActive.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>

                  {venue.menu && venue.menu.length > 0 && (
                    <TabsContent value="menu" className="mt-0">
                      <div className="space-y-10">
                        {menuCategories.map((category) => {
                          const items = venue.menu!.filter(item => item.category === category);
                          return (
                            <MenuSection 
                              key={category}
                              title={category}
                              items={items}
                              icon={
                                category.toLowerCase().includes('cocktail') ? <Martini className="w-6 h-6 text-accent" weight="fill" /> :
                                category.toLowerCase().includes('beer') ? <BeerBottle className="w-6 h-6 text-primary" weight="fill" /> :
                                category.toLowerCase().includes('wine') ? <Wine className="w-6 h-6 text-secondary" weight="fill" /> :
                                category.toLowerCase().includes('food') ? <ForkKnife className="w-6 h-6 text-accent" weight="fill" /> :
                                <Sparkle className="w-6 h-6 text-accent" weight="fill" />
                              }
                            />
                          );
                        })}
                      </div>
                    </TabsContent>
                  )}

                  {venue.bartenders && venue.bartenders.length > 0 && (
                    <TabsContent value="bartenders" className="mt-0">
                      <div className="space-y-6">
                        <motion.h3 
                          className="font-bold text-3xl mb-6 flex items-center gap-3"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                        >
                          <Users className="w-7 h-7 text-primary" weight="fill" />
                          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Our Bartenders
                          </span>
                        </motion.h3>
                        {venue.bartenders.map((bartender, index) => (
                          <motion.div
                            key={bartender.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <BartenderCard bartender={bartender} />
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                  )}

                  {venue.events && venue.events.length > 0 && (
                    <TabsContent value="events" className="mt-0">
                      <div className="space-y-6">
                        <motion.h3 
                          className="font-bold text-3xl mb-6 flex items-center gap-3"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                        >
                          <CalendarBlank className="w-7 h-7 text-accent" weight="fill" />
                          <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                            Upcoming Events
                          </span>
                        </motion.h3>
                        <div className="grid gap-6">
                          {venue.events.map((event, index) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <EventCard event={event} />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  <TabsContent value="reviews" className="mt-0">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <motion.h3
                          className="font-bold text-3xl flex items-center gap-3"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                        >
                          <ChatCircle className="w-7 h-7 text-accent" weight="fill" />
                          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Customer Reviews
                          </span>
                        </motion.h3>
                        {onWriteReview && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              onClick={onWriteReview}
                              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                            >
                              <Star className="w-4 h-4 mr-2" weight="fill" />
                              Write a Review
                            </Button>
                          </motion.div>
                        )}
                      </div>
                      {allReviews.length > 0 ? (
                        <div className="space-y-6">
                          {allReviews.map((review, index) => (
                            <motion.div
                              key={review.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <ReviewCard review={review} />
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="glass-card p-12 rounded-3xl text-center">
                          <p className="text-muted-foreground text-lg mb-4">
                            No reviews yet. Be the first to share your experience!
                          </p>
                          {onWriteReview && (
                            <Button
                              onClick={onWriteReview}
                              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                            >
                              <Star className="w-4 h-4 mr-2" weight="fill" />
                              Write the First Review
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <motion.div 
                  className="text-center pt-4 glass-morphic p-4 rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                    <Sparkle className="w-4 h-4 text-accent" weight="fill" />
                    {getRelativeTime(venue.lastUpdated)}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
