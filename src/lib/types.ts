export type DealType = 'beer' | 'wine' | 'cocktails' | 'food' | 'all';
export type PriceLevel = 1 | 2 | 3;
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type UserRole = 'the-pourer' | 'the-drinker' | null;
export type DrinkingTheme = 'famous-drunks' | 'literary' | 'archetypal' | 'prohibition' | 'ancient-rome';

export interface TimeRange {
  start: string;
  end: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  type: DealType;
  price?: string;
  daysActive: DayOfWeek[];
  timeRange: TimeRange;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  ingredients?: string[];
  isSignature?: boolean;
  available: boolean;
}

export interface ThemedEvent {
  id: string;
  title: string;
  description: string;
  theme: string;
  drinkingTheme?: DrinkingTheme;
  date: string;
  startTime: string;
  endTime: string;
  image?: string;
  specialMenu?: MenuItem[];
  rsvpCount: number;
  tags: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  venueId: string;
  rating: number;
  comment: string;
  photos?: string[];
  tags: string[];
  date: string;
  helpfulCount: number;
}

export interface Bartender {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  venueId: string;
  specialties: string[];
  signatureDrinks: string[];
  yearsExperience: number;
  followerCount: number;
  rating: number;
  isVerified: boolean;
  thematicStyle?: DrinkingTheme;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  priceLevel: PriceLevel;
  rating: number;
  reviewCount: number;
  tags: string[];
  deals: Deal[];
  image: string;
  images?: string[];
  distance?: number;
  lastUpdated: string;
  bartenders?: Bartender[];
  menu?: MenuItem[];
  events?: ThemedEvent[];
  description?: string;
  hours?: Record<DayOfWeek, TimeRange | null>;
  followerCount?: number;
  amenities?: string[];
  drinkingThemes?: DrinkingTheme[];
}

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  favoriteVenues: string[];
  favoriteBartenders: string[];
  following: string[];
  preferences?: {
    favoriteDrinks?: string[];
    dietaryRestrictions?: string[];
    atmosphere?: string[];
    priceRange?: PriceLevel[];
  };
  achievements?: Achievement[];
  visitHistory?: VenueVisit[];
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: string;
}

export interface VenueVisit {
  venueId: string;
  date: string;
  rating?: number;
  reviewed: boolean;
}

export interface FilterState {
  dealTypes: DealType[];
  priceLevel: PriceLevel[];
  activeNow: boolean;
  day?: DayOfWeek;
  time?: string;
  searchQuery: string;
  hasEvents?: boolean;
  verified?: boolean;
  drinkingThemes?: DrinkingTheme[];
}

export interface SocialThread {
  id: string;
  type: 'live' | 'offline';
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
  };
  venueId?: string;
  createdAt: string;
  lastActivity: string;
  participantCount: number;
  messageCount: number;
  tags: string[];
  isActive: boolean;
  drinkingTheme?: DrinkingTheme;
}

export interface ThreadMessage {
  id: string;
  threadId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  timestamp: string;
  reactions: { emoji: string; count: number; users: string[] }[];
  mentions?: string[];
  images?: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  venueId: string;
  venueName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'happy-hour' | 'themed-event' | 'live-music' | 'tasting' | 'special';
  drinkingTheme?: DrinkingTheme;
  bartenderId?: string;
  rsvpCount: number;
  maxCapacity?: number;
  price?: string;
  specialMenu?: MenuItem[];
  image?: string;
  tags: string[];
}

export interface DailyContent {
  id: string;
  date: string;
  theme: DrinkingTheme;
  quote: string;
  quoteAuthor: string;
  story: string;
  cocktailOfTheDay: {
    name: string;
    recipe: string;
    history: string;
    image?: string;
  };
  historicalFact: string;
  recommendedVenues: string[];
  generatedAt: string;
}

export interface ThemeColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  glowColor: string;
}
