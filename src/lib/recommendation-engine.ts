import { Venue, UserProfile, VenueVisit, DrinkingTheme } from './types';

export interface VenueRecommendation {
  venue: Venue;
  score: number;
  reasons: string[];
}

export function getPersonalizedRecommendations(
  allVenues: Venue[],
  userProfile: Partial<UserProfile>,
  visitHistory: VenueVisit[] = [],
  favoriteVenues: string[] = [],
  selectedTheme: DrinkingTheme | null = null,
  limit: number = 6
): VenueRecommendation[] {
  const recommendations: VenueRecommendation[] = [];

  // Get frequently visited neighborhoods
  const visitedNeighborhoods = visitHistory.reduce((acc, visit) => {
    const venue = allVenues.find(v => v.id === visit.venueId);
    if (venue) {
      acc[venue.neighborhood] = (acc[venue.neighborhood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Get favorite tags from visited venues
  const favoriteTags = visitHistory.reduce((acc, visit) => {
    const venue = allVenues.find(v => v.id === visit.venueId);
    if (venue) {
      venue.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  // Calculate scores for each venue
  for (const venue of allVenues) {
    // Skip already favorited venues
    if (favoriteVenues.includes(venue.id)) continue;

    // Skip visited venues in last 7 days
    const recentVisit = visitHistory.find(v =>
      v.venueId === venue.id &&
      new Date(v.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    if (recentVisit) continue;

    let score = 0;
    const reasons: string[] = [];

    // High rating boost
    if (venue.rating >= 4.5) {
      score += 20;
      reasons.push(`⭐ Highly rated (${venue.rating})`);
    } else if (venue.rating >= 4.0) {
      score += 10;
    }

    // Popular venue boost
    if (venue.reviewCount > 100) {
      score += 15;
      reasons.push('📊 Popular spot');
    }

    // Neighborhood preference
    const neighborhoodVisits = visitedNeighborhoods[venue.neighborhood] || 0;
    if (neighborhoodVisits > 0) {
      score += neighborhoodVisits * 5;
      reasons.push(`📍 Favorite area: ${venue.neighborhood}`);
    }

    // Tag matching
    let tagMatches = 0;
    venue.tags.forEach(tag => {
      if (favoriteTags[tag]) {
        tagMatches++;
        score += favoriteTags[tag] * 3;
      }
    });
    if (tagMatches > 0) {
      reasons.push(`🏷️ ${tagMatches} matching interest${tagMatches > 1 ? 's' : ''}`);
    }

    // Theme matching
    if (selectedTheme && venue.drinkingThemes?.includes(selectedTheme)) {
      score += 25;
      reasons.push(`🎭 Matches ${selectedTheme} theme`);
    }

    // Price level preference
    if (userProfile.preferences?.priceRange?.includes(venue.priceLevel)) {
      score += 10;
      reasons.push('💰 Matches your budget');
    }

    // Active deals boost
    const activeDeals = venue.deals?.filter(deal => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      return currentTime >= deal.timeRange.start && currentTime <= deal.timeRange.end;
    });
    if (activeDeals && activeDeals.length > 0) {
      score += 20;
      reasons.push('🍺 Happy hour active now!');
    }

    // Upcoming events boost
    if (venue.events && venue.events.length > 0) {
      const upcomingEvents = venue.events.filter(e => new Date(e.date) > new Date());
      if (upcomingEvents.length > 0) {
        score += 15;
        reasons.push(`🎉 ${upcomingEvents.length} upcoming event${upcomingEvents.length > 1 ? 's' : ''}`);
      }
    }

    // New venue (never visited)
    if (!visitHistory.some(v => v.venueId === venue.id)) {
      score += 5;
      reasons.push('✨ New to explore');
    }

    // Amenities matching user preferences
    if (userProfile.preferences?.atmosphere && venue.amenities) {
      const atmosphereMatches = userProfile.preferences.atmosphere.filter(a =>
        venue.amenities?.some(amenity => amenity.toLowerCase().includes(a.toLowerCase()))
      );
      if (atmosphereMatches.length > 0) {
        score += atmosphereMatches.length * 5;
        reasons.push('🎵 Great atmosphere match');
      }
    }

    // Recently updated boost
    const lastUpdated = new Date(venue.lastUpdated);
    const daysSinceUpdate = (Date.now() - lastUpdated.getTime()) / (24 * 60 * 60 * 1000);
    if (daysSinceUpdate < 7) {
      score += 10;
      reasons.push('🆕 Recently updated');
    }

    if (score > 0) {
      recommendations.push({ venue, score, reasons });
    }
  }

  // Sort by score and return top N
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getRecommendationsByCategory(
  allVenues: Venue[],
  visitHistory: VenueVisit[] = [],
  favoriteVenues: string[] = []
): Record<string, VenueRecommendation[]> {
  const visited = visitHistory.map(v => v.venueId);
  const unvisited = allVenues.filter(v =>
    !visited.includes(v.id) && !favoriteVenues.includes(v.id)
  );

  return {
    'Top Rated': unvisited
      .filter(v => v.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .map(venue => ({
        venue,
        score: venue.rating * 20,
        reasons: [`⭐ ${venue.rating} rating`, `📊 ${venue.reviewCount} reviews`]
      })),

    'Active Now': unvisited
      .filter(v => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        return v.deals?.some(deal =>
          currentTime >= deal.timeRange.start && currentTime <= deal.timeRange.end
        );
      })
      .slice(0, 6)
      .map(venue => ({
        venue,
        score: 100,
        reasons: ['🍺 Happy hour active now!', `💰 ${venue.deals?.length} deals`]
      })),

    'Popular': unvisited
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 6)
      .map(venue => ({
        venue,
        score: venue.reviewCount / 10,
        reasons: [`📊 ${venue.reviewCount} reviews`, `⭐ ${venue.rating} rating`]
      })),

    'Hidden Gems': unvisited
      .filter(v => v.rating >= 4.3 && v.reviewCount < 50)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .map(venue => ({
        venue,
        score: venue.rating * 15,
        reasons: ['💎 Hidden gem', `⭐ ${venue.rating} rating`, '✨ Less crowded']
      }))
  };
}
