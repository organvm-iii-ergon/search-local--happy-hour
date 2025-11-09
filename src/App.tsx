import { useState, useMemo, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { MagnifyingGlass, FunnelSimple, Heart, MapPin, Sparkle, CalendarBlank, Users as UsersIcon, Fire, ChatCircleDots } from '@phosphor-icons/react';
import { Venue, FilterState, UserRole, ThemedEvent, DrinkingTheme, DailyContent } from '@/lib/types';
import { MOCK_VENUES, MOCK_BARTENDERS, MOCK_EVENTS, MOCK_SOCIAL_THREADS, MOCK_CALENDAR_EVENTS } from '@/lib/mock-data';
import { isDealActiveNow } from '@/lib/time-utils';
import { generateDailyContent } from '@/lib/daily-content-service';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [userRole, setUserRole] = useKV<UserRole>('user-role', null);
  const [favorites, setFavorites] = useKV<string[]>('favorites', []);
  const [favoriteBartenders, setFavoriteBartenders] = useKV<string[]>('favorite-bartenders', []);
  const [rsvpdEvents, setRsvpdEvents] = useKV<string[]>('rsvpd-events', []);
  const [selectedTheme, setSelectedTheme] = useKV<DrinkingTheme | null>('selected-theme', null);
  const [dailyContent, setDailyContent] = useKV<DailyContent | null>('daily-content', null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
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
      return [...favs, venueId];
    });
  };

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

  const allEvents = useMemo(() => {
    const events: ThemedEvent[] = [];
    MOCK_VENUES.forEach(venue => {
      if (venue.events) {
        venue.events.forEach(event => events.push(event));
      }
    });
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

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
                  {userRole === 'the-pourer' ? 'Bartender Dashboard' : 'Social drink discovery & cultural exploration'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
                <TabsList className="grid w-full grid-cols-5 bg-transparent gap-2">
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
                    value="daily"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-accent-foreground rounded-2xl font-bold"
                  >
                    <Sparkle className="w-5 h-5 mr-2" weight="fill" />
                    Daily
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              <TabsContent value="venues" className="mt-0">
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
                  <div className="flex items-center gap-3 mb-2">
                    <CalendarBlank weight="fill" className="w-6 h-6 text-accent" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                      Upcoming Events
                    </h2>
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
                        onClick={() => {
                          toast.success('Thread feature coming soon!', {
                            description: 'Join the conversation and meet fellow drink enthusiasts.'
                          });
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="daily" className="mt-0">
                {dailyContent ? (
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
      />
    </div>
  );
}

export default App;