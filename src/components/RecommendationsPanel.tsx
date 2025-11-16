import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { VenueCard } from '@/components/VenueCard';
import {
  Sparkle,
  TrendUp,
  Fire,
  Star,
  Eye
} from '@phosphor-icons/react';
import { Venue, UserProfile, VenueVisit, DrinkingTheme } from '@/lib/types';
import { getPersonalizedRecommendations, getRecommendationsByCategory } from '@/lib/recommendation-engine';

interface RecommendationsPanelProps {
  allVenues: Venue[];
  userProfile: Partial<UserProfile>;
  visitHistory: VenueVisit[];
  favoriteVenues: string[];
  selectedTheme: DrinkingTheme | null;
  onSelectVenue: (venue: Venue) => void;
  onToggleFavorite: (venueId: string) => void;
  onCheckIn?: (venueId: string) => void;
}

export function RecommendationsPanel({
  allVenues,
  userProfile,
  visitHistory,
  favoriteVenues,
  selectedTheme,
  onSelectVenue,
  onToggleFavorite,
  onCheckIn
}: RecommendationsPanelProps) {
  const personalizedRecs = useMemo(() =>
    getPersonalizedRecommendations(
      allVenues,
      userProfile,
      visitHistory,
      favoriteVenues,
      selectedTheme,
      6
    ),
    [allVenues, userProfile, visitHistory, favoriteVenues, selectedTheme]
  );

  const categoryRecs = useMemo(() =>
    getRecommendationsByCategory(
      allVenues,
      visitHistory,
      favoriteVenues
    ),
    [allVenues, visitHistory, favoriteVenues]
  );

  if (personalizedRecs.length === 0 && Object.values(categoryRecs).every(r => r.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Personalized Recommendations */}
      {personalizedRecs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkle weight="fill" className="w-6 h-6 text-accent" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold">Recommended For You</h3>
              <p className="text-sm text-muted-foreground">Based on your preferences and activity</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalizedRecs.map((rec, index) => (
              <motion.div
                key={rec.venue.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative">
                  {rec.score > 50 && (
                    <motion.div
                      className="absolute -top-2 -right-2 z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <Badge className="bg-gradient-to-r from-accent to-secondary text-white shadow-lg">
                        <Star weight="fill" className="w-3 h-3 mr-1" />
                        Top Match
                      </Badge>
                    </motion.div>
                  )}
                  <VenueCard
                    venue={rec.venue}
                    onClick={() => onSelectVenue(rec.venue)}
                    isFavorite={favoriteVenues.includes(rec.venue.id)}
                    onToggleFavorite={() => onToggleFavorite(rec.venue.id)}
                    onCheckIn={onCheckIn ? () => onCheckIn(rec.venue.id) : undefined}
                  />
                  {rec.reasons.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {rec.reasons.slice(0, 2).map((reason, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1 h-1 rounded-full bg-accent" />
                          {reason}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Category-based Recommendations */}
      {Object.entries(categoryRecs).map(([category, recs]) => {
        if (recs.length === 0) return null;

        const categoryIcons: Record<string, React.ReactNode> = {
          'Top Rated': <Star weight="fill" className="w-5 h-5 text-accent" />,
          'Active Now': <Fire weight="fill" className="w-5 h-5 text-accent" />,
          'Popular': <TrendUp weight="fill" className="w-5 h-5 text-primary" />,
          'Hidden Gems': <Eye weight="fill" className="w-5 h-5 text-secondary" />
        };

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {categoryIcons[category]}
                <h3 className="text-lg font-bold">{category}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-accent hover:text-accent hover:bg-accent/10"
              >
                View All
              </Button>
            </div>

            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4">
                {recs.map((rec, index) => (
                  <motion.div
                    key={rec.venue.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="min-w-[280px] md:min-w-[320px]"
                  >
                    <VenueCard
                      venue={rec.venue}
                      onClick={() => onSelectVenue(rec.venue)}
                      isFavorite={favoriteVenues.includes(rec.venue.id)}
                      onToggleFavorite={() => onToggleFavorite(rec.venue.id)}
                      onCheckIn={onCheckIn ? () => onCheckIn(rec.venue.id) : undefined}
                    />
                    {rec.reasons.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {rec.reasons.slice(0, 2).map((reason, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1 h-1 rounded-full bg-accent" />
                            {reason}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        );
      })}
    </div>
  );
}
