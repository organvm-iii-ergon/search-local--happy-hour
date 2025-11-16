import { Venue, DrinkingTheme, VenueVisit } from './types';
import { getPersonalizedRecommendations } from './recommendation-engine';

export interface ItineraryStop {
  venue: Venue;
  arrivalTime: string;
  departureTime: string;
  duration: number; // minutes
  purpose: string;
  activities: string[];
  estimatedSpend: string;
  distance?: number;
}

export interface BarCrawlItinerary {
  id: string;
  name: string;
  description: string;
  theme?: DrinkingTheme;
  totalDuration: number; // minutes
  totalDistance: number; // km
  estimatedCost: string;
  stops: ItineraryStop[];
  startTime: string;
  endTime: string;
  tips: string[];
  createdAt: string;
}

export async function generateBarCrawlItinerary(
  allVenues: Venue[],
  preferences: {
    startTime: string;
    duration: number; // hours
    theme?: DrinkingTheme;
    priceLevel?: number[];
    neighborhoods?: string[];
    interests?: string[];
    partySize?: number;
  },
  visitHistory: VenueVisit[] = [],
  favoriteVenues: string[] = []
): Promise<BarCrawlItinerary> {
  const { startTime, duration, theme, priceLevel, neighborhoods, interests, partySize = 4 } = preferences;

  // Filter venues based on preferences
  let candidateVenues = allVenues.filter(v => {
    if (priceLevel && !priceLevel.includes(v.priceLevel)) return false;
    if (neighborhoods && !neighborhoods.includes(v.neighborhood)) return false;
    if (theme && v.drinkingThemes && !v.drinkingThemes.includes(theme)) return false;
    if (interests && !v.tags.some(tag => interests.some(i => tag.toLowerCase().includes(i.toLowerCase())))) return false;
    return true;
  });

  // Prioritize highly rated, unvisited venues
  candidateVenues = candidateVenues.sort((a, b) => {
    const aVisited = visitHistory.some(v => v.venueId === a.id) ? 0 : 10;
    const bVisited = visitHistory.some(v => v.venueId === b.id) ? 0 : 10;
    return (b.rating + bVisited) - (a.rating + aVisited);
  });

  // Determine number of stops based on duration
  const hoursAvailable = duration;
  const avgStopDuration = 75; // minutes per venue
  const numStops = Math.min(Math.max(2, Math.floor((hoursAvailable * 60) / avgStopDuration)), 6);

  // Select venues with variety
  const selectedVenues: Venue[] = [];
  const usedNeighborhoods = new Set<string>();

  for (const venue of candidateVenues) {
    if (selectedVenues.length >= numStops) break;

    // Ensure variety in neighborhoods (don't cluster too much)
    if (selectedVenues.length > 0 && usedNeighborhoods.has(venue.neighborhood) && usedNeighborhoods.size < numStops / 2) {
      continue;
    }

    selectedVenues.push(venue);
    usedNeighborhoods.add(venue.neighborhood);
  }

  // If not enough venues, add more regardless of neighborhood
  if (selectedVenues.length < numStops) {
    for (const venue of candidateVenues) {
      if (selectedVenues.length >= numStops) break;
      if (!selectedVenues.includes(venue)) {
        selectedVenues.push(venue);
      }
    }
  }

  // Create itinerary stops
  const stops: ItineraryStop[] = [];
  let currentTime = new Date(`2000-01-01T${startTime}`);
  let totalDistance = 0;

  selectedVenues.forEach((venue, index) => {
    const isFirst = index === 0;
    const isLast = index === selectedVenues.length - 1;

    // Vary duration: longer at first and last stop
    let stopDuration = avgStopDuration;
    if (isFirst) stopDuration = 60; // Kickoff
    else if (isLast) stopDuration = 90; // Wind down
    else stopDuration = 75;

    // Travel time between venues (simulated)
    const travelTime = isFirst ? 0 : Math.floor(Math.random() * 15) + 10; // 10-25 min
    const distance = isFirst ? 0 : Math.random() * 1.5 + 0.5; // 0.5-2 km

    currentTime = new Date(currentTime.getTime() + travelTime * 60000);
    totalDistance += distance;

    const arrivalTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

    currentTime = new Date(currentTime.getTime() + stopDuration * 60000);

    const departureTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

    // Generate purpose and activities
    let purpose = '';
    const activities: string[] = [];

    if (isFirst) {
      purpose = 'Kick off the night';
      activities.push('Start with appetizers', 'Light drinks to warm up', 'Plan the rest of the night');
    } else if (isLast) {
      purpose = 'Final destination';
      activities.push('Signature cocktails', 'Nightcap', 'Exchange contact info');
    } else if (index === Math.floor(selectedVenues.length / 2)) {
      purpose = 'Mid-crawl energy boost';
      activities.push('Food break', 'Group photos', 'Try local specialties');
    } else {
      purpose = 'Experience the vibe';
      activities.push('Sample the specials', 'Mingle with locals', 'Explore the atmosphere');
    }

    // Add venue-specific activities
    if (venue.events && venue.events.length > 0) {
      activities.push(`Check out: ${venue.events[0].title}`);
    }
    if (venue.deals && venue.deals.length > 0) {
      activities.push(`Happy hour: ${venue.deals[0].title}`);
    }

    // Estimate spend based on price level and duration
    const baseSpend = venue.priceLevel === 1 ? 15 : venue.priceLevel === 2 ? 25 : 40;
    const totalSpend = Math.floor(baseSpend * (stopDuration / 60) * (partySize || 1));
    const estimatedSpend = `$${totalSpend - 10}-${totalSpend + 10}`;

    stops.push({
      venue,
      arrivalTime,
      departureTime,
      duration: stopDuration,
      purpose,
      activities,
      estimatedSpend,
      distance
    });
  });

  // Generate tips
  const tips = [
    '💧 Drink water between venues to stay hydrated',
    '🚕 Consider ride-sharing between stops',
    '📸 Take photos at each venue to remember the night',
    '💳 Bring cash and cards - some venues may prefer one',
    '👥 Stick together as a group for safety',
    '⏰ Be flexible - some venues may be busier than expected',
    '🎫 Check if any venues require reservations or cover charges'
  ];

  if (theme) {
    tips.push(`🎭 Ask bartenders about ${theme}-themed drinks at each stop`);
  }

  // Calculate costs
  const minCost = stops.reduce((sum, stop) => {
    const min = parseInt(stop.estimatedSpend.split('-')[0].replace('$', ''));
    return sum + min;
  }, 0);
  const maxCost = stops.reduce((sum, stop) => {
    const max = parseInt(stop.estimatedSpend.split('-')[1].replace('$', ''));
    return sum + max;
  }, 0);

  const endTimeDate = new Date(currentTime);
  const endTime = `${endTimeDate.getHours().toString().padStart(2, '0')}:${endTimeDate.getMinutes().toString().padStart(2, '0')}`;

  // Generate name
  const themeName = theme ? ` ${theme.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}` : '';
  const crawlName = `${themeName} Bar Crawl: ${selectedVenues[0]?.neighborhood || 'City'} Edition`;

  const description = `Explore ${numStops} hand-picked venues across ${Math.round(totalDistance * 10) / 10}km. ${
    theme ? `Experience the ${theme} drinking theme at each stop. ` : ''
  }Perfect for ${partySize > 1 ? `groups of ${partySize}` : 'solo adventurers'}.`;

  return {
    id: `itinerary-${Date.now()}`,
    name: crawlName,
    description,
    theme,
    totalDuration: Math.floor((endTimeDate.getTime() - new Date(`2000-01-01T${startTime}`).getTime()) / 60000),
    totalDistance: Math.round(totalDistance * 10) / 10,
    estimatedCost: `$${minCost}-${maxCost} per person`,
    stops,
    startTime,
    endTime,
    tips,
    createdAt: new Date().toISOString()
  };
}

export function generateQuickCrawlOptions(): Array<{
  title: string;
  description: string;
  duration: number;
  theme?: DrinkingTheme;
  emoji: string;
}> {
  return [
    {
      title: 'Happy Hour Sprint',
      description: '3 stops, maximize deals',
      duration: 3,
      emoji: '⚡'
    },
    {
      title: 'Literary Pub Crawl',
      description: 'Book-themed venues, deep conversations',
      duration: 4,
      theme: 'literary',
      emoji: '📚'
    },
    {
      title: 'Speakeasy Adventure',
      description: 'Prohibition-era vibes, craft cocktails',
      duration: 4,
      theme: 'prohibition',
      emoji: '🕵️'
    },
    {
      title: 'Weekend Warriors',
      description: '6 stops, all night adventure',
      duration: 6,
      emoji: '🎉'
    },
    {
      title: 'Ancient Rome Experience',
      description: 'Classical venues, wine & philosophy',
      duration: 4,
      theme: 'ancient-rome',
      emoji: '🏛️'
    },
    {
      title: 'Neighborhood Explorer',
      description: 'Deep dive into one area',
      duration: 3,
      emoji: '🗺️'
    }
  ];
}
