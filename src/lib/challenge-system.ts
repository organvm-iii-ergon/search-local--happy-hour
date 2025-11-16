import { UserProfile, Venue, DrinkingTheme, VenueVisit } from './types';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'visit' | 'social' | 'discovery' | 'theme' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  theme?: DrinkingTheme;
  requirements: {
    type: string;
    target: number | string;
    current?: number;
  }[];
  rewards: {
    points: number;
    badge?: string;
    unlock?: string;
  };
  expiresAt: string;
  completedAt?: string;
  progress: number; // 0-100
  icon: string;
  hint?: string;
}

export function generatePersonalizedChallenges(
  userProfile: UserProfile,
  visitHistory: VenueVisit[],
  allVenues: Venue[]
): DailyChallenge[] {
  const challenges: DailyChallenge[] = [];
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 59);

  // Calculate user level based on activity
  const totalVisits = visitHistory.length;
  const uniqueVenues = new Set(visitHistory.map(v => v.venueId)).size;
  const favoritesCount = userProfile.favoriteVenues?.length || 0;
  const userLevel = Math.floor((totalVisits + uniqueVenues * 2 + favoritesCount * 3) / 10);

  // 1. DISCOVERY CHALLENGE - Adaptive based on exploration
  const visitedNeighborhoods = new Set(
    visitHistory.map(v => {
      const venue = allVenues.find(av => av.id === v.venueId);
      return venue?.neighborhood;
    }).filter(Boolean)
  );

  const unvisitedNeighborhoods = allVenues
    .map(v => v.neighborhood)
    .filter(n => !visitedNeighborhoods.has(n));

  if (unvisitedNeighborhoods.length > 0) {
    const randomNeighborhood = unvisitedNeighborhoods[Math.floor(Math.random() * unvisitedNeighborhoods.length)];
    challenges.push({
      id: `challenge-discovery-${Date.now()}`,
      title: `Neighborhood Explorer`,
      description: `Visit a venue in ${randomNeighborhood} for the first time`,
      type: 'discovery',
      difficulty: userLevel < 3 ? 'easy' : 'medium',
      points: 50,
      requirements: [{
        type: 'visit_neighborhood',
        target: randomNeighborhood,
        current: 0
      }],
      rewards: {
        points: 50,
        badge: '🗺️',
        unlock: `${randomNeighborhood} Explorer badge`
      },
      expiresAt: tomorrow.toISOString(),
      progress: 0,
      icon: '🗺️',
      hint: `Check out highly-rated venues in ${randomNeighborhood}!`
    });
  }

  // 2. SOCIAL CHALLENGE - Adaptive to social activity
  const socialEngagement = userProfile.threadParticipation?.length || 0;
  if (socialEngagement < 5) {
    // New users: easier social challenges
    challenges.push({
      id: `challenge-social-${Date.now()}`,
      title: 'Social Butterfly',
      description: 'Join and participate in 2 social threads',
      type: 'social',
      difficulty: 'easy',
      points: 30,
      requirements: [{
        type: 'thread_participation',
        target: 2,
        current: 0
      }],
      rewards: {
        points: 30,
        badge: '🦋'
      },
      expiresAt: tomorrow.toISOString(),
      progress: 0,
      icon: '💬'
    });
  } else {
    // Active users: harder social challenges
    challenges.push({
      id: `challenge-social-${Date.now()}`,
      title: 'Community Leader',
      description: 'Start a new thread and get 5 responses',
      type: 'social',
      difficulty: 'hard',
      points: 100,
      requirements: [
        { type: 'create_thread', target: 1, current: 0 },
        { type: 'thread_responses', target: 5, current: 0 }
      ],
      rewards: {
        points: 100,
        badge: '👑',
        unlock: 'Thread Starter badge'
      },
      expiresAt: tomorrow.toISOString(),
      progress: 0,
      icon: '👥'
    });
  }

  // 3. THEME CHALLENGE - Encourage theme exploration
  const themes: DrinkingTheme[] = ['literary', 'prohibition', 'ancient-rome', 'famous-drunks', 'archetypal'];
  const visitedThemes = new Set(
    visitHistory.flatMap(v => v.themes || [])
  );

  const unvisitedThemes = themes.filter(t => !visitedThemes.has(t));
  if (unvisitedThemes.length > 0) {
    const randomTheme = unvisitedThemes[Math.floor(Math.random() * unvisitedThemes.length)];
    const themeNames = {
      'literary': 'Literary',
      'prohibition': 'Prohibition',
      'ancient-rome': 'Ancient Rome',
      'famous-drunks': 'Famous Drunks',
      'archetypal': 'Archetypal'
    };

    challenges.push({
      id: `challenge-theme-${Date.now()}`,
      title: `${themeNames[randomTheme]} Experience`,
      description: `Visit a venue with ${themeNames[randomTheme]} theme`,
      type: 'theme',
      difficulty: 'medium',
      points: 75,
      theme: randomTheme,
      requirements: [{
        type: 'visit_theme',
        target: randomTheme,
        current: 0
      }],
      rewards: {
        points: 75,
        badge: '🎭',
        unlock: `${themeNames[randomTheme]} Enthusiast badge`
      },
      expiresAt: tomorrow.toISOString(),
      progress: 0,
      icon: '🎭',
      hint: `Look for venues tagged with ${themeNames[randomTheme]} theme!`
    });
  }

  // 4. VISIT STREAK CHALLENGE - Recursive (builds on itself)
  const last7DaysVisits = visitHistory.filter(v => {
    const visitDate = new Date(v.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return visitDate >= sevenDaysAgo;
  });

  if (last7DaysVisits.length >= 2) {
    // User is active, encourage streak
    challenges.push({
      id: `challenge-streak-${Date.now()}`,
      title: 'Keep the Streak Going',
      description: `Visit ${last7DaysVisits.length + 1} different venues this week`,
      type: 'visit',
      difficulty: 'medium',
      points: 60,
      requirements: [{
        type: 'weekly_visits',
        target: last7DaysVisits.length + 1,
        current: last7DaysVisits.length
      }],
      rewards: {
        points: 60,
        badge: '🔥'
      },
      expiresAt: tomorrow.toISOString(),
      progress: Math.round((last7DaysVisits.length / (last7DaysVisits.length + 1)) * 100),
      icon: '🔥',
      hint: 'Just one more venue to extend your streak!'
    });
  }

  // 5. QUALITY CHALLENGE - Rate and review
  const reviewsWritten = userProfile.reviewsWritten?.length || 0;
  if (totalVisits > reviewsWritten + 3) {
    challenges.push({
      id: `challenge-review-${Date.now()}`,
      title: 'Share Your Experience',
      description: 'Write detailed reviews for 3 recent visits',
      type: 'special',
      difficulty: 'easy',
      points: 40,
      requirements: [{
        type: 'write_reviews',
        target: 3,
        current: 0
      }],
      rewards: {
        points: 40,
        badge: '⭐',
        unlock: 'Critic badge'
      },
      expiresAt: tomorrow.toISOString(),
      progress: 0,
      icon: '📝'
    });
  }

  // 6. HAPPY HOUR HUNTER - Time-sensitive
  const now_hour = now.getHours();
  if (now_hour >= 15 && now_hour < 19) {
    challenges.push({
      id: `challenge-happyhour-${Date.now()}`,
      title: 'Happy Hour Hunter',
      description: 'Visit a venue during active happy hour (TODAY!)',
      type: 'special',
      difficulty: 'easy',
      points: 35,
      requirements: [{
        type: 'happy_hour_visit',
        target: 1,
        current: 0
      }],
      rewards: {
        points: 35,
        badge: '🍺'
      },
      expiresAt: new Date(now.setHours(23, 59, 59)).toISOString(),
      progress: 0,
      icon: '⏰',
      hint: 'Check the Active Now filter to find deals!'
    });
  }

  // 7. DIFFICULTY-ADAPTIVE CHALLENGE
  if (userLevel >= 5) {
    // Advanced users get compound challenges
    challenges.push({
      id: `challenge-master-${Date.now()}`,
      title: 'Master Socializer',
      description: 'Visit a new venue, write a review, and share it in a thread',
      type: 'special',
      difficulty: 'hard',
      points: 150,
      requirements: [
        { type: 'visit_new_venue', target: 1, current: 0 },
        { type: 'write_review', target: 1, current: 0 },
        { type: 'share_in_thread', target: 1, current: 0 }
      ],
      rewards: {
        points: 150,
        badge: '🏆',
        unlock: 'Master Socializer title'
      },
      expiresAt: tomorrow.toISOString(),
      progress: 0,
      icon: '🎯',
      hint: 'Complete all three tasks for maximum points!'
    });
  }

  return challenges.slice(0, 5); // Return top 5 challenges
}

export function checkChallengeProgress(
  challenge: DailyChallenge,
  userProfile: UserProfile,
  visitHistory: VenueVisit[]
): DailyChallenge {
  // This would be called after user actions to update progress
  let progress = 0;
  let completed = false;

  switch (challenge.type) {
    case 'visit':
      const recentVisits = visitHistory.filter(v => new Date(v.date) > new Date(challenge.expiresAt));
      progress = Math.min(100, (recentVisits.length / (challenge.requirements[0].target as number)) * 100);
      completed = progress >= 100;
      break;

    case 'social':
      const threadParticipation = userProfile.threadParticipation?.length || 0;
      progress = Math.min(100, (threadParticipation / (challenge.requirements[0].target as number)) * 100);
      completed = progress >= 100;
      break;

    case 'theme':
      const themeVisits = visitHistory.filter(v => v.themes?.includes(challenge.theme!));
      progress = themeVisits.length > 0 ? 100 : 0;
      completed = themeVisits.length > 0;
      break;
  }

  return {
    ...challenge,
    progress,
    completedAt: completed ? new Date().toISOString() : undefined
  };
}

export function getChallengeRecommendations(challenges: DailyChallenge[], allVenues: Venue[]): Record<string, Venue[]> {
  const recommendations: Record<string, Venue[]> = {};

  challenges.forEach(challenge => {
    if (challenge.type === 'discovery' && challenge.requirements[0].type === 'visit_neighborhood') {
      const neighborhood = challenge.requirements[0].target as string;
      recommendations[challenge.id] = allVenues
        .filter(v => v.neighborhood === neighborhood)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    } else if (challenge.type === 'theme' && challenge.theme) {
      recommendations[challenge.id] = allVenues
        .filter(v => v.drinkingThemes?.includes(challenge.theme!))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    } else if (challenge.requirements[0].type === 'happy_hour_visit') {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      recommendations[challenge.id] = allVenues
        .filter(v => v.deals?.some(deal =>
          currentTime >= deal.timeRange.start && currentTime <= deal.timeRange.end
        ))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    }
  });

  return recommendations;
}
