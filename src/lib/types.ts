export type DealType = 'beer' | 'wine' | 'cocktails' | 'food' | 'all';
export type PriceLevel = 1 | 2 | 3;
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type UserRole = 'the-pourer' | 'the-drinker' | 'the-venue' | null;
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
  rsvpdEvents?: string[];
  reviewsWritten?: string[];
  threadParticipation?: string[];
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
  themes?: DrinkingTheme[];
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

export interface BartenderSchedule {
  id: string;
  bartenderId: string;
  venueId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  status: 'scheduled' | 'available' | 'unavailable';
}

export interface JobPosting {
  id: string;
  venueId: string;
  venueName: string;
  title: string;
  description: string;
  requirements: string[];
  schedule: string;
  payRange: string;
  benefits: string[];
  postedAt: string;
  status: 'open' | 'filled' | 'closed';
  applicants: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  venueName: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
  coverLetter: string;
  experience: string;
  availability: string[];
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'interviewing' | 'accepted' | 'rejected';
  venueNotes?: string;
}

export interface VenueProfile extends UserProfile {
  venueDetails: {
    venueId: string;
    operatingHours: Record<DayOfWeek, TimeRange | null>;
    capacity: number;
    staffCount: number;
    jobOpenings: JobPosting[];
    currentStaff: string[];
  };
}

export interface JobPosting {
  id: string;
  venueId: string;
  venueName: string;
  title: string;
  description: string;
  requirements: string[];
  schedule: string;
  payRange: string;
  benefits: string[];
  postedAt: string;
  status: 'open' | 'closed' | 'filled';
  applicants: number;
}

export interface BartenderApplication {
  id: string;
  bartenderId: string;
  jobId: string;
  resume: string;
  coverLetter: string;
  availability: BartenderSchedule[];
  appliedAt: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'cocktail' | 'beer' | 'wine' | 'spirits' | 'mocktail' | 'food';
  price: number;
  ingredients?: string[];
  drinkingTheme?: DrinkingTheme;
  isSignature?: boolean;
  imageUrl?: string;
  createdBy?: string; // bartender ID
  createdAt: string;
}

export interface DrinkingGame {
  id: string;
  name: string;
  description: string;
  rules: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  playerCount: { min: number; max: number };
  duration: string;
  drinkingTheme?: DrinkingTheme;
  materials: string[];
  variations?: string[];
  generatedAt: string;
  personalizedFor?: string;
}

export interface ChatMessage extends ThreadMessage {
  replyTo?: string;
  edited?: boolean;
  editedAt?: string;
  deleted?: boolean;
}

export interface DirectMessageConversation {
  id: string;
  participant1: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
  };
  participant2: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
    senderId: string;
  };
  unreadCount: number;
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
  edited?: boolean;
  editedAt?: string;
}

export interface AchievementType {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'explorer' | 'social' | 'connoisseur' | 'supporter' | 'special';
  requirement: {
    type: 'visit_count' | 'venue_count' | 'bartender_follow' | 'event_attend' | 'review_count' | 'social_engagement' | 'theme_exploration';
    target: number;
    theme?: DrinkingTheme;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
