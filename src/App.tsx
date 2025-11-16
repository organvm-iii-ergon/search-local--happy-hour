import { useState, useMemo, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { VenueCard } from '@/components/VenueCard';
import { VenueDetail } from '@/components/VenueDetail';
import { FilterPanel } from '@/components/FilterPanel';
import { FloatingDecor } from '@/components/FloatingDecor';
import { QuickStats } from '@/components/QuickStats';
import { RoleSelection } from '@/components/RoleSelection';
import { BartenderCard } from '@/components/BartenderCard';
import { EventCard } from '@/components/EventCard';
import { SocialThreadCard } from '@/components/SocialThreadCard';
import { CalendarView } from '@/components/CalendarView';
import { DailyContentDisplay } from '@/components/DailyContentDisplay';
import { ThreadChat } from '@/components/ThreadChat';
import { UserProfileModal } from '@/components/UserProfileModal';
import { BartenderScheduling } from '@/components/BartenderScheduling';
import { DrinkingGamesLibrary } from '@/components/DrinkingGamesLibrary';
import { ReviewSubmissionModal } from '@/components/ReviewSubmissionModal';
import { DirectMessageList } from '@/components/DirectMessageList';
import { DirectMessageThread } from '@/components/DirectMessageThread';
import { EventCreationModal } from '@/components/EventCreationModal';
import { MenuItemEditor } from '@/components/MenuItemEditor';
import { HappyHourSpecialCreator } from '@/components/HappyHourSpecialCreator';
import { VenueManagementDashboard } from '@/components/VenueManagementDashboard';
import { NotificationCenter } from '@/components/NotificationCenter';
import { RecommendationsPanel } from '@/components/RecommendationsPanel';
import { ItineraryGenerator } from '@/components/ItineraryGenerator';
import { DailyChallenges } from '@/components/DailyChallenges';
import { MagnifyingGlass, FunnelSimple, Heart, MapPin, Sparkle, CalendarBlank, Users as UsersIcon, Fire, ChatCircleDots, User, DiceFive, Briefcase, Envelope, Plus, Martini } from '@phosphor-icons/react';
import { Venue, FilterState, UserRole, ThemedEvent, DrinkingTheme, DailyContent, SocialThread, UserProfile, VenueVisit, Achievement, Review, DirectMessageConversation, DirectMessage, MenuItem, Deal, Notification } from '@/lib/types';
import { createAchievementNotification, addNotification as addNotificationHelper } from '@/lib/notification-service';
import { MOCK_VENUES, MOCK_BARTENDERS, MOCK_EVENTS, MOCK_SOCIAL_THREADS, MOCK_CALENDAR_EVENTS } from '@/lib/mock-data';
import { isDealActiveNow } from '@/lib/time-utils';
import { generateDailyContent } from '@/lib/daily-content-service';
import { checkAchievements } from '@/lib/achievement-system';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [userRole, setUserRole] = useKV<UserRole>('user-role', null);
  const [favorites, setFavorites] = useKV<string[]>('favorites', []);
  const [favoriteBartenders, setFavoriteBartenders] = useKV<string[]>('favorite-bartenders', []);
  const [rsvpdEvents, setRsvpdEvents] = useKV<string[]>('rsvpd-events', []);
  const [reviewsWritten, setReviewsWritten] = useKV<string[]>('reviews-written', []);
  const [threadParticipation, setThreadParticipation] = useKV<string[]>('thread-participation', []);
  const [selectedTheme, setSelectedTheme] = useKV<DrinkingTheme | null>('selected-theme', null);
  const [dailyContent, setDailyContent] = useKV<DailyContent | null>('daily-content', null);
  const [visitHistory, setVisitHistory] = useKV<VenueVisit[]>('visit-history', []);
  const [achievements, setAchievements] = useKV<Achievement[]>('achievements', []);
  const [userReviews, setUserReviews] = useKV<Review[]>('user-reviews', []);
  const [dmConversations, setDmConversations] = useKV<DirectMessageConversation[]>('dm-conversations', []);
  const [userEvents, setUserEvents] = useKV<ThemedEvent[]>('user-events', []);
  const [userMenuItems, setUserMenuItems] = useKV<MenuItem[]>('user-menu-items', []);
  const [venueDeals, setVenueDeals] = useKV<Deal[]>('venue-deals', []);
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', []);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState<SocialThread | null>(null);
  const [selectedDMConversation, setSelectedDMConversation] = useState<DirectMessageConversation | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [showEventCreator, setShowEventCreator] = useState(false);
  const [showMenuEditor, setShowMenuEditor] = useState(false);
  const [showDealCreator, setShowDealCreator] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('venues');
  const [filters, setFilters] = useState<FilterState>({
    dealTypes: [],
    priceLevel: [],
    activeNow: false,
    searchQuery: '',
    drinkingThemes: []
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadDailyContent = async () => {
      if (!dailyContent || dailyContent.date !== new Date().toISOString().split('T')[0]) {
        const themes: DrinkingTheme[] = ['famous-drunks', 'literary', 'archetypal', 'prohibition', 'ancient-rome'];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        const content = await generateDailyContent(randomTheme);
        setDailyContent(content);
      }
    };
    loadDailyContent();
  }, []);

  const filteredVenues = useMemo(() => {
    let results = [...MOCK_VENUES];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(venue => 
        venue.name.toLowerCase().includes(query) ||
        venue.neighborhood.toLowerCase().includes(query) ||
        venue.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.activeNow) {
      results = results.filter(venue => 
        venue.deals.some(deal => isDealActiveNow(deal))
      );
    }

    if (filters.dealTypes.length > 0) {
      results = results.filter(venue =>
        venue.deals.some(deal => 
          filters.dealTypes.includes(deal.type) || deal.type === 'all'
        )
      );
    }

    if (filters.priceLevel.length > 0) {
      results = results.filter(venue =>
        filters.priceLevel.includes(venue.priceLevel)
      );
    }

    if (filters.drinkingThemes && filters.drinkingThemes.length > 0) {
      results = results.filter(venue => 
        venue.drinkingThemes && venue.drinkingThemes.some(theme => 
          filters.drinkingThemes!.includes(theme)
        )
      );
    }

    return results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [filters]);

  const toggleFavorite = (venueId: string) => {
    setFavorites((currentFavorites) => {
      const favs = currentFavorites || [];
      if (favs.includes(venueId)) {
        toast.success('Removed from favorites');
        return favs.filter(id => id !== venueId);
      }
      toast.success('Added to favorites!');

      // Find the venue to get its themes
      const venue = MOCK_VENUES.find(v => v.id === venueId);
      const newVisit: VenueVisit = {
        venueId,
        date: new Date().toISOString(),
        reviewed: false,
        themes: venue?.drinkingThemes || []
      };
      setVisitHistory((current) => [...(current || []), newVisit]);

      return [...favs, venueId];
    });
  };

  useEffect(() => {
    if (userRole && visitHistory && achievements) {
      const userProfile: UserProfile = {
        id: 'user-1',
        role: userRole,
        name: 'You',
        email: 'user@example.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
        favoriteVenues: favorites || [],
        favoriteBartenders: favoriteBartenders || [],
        following: [],
        visitHistory: visitHistory,
        rsvpdEvents: rsvpdEvents || [],
        reviewsWritten: reviewsWritten || [],
        threadParticipation: threadParticipation || [],
        achievements: achievements,
        createdAt: new Date().toISOString()
      };

      const newAchievements = checkAchievements(userProfile, achievements);
      if (newAchievements.length > 0) {
        setAchievements((current) => [...(current || []), ...newAchievements]);
        newAchievements.forEach(achievement => {
          toast.success(`Achievement Unlocked! ${achievement.icon}`, {
            description: achievement.title
          });

          // Create notification for achievement
          const notif = createAchievementNotification(
            achievement.title,
            achievement.description,
            achievement.icon
          );
          setNotifications((current) => addNotificationHelper(current || [], notif));
        });
      }
    }
  }, [visitHistory?.length, favoriteBartenders?.length, rsvpdEvents?.length, reviewsWritten?.length, threadParticipation?.length]);

  const toggleBartenderFollow = (bartenderId: string) => {
    setFavoriteBartenders((currentFavorites) => {
      const favs = currentFavorites || [];
      if (favs.includes(bartenderId)) {
        toast.success('Unfollowed bartender');
        return favs.filter(id => id !== bartenderId);
      }
      toast.success('Following bartender!');
      return [...favs, bartenderId];
    });
  };

  const toggleEventRSVP = (eventId: string) => {
    setRsvpdEvents((currentRSVPs) => {
      const rsvps = currentRSVPs || [];
      if (rsvps.includes(eventId)) {
        toast.success('RSVP cancelled');
        return rsvps.filter(id => id !== eventId);
      }
      toast.success('RSVP confirmed!');
      return [...rsvps, eventId];
    });
  };

  const trackThreadParticipation = (threadId: string) => {
    setThreadParticipation((current) => {
      const participation = current || [];
      if (!participation.includes(threadId)) {
        return [...participation, threadId];
      }
      return participation;
    });
  };

  const handleSubmitReview = (review: Omit<Review, 'id' | 'userId' | 'date' | 'helpfulCount'>) => {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      userId: 'user-1',
      date: new Date().toISOString(),
      helpfulCount: 0
    };

    setUserReviews((current) => [...(current || []), newReview]);

    // Track review for achievements
    setReviewsWritten((current) => {
      const reviews = current || [];
      if (!reviews.includes(newReview.id)) {
        return [...reviews, newReview.id];
      }
      return reviews;
    });

    // Mark visit as reviewed if exists
    setVisitHistory((current) =>
      (current || []).map(visit =>
        visit.venueId === review.venueId
          ? { ...visit, reviewed: true, rating: review.rating }
          : visit
      )
    );
  };

  const startDirectMessage = (recipientId: string, recipientName: string, recipientAvatar: string, recipientRole: UserRole) => {
    // Check if conversation already exists
    const existingConversation = dmConversations?.find(conv =>
      (conv.participant1.id === 'user-1' && conv.participant2.id === recipientId) ||
      (conv.participant2.id === 'user-1' && conv.participant1.id === recipientId)
    );

    if (existingConversation) {
      setSelectedDMConversation(existingConversation);
      setActiveTab('messages');
      return;
    }

    // Create new conversation
    const newConversation: DirectMessageConversation = {
      id: `conv-${Date.now()}`,
      participant1: {
        id: 'user-1',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
        role: userRole || 'the-drinker'
      },
      participant2: {
        id: recipientId,
        name: recipientName,
        avatar: recipientAvatar,
        role: recipientRole
      },
      unreadCount: 0,
      createdAt: new Date().toISOString()
    };

    setDmConversations((current) => [...(current || []), newConversation]);
    setSelectedDMConversation(newConversation);
    setActiveTab('messages');
    toast.success(`Started conversation with ${recipientName}`);
  };

  const handleDMSent = (conversationId: string) => {
    // Update last message in conversation
    setDmConversations((current) => {
      const conversations = current || [];
      return conversations.map(conv => {
        if (conv.id === conversationId) {
          // Get the messages for this conversation from localStorage
          const messagesKey = `dm-${conversationId}`;
          const storedMessages = localStorage.getItem(messagesKey);
          if (storedMessages) {
            const messages: DirectMessage[] = JSON.parse(storedMessages);
            const lastMessage = messages[messages.length - 1];
            if (lastMessage) {
              return {
                ...conv,
                lastMessage: {
                  content: lastMessage.content,
                  timestamp: lastMessage.timestamp,
                  senderId: lastMessage.senderId
                }
              };
            }
          }
        }
        return conv;
      });
    });
  };

  const handleCreateEvent = (event: Omit<ThemedEvent, 'id'>) => {
    const newEvent: ThemedEvent = {
      ...event,
      id: `event-${Date.now()}`
    };
    setUserEvents((current) => [...(current || []), newEvent]);
  };

  const handleCreateMenuItem = (item: Omit<MenuItem, 'id' | 'createdAt'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setUserMenuItems((current) => [...(current || []), newItem]);
  };

  const handleCreateDeal = (deal: Omit<Deal, 'id'>) => {
    const newDeal: Deal = {
      ...deal,
      id: `deal-${Date.now()}`
    };
    setVenueDeals((current) => [...(current || []), newDeal]);
    toast.success('Happy hour special created!', {
      description: 'Your special is now live and visible to customers.'
    });
  };

  const allEvents = useMemo(() => {
    const events: ThemedEvent[] = [];
    MOCK_VENUES.forEach(venue => {
      if (venue.events) {
        venue.events.forEach(event => events.push(event));
      }
    });
    // Add user-created events
    if (userEvents) {
      events.push(...userEvents);
    }
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [userEvents]);

  const activeFilterCount = 
    filters.dealTypes.length + 
    filters.priceLevel.length + 
    (filters.activeNow ? 1 : 0) +
    (filters.drinkingThemes?.length || 0);

  const headerOpacity = Math.min(scrollY / 100, 1);

  if (!userRole) {
    return <RoleSelection onSelectRole={setUserRole} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="parallax-bg" />
      <FloatingDecor />
      
      <Toaster />
      
      <motion.header 
        className="sticky top-0 z-50 glass-morphic-strong border-b border-border/50 backdrop-blur-xl"
        style={{
          boxShadow: `0 8px 32px 0 rgba(31, 38, 135, ${0.1 * headerOpacity})`
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4 py-5">
          <motion.div 
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-accent/30 via-secondary/20 to-primary/30 rounded-2xl blur-xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="relative">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent flex items-center gap-2">
                  <Sparkle weight="fill" className="text-accent" />
                  Hello Happier Hour
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  {userRole === 'the-pourer' ? 'Bartender Dashboard' : 
                   userRole === 'the-venue' ? 'Venue Management' :
                   'Social drink discovery & cultural exploration'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative glass-morphic border-border/50 hover:border-accent/50 transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: showFilters ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FunnelSimple weight={showFilters ? 'fill' : 'regular'} />
                  </motion.div>
                  <AnimatePresence>
                    {activeFilterCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs pulse-glow">
                          {activeFilterCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <MagnifyingGlass 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10" 
              weight="bold"
              size={20}
            />
            <Input
              placeholder="Search by venue, neighborhood, or vibe..."
              className="pl-12 h-12 glass-morphic border-border/50 focus:border-accent/50 transition-all duration-300 relative"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            />
          </motion.div>

          <motion.div 
            className="flex items-center gap-2 mt-4 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <MapPin weight="fill" className="w-5 h-5 text-primary" />
            <span className="text-foreground">Downtown</span>
            <span className="text-muted-foreground">•</span>
            <motion.span 
              className="text-accent font-semibold"
              key={filteredVenues.length}
              initial={{ scale: 1.2, color: 'oklch(0.72 0.15 35)' }}
              animate={{ scale: 1, color: 'oklch(0.75 0.16 85)' }}
            >
              {filteredVenues.length} venues
            </motion.span>
          </motion.div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <AnimatePresence>
            {showFilters && (
              <motion.aside 
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="lg:w-80 flex-shrink-0"
              >
                <div className="sticky top-24">
                  <FilterPanel filters={filters} onFiltersChange={setFilters} />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <motion.div 
            className="flex-1"
            layout
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-2 rounded-3xl mb-8"
              >
                <TabsList className="grid w-full grid-cols-8 bg-transparent gap-2">
                  <TabsTrigger
                    value="venues"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground rounded-2xl font-bold"
                  >
                    <Fire className="w-5 h-5 mr-2" weight="fill" />
                    Venues
                  </TabsTrigger>
                  <TabsTrigger
                    value="bartenders"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-accent data-[state=active]:text-secondary-foreground rounded-2xl font-bold"
                  >
                    <UsersIcon className="w-5 h-5 mr-2" weight="fill" />
                    Bartenders
                  </TabsTrigger>
                  <TabsTrigger
                    value="events"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-secondary data-[state=active]:text-accent-foreground rounded-2xl font-bold"
                  >
                    <CalendarBlank className="w-5 h-5 mr-2" weight="fill" />
                    Events
                  </TabsTrigger>
                  <TabsTrigger
                    value="social"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground rounded-2xl font-bold"
                  >
                    <ChatCircleDots className="w-5 h-5 mr-2" weight="fill" />
                    Social
                  </TabsTrigger>
                  <TabsTrigger
                    value="messages"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-accent-foreground rounded-2xl font-bold relative"
                  >
                    <Envelope className="w-5 h-5 mr-2" weight="fill" />
                    Messages
                    {dmConversations && dmConversations.filter(c => c.unreadCount > 0).length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent text-xs">
                        {dmConversations.filter(c => c.unreadCount > 0).length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="daily"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-accent-foreground rounded-2xl font-bold"
                  >
                    <Sparkle className="w-5 h-5 mr-2" weight="fill" />
                    Daily
                  </TabsTrigger>
                  <TabsTrigger
                    value="games"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-primary data-[state=active]:text-secondary-foreground rounded-2xl font-bold"
                  >
                    <DiceFive className="w-5 h-5 mr-2" weight="fill" />
                    Games
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground rounded-2xl font-bold"
                  >
                    <User className="w-5 h-5 mr-2" weight="fill" />
                    Profile
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              <TabsContent value="venues" className="mt-0">
                {/* Recommendations Panel */}
                {filteredVenues.length > 0 && !filters.searchQuery && (
                  <RecommendationsPanel
                    allVenues={MOCK_VENUES}
                    userProfile={{
                      id: 'user-1',
                      role: userRole || 'the-drinker',
                      name: 'You',
                      email: 'user@example.com',
                      favoriteVenues: favorites || [],
                      favoriteBartenders: favoriteBartenders || [],
                      following: [],
                      visitHistory: visitHistory || [],
                      preferences: {
                        priceRange: [1, 2, 3]
                      },
                      createdAt: new Date().toISOString()
                    }}
                    visitHistory={visitHistory || []}
                    favoriteVenues={favorites || []}
                    selectedTheme={selectedTheme}
                    onSelectVenue={setSelectedVenue}
                    onToggleFavorite={toggleFavorite}
                    onCheckIn={checkInVenue}
                  />
                )}

                <QuickStats venues={filteredVenues} />

                <AnimatePresence mode="wait">
                  {filteredVenues.length === 0 ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-20"
                    >
                      <motion.div 
                        className="glass-card p-12 rounded-3xl inline-block stacked-element"
                        animate={{ 
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <motion.div 
                          className="text-8xl mb-6"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🍹
                        </motion.div>
                        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          No deals found
                        </h2>
                        <p className="text-muted-foreground mb-6 text-lg">
                          Try adjusting your filters or search terms
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            size="lg"
                            onClick={() => setFilters({
                              dealTypes: [],
                              priceLevel: [],
                              activeNow: false,
                              searchQuery: ''
                            })}
                            className="bg-gradient-to-r from-accent to-secondary text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Clear All Filters
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="grid"
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {filteredVenues.map((venue, index) => (
                        <motion.div
                          key={venue.id}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ 
                            delay: index * 0.05,
                            type: 'spring',
                            stiffness: 100,
                            damping: 15
                          }}
                        >
                          <VenueCard
                            venue={venue}
                            isFavorite={(favorites || []).includes(venue.id)}
                            onToggleFavorite={toggleFavorite}
                            onClick={() => setSelectedVenue(venue)}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="bartenders" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-8 rounded-3xl mb-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkle weight="fill" className="w-6 h-6 text-accent" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Featured Bartenders
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Connect with expert mixologists and craft beverage specialists
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {MOCK_BARTENDERS.map((bartender, index) => (
                    <motion.div
                      key={bartender.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: 'spring',
                        stiffness: 100,
                        damping: 15
                      }}
                    >
                      <BartenderCard
                        bartender={bartender}
                        isFollowing={(favoriteBartenders || []).includes(bartender.id)}
                        onToggleFollow={toggleBartenderFollow}
                        onViewProfile={(id) => {
                          const venue = MOCK_VENUES.find(v => v.bartenders?.some(b => b.id === id));
                          if (venue) setSelectedVenue(venue);
                        }}
                        onMessage={(id, name, avatar) => {
                          startDirectMessage(id, name, avatar, 'the-pourer');
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-8 rounded-3xl mb-8"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <CalendarBlank weight="fill" className="w-6 h-6 text-accent" />
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                        Upcoming Events
                      </h2>
                    </div>
                    {userRole === 'the-pourer' && (
                      <Button
                        onClick={() => setShowEventCreator(true)}
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      >
                        <Plus className="w-4 h-4 mr-2" weight="bold" />
                        Create Event
                      </Button>
                    )}
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Don't miss out on themed nights and special experiences
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {allEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: 'spring',
                        stiffness: 100,
                        damping: 15
                      }}
                    >
                      <EventCard
                        event={event}
                        isRSVPd={(rsvpdEvents || []).includes(event.id)}
                        onRSVP={toggleEventRSVP}
                        onViewDetails={(id) => {
                          const venue = MOCK_VENUES.find(v => v.events?.some(e => e.id === id));
                          if (venue) setSelectedVenue(venue);
                        }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Bar Crawl Itinerary Generator */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-12"
                >
                  <ItineraryGenerator
                    allVenues={MOCK_VENUES}
                    visitHistory={visitHistory}
                    favoriteVenues={favorites}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="social" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-8 rounded-3xl mb-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <ChatCircleDots weight="fill" className="w-6 h-6 text-accent" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Social Threads
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Join conversations, plan meetups, and connect with the community
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_SOCIAL_THREADS.map((thread, index) => (
                    <motion.div
                      key={thread.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: 'spring',
                        stiffness: 100,
                        damping: 15
                      }}
                    >
                      <SocialThreadCard
                        thread={thread}
                        onClick={() => setSelectedThread(thread)}
                      />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="messages" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-3xl overflow-hidden h-[700px] flex"
                >
                  {selectedDMConversation ? (
                    <DirectMessageThread
                      conversation={selectedDMConversation}
                      currentUserId="user-1"
                      currentUserName="You"
                      currentUserAvatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
                      onBack={() => setSelectedDMConversation(null)}
                      onMessageSent={handleDMSent}
                    />
                  ) : (
                    <DirectMessageList
                      conversations={dmConversations || []}
                      currentUserId="user-1"
                      onSelectConversation={setSelectedDMConversation}
                      selectedConversationId={selectedDMConversation?.id}
                    />
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="daily" className="mt-0">
                {dailyContent ? (
                  <>
                    <DailyContentDisplay
                      content={dailyContent}
                      onExploreVenues={() => {
                        setFilters({
                          ...filters,
                          drinkingThemes: [dailyContent.theme]
                        });
                        setActiveTab('venues');
                      }}
                    />

                    {/* Daily Challenges */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-12"
                    >
                      <DailyChallenges
                        userProfile={{
                          id: 'user-1',
                          role: userRole || 'the-drinker',
                          name: 'You',
                          email: 'user@example.com',
                          favoriteVenues: favorites || [],
                          favoriteBartenders: favoriteBartenders || [],
                          following: [],
                          visitHistory: visitHistory || [],
                          rsvpdEvents: rsvpdEvents || [],
                          reviewsWritten: reviewsWritten || [],
                          threadParticipation: threadParticipation || [],
                          createdAt: new Date().toISOString()
                        }}
                        visitHistory={visitHistory || []}
                        allVenues={MOCK_VENUES}
                        onSelectVenue={setSelectedVenue}
                      />
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-12 rounded-3xl text-center"
                  >
                    <div className="text-6xl mb-4">✨</div>
                    <p className="text-xl text-muted-foreground">Loading today's content...</p>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="games" className="mt-0">
                <DrinkingGamesLibrary />
              </TabsContent>

              <TabsContent value="profile" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {userRole === 'the-pourer' && (
                    <div className="glass-card p-6 rounded-3xl">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Martini weight="fill" className="text-accent" />
                        Bartender Tools
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={() => setShowEventCreator(true)}
                          variant="outline"
                          className="glass-morphic border-accent/50 hover:border-accent h-auto py-4"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <CalendarBlank className="w-6 h-6" weight="fill" />
                            <span className="font-bold">Create Event</span>
                            <span className="text-xs text-muted-foreground">Host themed experiences</span>
                          </div>
                        </Button>
                        <Button
                          onClick={() => setShowMenuEditor(true)}
                          variant="outline"
                          className="glass-morphic border-accent/50 hover:border-accent h-auto py-4"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Martini className="w-6 h-6" weight="fill" />
                            <span className="font-bold">Add Menu Item</span>
                            <span className="text-xs text-muted-foreground">Create signature drinks</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  )}

                  {userRole === 'the-venue' && (
                    <VenueManagementDashboard
                      venue={{
                        ...MOCK_VENUES[0],
                        id: 'user-venue-1',
                        name: 'Your Venue',
                        deals: venueDeals || []
                      }}
                      applications={[]}
                      reviews={userReviews}
                      events={userEvents}
                      onCreateDeal={() => setShowDealCreator(true)}
                      onCreateEvent={() => setShowEventCreator(true)}
                      onViewApplications={() => setShowScheduling(true)}
                    />
                  )}

                  <div className="glass-card p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                      <User weight="fill" className="w-6 h-6 text-accent" />
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Your Profile
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="glass-morphic p-6 rounded-2xl text-center">
                        <div className="text-4xl font-bold text-accent mb-2">
                          {(visitHistory || []).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Visits</div>
                      </div>
                      <div className="glass-morphic p-6 rounded-2xl text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {new Set((visitHistory || []).map(v => v.venueId)).size}
                        </div>
                        <div className="text-sm text-muted-foreground">Unique Venues</div>
                      </div>
                      <div className="glass-morphic p-6 rounded-2xl text-center">
                        <div className="text-4xl font-bold text-secondary mb-2">
                          {(achievements || []).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Achievements</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        onClick={() => setShowProfile(true)}
                        className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      >
                        View Full Profile
                      </Button>
                      {(userRole === 'the-pourer' || userRole === 'the-venue') && (
                        <Button
                          onClick={() => setShowScheduling(true)}
                          className="flex-1 bg-gradient-to-r from-secondary to-accent text-secondary-foreground"
                        >
                          <Briefcase className="mr-2" weight="fill" />
                          {userRole === 'the-venue' ? 'Manage Jobs' : 'Find Jobs'}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="glass-card p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-4">Recent Achievements</h3>
                    {(achievements || []).length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏆</div>
                        <h4 className="text-xl font-bold mb-2">No achievements yet</h4>
                        <p className="text-muted-foreground">
                          Start exploring to unlock achievements!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(achievements || []).slice(0, 4).map((achievement, index) => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-morphic p-4 rounded-2xl text-center"
                          >
                            <div className="text-4xl mb-2">{achievement.icon}</div>
                            <div className="font-bold text-sm mb-1">{achievement.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {achievement.description}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>

            <AnimatePresence>
              {(favorites || []).length > 0 && activeTab === 'venues' && filteredVenues.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 glass-card p-8 rounded-3xl stacked-element floating-element"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Heart weight="fill" className="text-secondary w-6 h-6" />
                    </motion.div>
                    <h2 className="text-2xl font-bold">
                      {(favorites || []).length} Favorite{(favorites || []).length !== 1 ? 's' : ''}
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Your saved venues are always easy to find. Come back anytime!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <VenueDetail
        venue={selectedVenue}
        open={!!selectedVenue}
        onOpenChange={(open) => !open && setSelectedVenue(null)}
        userReviews={userReviews}
        onWriteReview={() => {
          if (selectedVenue) {
            setShowReviewModal(true);
          }
        }}
      />

      <ReviewSubmissionModal
        venue={selectedVenue}
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        onSubmit={handleSubmitReview}
        currentUserId="user-1"
        currentUserName="You"
        currentUserAvatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
      />

      <Dialog open={!!selectedThread} onOpenChange={(open) => !open && setSelectedThread(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedThread && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{selectedThread.title}</h2>
                <p className="text-muted-foreground">{selectedThread.description}</p>
              </div>
              <ThreadChat
                threadId={selectedThread.id}
                currentUserId="user-1"
                currentUserName="You"
                currentUserAvatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
                currentUserRole={userRole || 'the-drinker'}
                onMessageSent={trackThreadParticipation}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {userRole && (
        <>
          <UserProfileModal
            profile={{
              id: 'user-1',
              role: userRole,
              name: 'You',
              email: 'user@example.com',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
              favoriteVenues: favorites || [],
              favoriteBartenders: favoriteBartenders || [],
              following: [],
              visitHistory: visitHistory || [],
              achievements: achievements || [],
              createdAt: new Date().toISOString()
            }}
            open={showProfile}
            onOpenChange={setShowProfile}
          />

          <BartenderScheduling
            bartenderId={userRole === 'the-pourer' ? 'user-1' : undefined}
            venueId={userRole === 'the-venue' ? 'user-venue-1' : undefined}
            userRole={userRole === 'the-drinker' ? null : userRole}
            open={showScheduling}
            onOpenChange={setShowScheduling}
            currentUserId="user-1"
            currentUserName="You"
            currentUserAvatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
          />

          <EventCreationModal
            open={showEventCreator}
            onOpenChange={setShowEventCreator}
            onSubmit={handleCreateEvent}
            bartenderId="user-1"
            bartenderName="You"
            venues={MOCK_VENUES}
          />

          <MenuItemEditor
            open={showMenuEditor}
            onOpenChange={setShowMenuEditor}
            onSubmit={handleCreateMenuItem}
            bartenderId="user-1"
          />

          <HappyHourSpecialCreator
            open={showDealCreator}
            onOpenChange={setShowDealCreator}
            onSubmit={handleCreateDeal}
            venueId="user-venue-1"
          />
        </>
      )}
    </div>
  );
}

export default App;