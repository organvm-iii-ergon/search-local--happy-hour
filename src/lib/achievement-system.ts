import { Achievement, AchievementType, UserProfile, VenueVisit } from './types';

export const ACHIEVEMENT_DEFINITIONS: AchievementType[] = [
  {
    id: 'first-visit',
    title: 'First Pour',
    description: 'Visited your first happy hour venue',
    icon: '🍺',
    category: 'explorer',
    requirement: { type: 'visit_count', target: 1 },
    rarity: 'common'
  },
  {
    id: 'regular',
    title: 'Regular',
    description: 'Visited 10 different venues',
    icon: '🎯',
    category: 'explorer',
    requirement: { type: 'venue_count', target: 10 },
    rarity: 'common'
  },
  {
    id: 'neighborhood-explorer',
    title: 'Neighborhood Explorer',
    description: 'Visited 25 different venues',
    icon: '🗺️',
    category: 'explorer',
    requirement: { type: 'venue_count', target: 25 },
    rarity: 'rare'
  },
  {
    id: 'city-connoisseur',
    title: 'City Connoisseur',
    description: 'Visited 50 different venues',
    icon: '👑',
    category: 'connoisseur',
    requirement: { type: 'venue_count', target: 50 },
    rarity: 'epic'
  },
  {
    id: 'legend',
    title: 'Living Legend',
    description: 'Visited 100 different venues',
    icon: '⚡',
    category: 'connoisseur',
    requirement: { type: 'venue_count', target: 100 },
    rarity: 'legendary'
  },
  {
    id: 'bartender-supporter',
    title: 'Bartender Supporter',
    description: 'Followed 5 bartenders',
    icon: '🤝',
    category: 'supporter',
    requirement: { type: 'bartender_follow', target: 5 },
    rarity: 'common'
  },
  {
    id: 'super-fan',
    title: 'Super Fan',
    description: 'Followed 15 bartenders',
    icon: '⭐',
    category: 'supporter',
    requirement: { type: 'bartender_follow', target: 15 },
    rarity: 'rare'
  },
  {
    id: 'event-goer',
    title: 'Event Enthusiast',
    description: 'Attended 5 themed events',
    icon: '🎉',
    category: 'social',
    requirement: { type: 'event_attend', target: 5 },
    rarity: 'common'
  },
  {
    id: 'party-animal',
    title: 'Party Animal',
    description: 'Attended 20 themed events',
    icon: '🎊',
    category: 'social',
    requirement: { type: 'event_attend', target: 20 },
    rarity: 'rare'
  },
  {
    id: 'reviewer',
    title: 'Voice of the People',
    description: 'Left 10 reviews',
    icon: '📝',
    category: 'social',
    requirement: { type: 'review_count', target: 10 },
    rarity: 'common'
  },
  {
    id: 'critic',
    title: 'Certified Critic',
    description: 'Left 50 reviews',
    icon: '🎭',
    category: 'social',
    requirement: { type: 'review_count', target: 50 },
    rarity: 'epic'
  },
  {
    id: 'social-butterfly',
    title: 'Social Butterfly',
    description: 'Participated in 25 social threads',
    icon: '🦋',
    category: 'social',
    requirement: { type: 'social_engagement', target: 25 },
    rarity: 'rare'
  },
  {
    id: 'famous-drunks-explorer',
    title: 'In Good Company',
    description: 'Visited 5 Famous Drunks themed venues',
    icon: '🥃',
    category: 'connoisseur',
    requirement: { type: 'theme_exploration', target: 5, theme: 'famous-drunks' },
    rarity: 'rare'
  },
  {
    id: 'literary-explorer',
    title: 'Well Read',
    description: 'Visited 5 Literary themed venues',
    icon: '📚',
    category: 'connoisseur',
    requirement: { type: 'theme_exploration', target: 5, theme: 'literary' },
    rarity: 'rare'
  },
  {
    id: 'archetypal-explorer',
    title: 'Mythic Journey',
    description: 'Visited 5 Archetypal themed venues',
    icon: '🎭',
    category: 'connoisseur',
    requirement: { type: 'theme_exploration', target: 5, theme: 'archetypal' },
    rarity: 'rare'
  },
  {
    id: 'prohibition-explorer',
    title: 'Speakeasy Insider',
    description: 'Visited 5 Prohibition themed venues',
    icon: '🕵️',
    category: 'connoisseur',
    requirement: { type: 'theme_exploration', target: 5, theme: 'prohibition' },
    rarity: 'rare'
  },
  {
    id: 'ancient-rome-explorer',
    title: 'Roman Holiday',
    description: 'Visited 5 Ancient Rome themed venues',
    icon: '🏛️',
    category: 'connoisseur',
    requirement: { type: 'theme_exploration', target: 5, theme: 'ancient-rome' },
    rarity: 'rare'
  },
  {
    id: 'theme-master',
    title: 'Theme Master',
    description: 'Completed all theme exploration achievements',
    icon: '🌟',
    category: 'special',
    requirement: { type: 'theme_exploration', target: 25 },
    rarity: 'legendary'
  }
];

export function checkAchievements(
  profile: UserProfile,
  currentAchievements: Achievement[]
): Achievement[] {
  const newAchievements: Achievement[] = [];
  const currentAchievementIds = currentAchievements.map(a => a.id);

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    if (currentAchievementIds.includes(def.id)) continue;

    if (shouldUnlockAchievement(def, profile)) {
      newAchievements.push({
        id: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        category: def.category,
        unlockedAt: new Date().toISOString()
      });
    }
  }

  return newAchievements;
}

function shouldUnlockAchievement(def: AchievementType, profile: UserProfile): boolean {
  const { requirement } = def;

  switch (requirement.type) {
    case 'visit_count':
      return (profile.visitHistory?.length || 0) >= requirement.target;

    case 'venue_count': {
      const uniqueVenues = new Set(profile.visitHistory?.map(v => v.venueId) || []);
      return uniqueVenues.size >= requirement.target;
    }

    case 'bartender_follow':
      return (profile.favoriteBartenders?.length || 0) >= requirement.target;

    case 'event_attend':
      return (profile.rsvpdEvents?.length || 0) >= requirement.target;

    case 'review_count':
      return (profile.reviewsWritten?.length || 0) >= requirement.target;

    case 'social_engagement':
      return (profile.threadParticipation?.length || 0) >= requirement.target;

    case 'theme_exploration': {
      if (requirement.theme) {
        // Count visits to venues with this specific theme
        const themeVisits = profile.visitHistory?.filter(visit =>
          visit.themes?.includes(requirement.theme as any)
        ).length || 0;
        return themeVisits >= requirement.target;
      }
      // For Theme Master achievement - count total themed visits
      const totalThemeVisits = profile.visitHistory?.filter(visit =>
        visit.themes && visit.themes.length > 0
      ).length || 0;
      return totalThemeVisits >= requirement.target;
    }

    default:
      return false;
  }
}

export function getAchievementProgress(
  def: AchievementType,
  profile: UserProfile
): { current: number; target: number; percentage: number } {
  const { requirement } = def;
  let current = 0;

  switch (requirement.type) {
    case 'visit_count':
      current = profile.visitHistory?.length || 0;
      break;

    case 'venue_count': {
      const uniqueVenues = new Set(profile.visitHistory?.map(v => v.venueId) || []);
      current = uniqueVenues.size;
      break;
    }

    case 'bartender_follow':
      current = profile.favoriteBartenders?.length || 0;
      break;

    case 'event_attend':
      current = profile.rsvpdEvents?.length || 0;
      break;

    case 'review_count':
      current = profile.reviewsWritten?.length || 0;
      break;

    case 'social_engagement':
      current = profile.threadParticipation?.length || 0;
      break;

    case 'theme_exploration': {
      if (requirement.theme) {
        // Count visits to venues with this specific theme
        current = profile.visitHistory?.filter(visit =>
          visit.themes?.includes(requirement.theme as any)
        ).length || 0;
      } else {
        // For Theme Master achievement - count total themed visits
        current = profile.visitHistory?.filter(visit =>
          visit.themes && visit.themes.length > 0
        ).length || 0;
      }
      break;
    }

    default:
      current = 0;
  }

  const target = requirement.target;
  const percentage = Math.min((current / target) * 100, 100);

  return { current, target, percentage };
}
