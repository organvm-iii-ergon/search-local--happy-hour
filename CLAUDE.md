# CLAUDE.md - AI Assistant Guide for Hello Happier Hour

## Project Overview

**Hello Happier Hour** is a social drink discovery and cultural exploration platform built with React 19, TypeScript, and the GitHub Spark framework. It connects bartenders and drink enthusiasts through curated happy hour experiences, enriched with five distinct drinking culture themes and daily AI-generated content.

**Project Type:** React web application with Vite build system
**Primary Language:** TypeScript 5.7
**Framework:** React 19 + GitHub Spark
**Purpose:** Social platform for venue discovery, bartender networking, and cultural education around drinking traditions

---

## Architecture Overview

### Technology Stack

**Core Framework:**
- React 19.0.0 with TypeScript 5.7.2
- Vite 6.3.5 (build tool & dev server)
- @github/spark ^0.39.0 (framework for GitHub integration)

**UI & Styling:**
- Tailwind CSS v4.1.11 (utility-first CSS framework)
- shadcn/ui v4 (40+ accessible UI components built on Radix UI)
- Framer Motion 12.6.2 (declarative animations)
- Radix UI (accessible component primitives)
- Phosphor Icons, Lucide React, Hero Icons

**State Management:**
- React Hooks (useState, useEffect, useMemo, useCallback)
- useKV hook from Spark (persistent key-value storage in browser)
- React Hook Form + Zod (form validation)
- TanStack React Query (data fetching)

**AI Integration:**
- Spark LLM service (GPT-4o for content generation)
- Daily content generation system
- Personalized drinking game creation

**Utilities:**
- date-fns (date manipulation)
- uuid (unique ID generation)
- clsx + tailwind-merge (className utilities)
- marked (markdown parsing)

---

## Directory Structure

```
/home/user/search-local--happy-hour/
├── src/                           # Main source code
│   ├── components/                # 63 React components total
│   │   ├── ui/                    # shadcn/ui library (40+ components)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── [35+ more UI components]
│   │   ├── VenueCard.tsx          # Glassmorphic venue cards
│   │   ├── VenueDetail.tsx        # Venue detail modal
│   │   ├── FilterPanel.tsx        # Multi-filter sidebar
│   │   ├── BartenderCard.tsx      # Bartender profile cards
│   │   ├── SocialThreadCard.tsx   # Social discussion threads
│   │   ├── ThreadChat.tsx         # In-thread chat interface
│   │   ├── EventCard.tsx          # Themed event cards
│   │   ├── CalendarView.tsx       # Month/day calendar
│   │   ├── DailyContentDisplay.tsx # AI-generated content
│   │   ├── DrinkingGamesGenerator.tsx
│   │   ├── BartenderScheduling.tsx
│   │   ├── UserProfileModal.tsx
│   │   ├── MenuDisplay.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── RoleSelection.tsx
│   │   ├── QuickStats.tsx
│   │   └── FloatingDecor.tsx
│   ├── lib/                       # Core business logic
│   │   ├── types.ts               # TypeScript type definitions (319 lines)
│   │   ├── theme-config.ts        # Theme configurations (5 themes)
│   │   ├── daily-content-service.ts # AI content generation
│   │   ├── achievement-system.ts  # Achievement logic (18 types)
│   │   ├── mock-data.ts           # Sample data
│   │   ├── time-utils.ts          # Time/date utilities
│   │   ├── game-generator.ts      # Drinking game generation
│   │   └── utils.ts               # Helper utilities (cn function)
│   ├── hooks/                     # Custom React hooks
│   │   └── use-mobile.ts          # Mobile detection hook
│   ├── styles/                    # Global CSS
│   │   ├── theme.css              # Radix UI color imports
│   │   ├── index.css              # Custom animations & glassmorphism
│   │   └── main.css               # Tailwind imports
│   ├── App.tsx                    # Main application (839 lines)
│   ├── main.tsx                   # Entry point with ErrorBoundary
│   └── ErrorFallback.tsx          # Error boundary fallback UI
├── public/                        # Static assets
├── tailwind.config.js             # Tailwind v4 configuration
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
├── components.json                # shadcn/ui configuration
├── package.json                   # Dependencies & scripts
├── README.md                      # User-facing documentation
├── PRD.md                         # Product requirements
└── CLAUDE.md                      # This file
```

---

## Key Files Reference

### Core Application Files

| File | Lines | Purpose |
|------|-------|---------|
| `src/App.tsx` | 839 | Main app component; manages all state, tabs, filtering, event handlers |
| `src/main.tsx` | ~30 | Entry point; wraps app in ErrorBoundary, initializes React root |
| `src/ErrorFallback.tsx` | ~50 | Error boundary fallback UI for runtime errors |

### Type Definitions & Configuration

| File | Lines | Purpose |
|------|-------|---------|
| `src/lib/types.ts` | 319 | **Critical:** All TypeScript interfaces (Venue, Bartender, User, Deal, Event, Achievement, etc.) |
| `src/lib/theme-config.ts` | 94 | 5 theme color schemes (OKLch format), theme descriptions, styling helper |
| `src/lib/mock-data.ts` | 200+ | Sample data: venues, bartenders, menu items, events, social threads, calendar data |

### Business Logic & Services

| File | Lines | Purpose |
|------|-------|---------|
| `src/lib/daily-content-service.ts` | 150+ | AI content generation using Spark LLM (GPT-4o); includes fallback content |
| `src/lib/achievement-system.ts` | 267 | 18 achievement types; logic for checking/unlocking achievements |
| `src/lib/game-generator.ts` | ~100 | Generates personalized drinking games based on user preferences |
| `src/lib/time-utils.ts` | 55 | Deal time validation, time formatting, relative time strings |
| `src/lib/utils.ts` | 6 | Utility: `cn()` for merging Tailwind classes |

### Configuration Files

| File | Purpose |
|------|---------|
| `tailwind.config.js` | Tailwind v4 config with theme extensions, OKLch colors, spacing |
| `tsconfig.json` | TypeScript compiler options; path aliases (@/*) |
| `vite.config.ts` | Vite config with React, Tailwind, Spark plugins |
| `components.json` | shadcn/ui CLI configuration |
| `package.json` | 60+ dependencies, dev dependencies, build scripts |
| `spark.meta.json` | Spark metadata: templateVersion 1, dbType "kv" |

---

## Development Workflows

### Running the Application

```bash
# Start development server (port 5000)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview

# Optimize dependencies
npm run optimize

# Kill port 5000 (if stuck)
npm run kill
```

### Adding New Features

**1. Add new UI components:**
```bash
# Use shadcn/ui CLI to add pre-built components
npx shadcn@latest add [component-name]

# Components are added to src/components/ui/
# Examples: dialog, dropdown-menu, select, toast
```

**2. Create custom components:**
- Place in `src/components/`
- Use TypeScript interfaces from `src/lib/types.ts`
- Follow existing patterns (see component architecture below)
- Import UI components from `@/components/ui/`

**3. Add new data types:**
- Define interfaces in `src/lib/types.ts`
- Export for use throughout the app
- Use discriminated unions for variant types

**4. Extend mock data:**
- Add to `src/lib/mock-data.ts`
- Follow existing structure
- Ensure TypeScript compliance

**5. Add new themes:**
- Update `src/lib/theme-config.ts`
- Add new ThemeType to enum
- Define OKLch color scheme
- Add icon and description

### State Management Patterns

**Persistent State (useKV):**
```typescript
// Use for data that should persist across sessions
const [userRole, setUserRole] = useKV<UserRole>('user-role', null);
const [favorites, setFavorites] = useKV<string[]>('favorites', []);
const [selectedTheme, setSelectedTheme] = useKV<ThemeType>('selected-theme', 'literary');

// Storage keys currently in use:
// - 'user-role'
// - 'favorites' (venue IDs)
// - 'favorite-bartenders' (bartender IDs)
// - 'rsvpd-events' (event IDs)
// - 'selected-theme'
// - 'daily-content-{theme}-{date}'
// - 'visit-history'
// - 'unlocked-achievements'
```

**Local State (useState):**
```typescript
// Use for temporary UI state
const [isOpen, setIsOpen] = useState(false);
const [activeTab, setActiveTab] = useState('venues');
const [searchQuery, setSearchQuery] = useState('');
```

**Computed State (useMemo):**
```typescript
// Use for expensive filtering/sorting operations
const filteredVenues = useMemo(() => {
  let results = [...MOCK_VENUES];
  // Apply filter conditions
  return results.sort((a, b) => comparison);
}, [dependencies]);
```

---

## Key Conventions & Patterns

### TypeScript Standards

**1. Always use explicit types:**
```typescript
// Good
const venue: Venue = MOCK_VENUES[0];
function handleClick(venueId: string): void { }

// Bad
const venue = MOCK_VENUES[0];  // Inferred but not explicit
function handleClick(venueId) { }  // Missing type
```

**2. Use interfaces from types.ts:**
```typescript
import type { Venue, Bartender, Deal, Event } from '@/lib/types';
```

**3. No `any` types:**
```typescript
// Good
const data: Venue[] = fetchVenues();

// Bad
const data: any = fetchVenues();
```

### Component Patterns

**1. Component Structure:**
```typescript
import { motion } from 'framer-motion';
import type { ComponentProps } from '@/lib/types';

interface MyComponentProps {
  title: string;
  onAction: () => void;
  optional?: boolean;
}

export function MyComponent({ title, onAction, optional = false }: MyComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Component content */}
    </motion.div>
  );
}
```

**2. Import Order Convention:**
```typescript
// 1. External libraries
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// 2. UI components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

// 3. Custom components
import { VenueCard } from '@/components/VenueCard';

// 4. Utilities and types
import type { Venue } from '@/lib/types';
import { cn } from '@/lib/utils';
import { THEME_CONFIG } from '@/lib/theme-config';
```

**3. Event Handler Naming:**
```typescript
// Use handle* prefix for event handlers
const handleVenueClick = (venueId: string) => { };
const handleFilterChange = (filters: FilterState) => { };
const handleRSVP = (eventId: string) => { };
```

**4. Boolean Props:**
```typescript
// Use is*, has*, show* prefixes
interface Props {
  isActive: boolean;
  hasDeals: boolean;
  showFilters: boolean;
}
```

### Styling Conventions

**1. Tailwind Class Organization:**
```typescript
// Order: layout → sizing → spacing → typography → colors → effects
<div className="flex flex-col gap-4 p-6 text-lg font-semibold text-gray-900 bg-white rounded-lg shadow-lg">
```

**2. Use cn() for Conditional Classes:**
```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === 'primary' && "primary-classes"
)} />
```

**3. Glassmorphism Classes:**
```typescript
// Pre-defined in index.css
<div className="glass-morphic">      {/* Standard glass effect */}
<div className="glass-morphic-strong"> {/* Stronger blur */}
<div className="glass-card">          {/* Card-specific glass */}
```

**4. Theme-Specific Styling:**
```typescript
// Use theme config for dynamic colors
import { THEME_CONFIG } from '@/lib/theme-config';

const themeStyles = THEME_CONFIG[selectedTheme];
style={{ backgroundColor: themeStyles.colors.primary }}
```

### Animation Patterns

**1. Standard Framer Motion Animations:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
>
```

**2. Staggered Children:**
```typescript
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    />
  ))}
</motion.div>
```

**3. Hover Effects:**
```typescript
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
```

### Data Flow Patterns

**1. Props Drilling (current approach):**
```typescript
// App.tsx holds most state
<VenueCard
  venue={venue}
  isFavorite={favorites.includes(venue.id)}
  onToggleFavorite={handleToggleFavorite}
  onSelect={handleVenueSelect}
/>
```

**2. Filtering Pattern:**
```typescript
const filteredVenues = useMemo(() => {
  let results = [...MOCK_VENUES];

  // Apply each filter
  if (filters.dealTypes.length > 0) {
    results = results.filter(v =>
      v.deals.some(d => filters.dealTypes.includes(d.type))
    );
  }

  if (filters.activeDealsOnly) {
    results = results.filter(v =>
      v.deals.some(d => isDealActive(d))
    );
  }

  // Sort by distance
  return results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
}, [filters]);
```

**3. Achievement Checking Pattern:**
```typescript
import { checkAchievements, ACHIEVEMENT_DEFINITIONS } from '@/lib/achievement-system';

// Check for new achievements after user actions
const newAchievements = checkAchievements(userProfile, currentAction);
if (newAchievements.length > 0) {
  setUnlockedAchievements([...unlockedAchievements, ...newAchievements]);
  // Show toast notification
}
```

---

## Theme System

### Five Drinking Culture Themes

Each theme has a unique identity, color scheme, and cultural context:

1. **Famous Drunks** (`famous-drunks`)
   - Colors: Warm browns/golds (whiskey-inspired)
   - Icons: Cocktail glass
   - Content: Hemingway, Churchill, Bukowski, legendary imbibers

2. **Literary** (`literary`)
   - Colors: Cool blues (ink-inspired)
   - Icons: Book
   - Content: Writers' haunts, literary cocktails, book club culture

3. **Archetypal** (`archetypal`)
   - Colors: Purples/magentas (mystical)
   - Icons: Mask
   - Content: Universal drinking personas, timeless rituals

4. **Prohibition** (`prohibition`)
   - Colors: Dark sepia tones (1920s-inspired)
   - Icons: Building
   - Content: Speakeasy era, bathtub gin, gangster culture

5. **Ancient Rome** (`ancient-rome`)
   - Colors: Warm golds/oranges (wine-inspired)
   - Icons: Columns
   - Content: Roman wine traditions, symposiums, Bacchanalian feasts

### Theme Configuration Location

File: `src/lib/theme-config.ts`

```typescript
export const THEME_CONFIG: Record<ThemeType, ThemeConfig> = {
  'famous-drunks': { /* config */ },
  'literary': { /* config */ },
  'archetypal': { /* config */ },
  'prohibition': { /* config */ },
  'ancient-rome': { /* config */ },
};
```

### Using Themes in Components

```typescript
import { THEME_CONFIG } from '@/lib/theme-config';

// Get current theme config
const currentTheme = THEME_CONFIG[selectedTheme];

// Apply theme colors
<div style={{
  backgroundColor: currentTheme.colors.primary,
  color: currentTheme.colors.foreground
}} />

// Use theme icon
<currentTheme.icon className="w-6 h-6" />
```

---

## AI Content Generation

### Daily Content Service

File: `src/lib/daily-content-service.ts`

**Content Types Generated:**
1. Quote of the day (from historical figures)
2. Cultural story (200-300 words)
3. Cocktail of the day (with recipe)
4. Historical facts

**Usage Pattern:**
```typescript
import { generateDailyContent } from '@/lib/daily-content-service';

const content = await generateDailyContent(selectedTheme);
// Returns: { quote, story, cocktail, facts }

// Content is cached per theme per day using useKV
const cacheKey = `daily-content-${theme}-${dateString}`;
```

**Fallback System:**
- Each content type has hardcoded fallback content
- If LLM call fails, fallback is returned
- Ensures app never breaks due to AI unavailability

**LLM Configuration:**
- Model: GPT-4o
- Streaming: Enabled (true)
- Prompt engineering: Theme-specific context in prompts

---

## Component Architecture Deep Dive

### UI Component Library (shadcn/ui)

Location: `src/components/ui/`

**Form Components:**
- button, input, textarea, select, checkbox, radio-group, switch, slider, label

**Layout Components:**
- card, separator, tabs, accordion, collapsible, resizable, sidebar, scroll-area

**Navigation:**
- breadcrumb, navigation-menu, menubar, dropdown-menu, context-menu

**Overlays:**
- dialog, sheet, popover, tooltip, hover-card, alert-dialog

**Data Display:**
- badge, avatar, table, progress, calendar, chart

**Feedback:**
- alert, toast (via Sonner), skeleton

**All components:**
- Built on Radix UI primitives
- Fully accessible (keyboard navigation, ARIA labels)
- Themeable via CSS variables
- TypeScript typed
- Customizable via className prop

### Custom Domain Components

**VenueCard.tsx:**
- Displays venue information in glassmorphic card
- Shows active deals badge, price level, distance
- 3D hover effect with mouse tracking
- Click to open VenueDetail modal
- Favorite toggle button

**VenueDetail.tsx:**
- Full-screen modal with venue details
- Tabs: Overview, Bartenders, Menu, Events, Reviews
- RSVP functionality for venue events
- Follow bartenders from within venue
- Close button and backdrop click to dismiss

**FilterPanel.tsx:**
- Multi-select filters for deal types, price levels, themes
- Toggle for "active deals only"
- Responsive: sidebar on desktop, drawer on mobile
- Reset filters button
- Real-time filtering (no apply button needed)

**BartenderCard.tsx:**
- Profile card with avatar, bio, specialties
- Follow/unfollow toggle
- Years of experience, follower count
- Signature drinks listed
- Click to view full profile

**SocialThreadCard.tsx:**
- Shows thread title, live/offline status, participant count
- Theme badge (if theme-specific)
- Click to open ThreadChat dialog
- Message count indicator
- Last activity timestamp

**ThreadChat.tsx:**
- Full chat interface with message list
- Role badges (bartender/member)
- Message input with emoji/mention support (planned)
- Reactions to messages (planned)
- Auto-scroll to bottom on new messages

**EventCard.tsx:**
- Themed event card with background gradient
- Date, time, location, capacity info
- RSVP button with capacity check
- Special menu preview
- Theme-colored accents

**CalendarView.tsx:**
- Month view with clickable dates
- Event indicators (dots) on dates with events
- Day detail view showing all events for selected date
- Theme-colored event markers
- Navigation between months

**DailyContentDisplay.tsx:**
- Displays AI-generated daily content
- Theme switcher
- Content sections: Quote, Story, Cocktail, Facts
- Loading states while generating
- Fallback content if generation fails

**Achievement System:**
- 18 achievement types defined
- Requirements: visit counts, RSVP counts, follows, favorites
- Bronze/Silver/Gold tier system
- Toast notifications on unlock
- Profile display of unlocked achievements

---

## Testing & Quality Assurance

### Current Testing Status

**No formal test suite currently implemented.**

When adding tests, consider:

1. **Unit Tests:**
   - Utility functions (`time-utils.ts`, `utils.ts`)
   - Achievement logic (`achievement-system.ts`)
   - Theme configuration

2. **Component Tests:**
   - UI component rendering
   - Event handler behavior
   - State management

3. **Integration Tests:**
   - Filter + sort combinations
   - RSVP flow
   - Favorite toggling
   - Theme switching

4. **Recommended Tools:**
   - Vitest (already Vite-based)
   - React Testing Library
   - @testing-library/user-event

### ESLint Configuration

Current ESLint rules (from package.json):
- TypeScript ESLint parser
- React Hooks plugin (enforces hooks rules)
- React Refresh plugin (ensures fast refresh compatibility)

**Run linting:**
```bash
npm run lint
```

---

## Performance Considerations

### Current Optimizations

1. **useMemo for expensive computations:**
   - Filtering large venue lists
   - Sorting by distance/rating
   - Achievement calculations

2. **Lazy loading:**
   - Dialogs/modals only render when open
   - Tab content only renders when active tab

3. **Efficient re-renders:**
   - Props-based rendering
   - Memoized callbacks where appropriate

4. **Image optimization:**
   - Consider using optimized formats (WebP)
   - Lazy load images below fold

### Future Optimizations

1. **Code splitting:**
   - React.lazy() for heavy components
   - Route-based splitting (if routes added)

2. **Virtual scrolling:**
   - For long lists (100+ venues)
   - Use react-window or similar

3. **Service workers:**
   - Cache static assets
   - Offline functionality

4. **Database integration:**
   - Replace MOCK_DATA with real backend
   - API calls with React Query caching

---

## Accessibility Standards

### Current Implementation

**WCAG AA Compliance:**
- Color contrast ratios meet AA standards
- Semantic HTML structure (main, nav, aside)
- ARIA labels on interactive elements
- Keyboard navigation support via Radix UI

**Responsive Design:**
- Mobile-first approach
- Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly tap targets (min 44x44px)

**Screen Reader Support:**
- Descriptive alt text (when images added)
- Form labels properly associated
- Status announcements (consider adding live regions)

### Accessibility Checklist for New Features

- [ ] Sufficient color contrast (4.5:1 for text, 3:1 for UI)
- [ ] Keyboard navigation works (Tab, Enter, Escape, Arrow keys)
- [ ] Focus indicators visible
- [ ] ARIA labels for icon-only buttons
- [ ] Semantic HTML elements used
- [ ] Form inputs have associated labels
- [ ] Error messages announced to screen readers
- [ ] Loading states communicated

---

## Git Workflow & Branching

### Branch Naming Convention

**Current branch:** `claude/claude-md-mi41xof5x38ezygi-01SQwacYs1huEwuy8etEEaQA`

**Pattern:** `claude/[session-identifier]`

### Commit Message Style

Based on recent commits:

```
<Type>: <Short description>

<Optional longer description>
```

**Examples:**
- `Add spark configuration`
- `Generated by Spark: <feature description>`
- `Fix: <bug description>`
- `Refactor: <code improvement>`

### Git Commands

```bash
# Check current branch and status
git status

# Create new feature branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "Add: Description of changes"

# Push to remote (with upstream tracking)
git push -u origin branch-name

# Pull latest changes
git pull origin branch-name

# View recent commits
git log --oneline -5
```

**Important Notes:**
- CRITICAL: Branches must start with 'claude/' and end with matching session ID for successful push
- Always use `git push -u origin <branch-name>` for first push
- Network failure retry: up to 4 times with exponential backoff (2s, 4s, 8s, 16s)
- Prefer specific branch fetches: `git fetch origin <branch-name>`

---

## Common Tasks for AI Assistants

### Adding a New Venue

1. **Update mock-data.ts:**
```typescript
export const MOCK_VENUES: Venue[] = [
  // ... existing venues
  {
    id: uuid(),
    name: "New Venue Name",
    type: "bar",
    address: "123 Main St",
    neighborhood: "Downtown",
    priceLevel: 2,
    rating: 4.5,
    distance: 0.8,
    isActiveNow: true,
    deals: [
      {
        id: uuid(),
        type: "happy-hour",
        title: "$5 Cocktails",
        description: "All house cocktails",
        startTime: "16:00",
        endTime: "19:00",
        daysOfWeek: ["mon", "tue", "wed", "thu", "fri"],
        discountPercentage: 30
      }
    ],
    bartenders: ["bartender-id"],
    upcomingEvents: [],
    menuHighlights: [],
    themeAffinity: ["literary"],
    reviews: []
  }
];
```

2. **Add corresponding bartender if needed**
3. **Test filtering and sorting**

### Adding a New Achievement

1. **Update achievement-system.ts:**
```typescript
export const ACHIEVEMENT_DEFINITIONS: AchievementType[] = [
  // ... existing achievements
  {
    id: 'new-achievement-id',
    title: 'Achievement Title',
    description: 'Description of what unlocks this',
    icon: '🏆',
    requirement: {
      type: 'visits',  // or 'rsvps', 'follows', 'favorites'
      target: 10
    },
    tier: 'bronze'  // or 'silver', 'gold'
  }
];
```

2. **Test achievement unlock logic**
3. **Verify toast notification displays**

### Adding a New Theme

1. **Update types.ts:**
```typescript
export type ThemeType =
  | 'famous-drunks'
  | 'literary'
  | 'archetypal'
  | 'prohibition'
  | 'ancient-rome'
  | 'new-theme';  // Add new theme
```

2. **Update theme-config.ts:**
```typescript
import { NewThemeIcon } from '@phosphor-icons/react';

export const THEME_CONFIG: Record<ThemeType, ThemeConfig> = {
  // ... existing themes
  'new-theme': {
    name: 'New Theme Name',
    description: 'Theme description',
    icon: NewThemeIcon,
    colors: {
      primary: 'oklch(0.XX 0.XX XXX)',
      secondary: 'oklch(0.XX 0.XX XXX)',
      accent: 'oklch(0.XX 0.XX XXX)',
      background: 'oklch(0.XX 0.XX XXX)',
      foreground: 'oklch(0.XX 0.XX XXX)',
    }
  }
};
```

3. **Update daily-content-service.ts** with theme-specific prompts
4. **Test theme switching and daily content generation**

### Adding a New UI Component

1. **Use shadcn CLI for pre-built components:**
```bash
npx shadcn@latest add component-name
```

2. **For custom components:**
```bash
# Create file: src/components/NewComponent.tsx
```

```typescript
import { motion } from 'framer-motion';
import type { NewComponentProps } from '@/lib/types';

interface NewComponentProps {
  // Define props
}

export function NewComponent({ /* props */ }: NewComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Component JSX */}
    </motion.div>
  );
}
```

3. **Add types to types.ts if needed**
4. **Import and use in App.tsx or parent component**

### Debugging Common Issues

**Issue: Component not rendering**
- Check if TypeScript types are correct
- Verify imports use correct paths (@/* alias)
- Check browser console for errors
- Ensure props are passed correctly

**Issue: Styling not applying**
- Clear Tailwind cache: `npm run dev` (restart)
- Check className spelling
- Verify Tailwind config includes file paths
- Check for CSS specificity conflicts

**Issue: State not persisting**
- Verify useKV hook is used (not useState)
- Check storage key is unique and consistent
- Browser console → Application → Local Storage to inspect

**Issue: Filters not working**
- Check useMemo dependencies array
- Verify filter state is updating
- Console.log filtered results
- Check filter logic for edge cases

**Issue: Build failing**
- Run `npm run build` to see TypeScript errors
- Fix type errors (no `any`, all props typed)
- Check for unused imports
- Verify all dependencies installed

---

## Security Considerations

### Current Security Measures

1. **TypeScript strict mode:**
   - Prevents common type-related bugs
   - Enforces null/undefined checks

2. **Input validation:**
   - React Hook Form + Zod for form validation
   - Type-safe props prevent invalid data

3. **No backend yet:**
   - All data is client-side mock data
   - No API calls (except LLM via Spark)

### Future Security Considerations

When adding backend:

1. **Authentication:**
   - Implement proper OAuth/JWT
   - Secure session management
   - CSRF protection

2. **Data Validation:**
   - Sanitize all user inputs
   - Validate on both client and server
   - Prevent XSS attacks

3. **API Security:**
   - Rate limiting
   - CORS configuration
   - Secure headers (CSP, HSTS)

4. **Environment Variables:**
   - Never commit API keys
   - Use .env files (gitignored)
   - Different keys for dev/prod

---

## AI Assistant Best Practices

### When Working with This Codebase

**DO:**
- ✅ Always reference types from `src/lib/types.ts`
- ✅ Use `useMemo` for expensive filtering/sorting
- ✅ Follow existing component structure patterns
- ✅ Add TypeScript types to all new code
- ✅ Use shadcn/ui components when possible
- ✅ Test theme switching after changes
- ✅ Verify responsive design (mobile + desktop)
- ✅ Check accessibility (keyboard navigation, contrast)
- ✅ Use `cn()` utility for conditional classes
- ✅ Add comments for complex logic
- ✅ Update MOCK_DATA for testing new features

**DON'T:**
- ❌ Use `any` type
- ❌ Bypass TypeScript compiler (no @ts-ignore)
- ❌ Modify shadcn/ui components directly (override with className)
- ❌ Hardcode colors (use theme config or Tailwind)
- ❌ Skip error handling (especially for LLM calls)
- ❌ Break existing functionality when adding features
- ❌ Remove accessibility features
- ❌ Commit without running `npm run lint`

### Code Review Checklist

Before considering code complete:

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] All components have proper TypeScript types
- [ ] Responsive design works (mobile + desktop)
- [ ] Theme switching works correctly
- [ ] No console errors in browser
- [ ] Accessibility: keyboard navigation works
- [ ] Performance: no unnecessary re-renders
- [ ] Code follows existing patterns
- [ ] Comments added for complex logic

### Understanding the Data Flow

```
User Action (e.g., click RSVP)
    ↓
Event Handler (e.g., handleRSVP)
    ↓
State Update (e.g., setRsvpdEvents)
    ↓
useKV saves to localStorage
    ↓
Re-render with updated state
    ↓
UI reflects change (button text, styles)
    ↓
Achievement check (optional)
    ↓
Toast notification (if achievement unlocked)
```

### Working with Spark LLM

```typescript
import { useSpark } from '@github/spark';

function MyComponent() {
  const spark = useSpark();

  const generateContent = async () => {
    const prompt = spark.llmPrompt`
      Generate a ${topic} description.
      Theme: ${theme}
      Length: 200 words
    `;

    try {
      const response = await spark.llm(prompt, 'gpt-4o', true);
      return response;
    } catch (error) {
      console.error('LLM error:', error);
      return fallbackContent;
    }
  };
}
```

**Important:**
- Always include try-catch for LLM calls
- Provide fallback content
- Cache responses to minimize API calls
- Use appropriate model (gpt-4o for quality, gpt-3.5-turbo for speed)

---

## File Organization Best Practices

### When to Create New Files

**Create new component file when:**
- Component is 100+ lines
- Component is reusable in multiple places
- Component has complex state logic
- Component could be unit tested independently

**Create new utility file when:**
- 3+ unrelated utility functions exist
- Logic is shared across multiple components
- Function is pure (no side effects)

**Create new service file when:**
- External API integration
- Complex business logic (e.g., achievement checking)
- Data transformation/normalization

### Import Path Aliases

Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Usage:**
```typescript
// Good (absolute)
import { Venue } from '@/lib/types';
import { Button } from '@/components/ui/button';

// Bad (relative)
import { Venue } from '../../lib/types';
import { Button } from '../ui/button';
```

---

## Deployment Considerations

### Build Process

```bash
# Production build
npm run build

# Output directory: dist/
# Contains: optimized JS, CSS, HTML, assets
```

### Environment Variables

Currently none required. When adding backend:

Create `.env.local`:
```
VITE_API_URL=https://api.example.com
VITE_SPARK_API_KEY=your-key-here
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Hosting Recommendations

**Static Hosting (current setup):**
- Vercel (recommended for Vite)
- Netlify
- GitHub Pages
- Cloudflare Pages

**Configuration needed:**
- SPA routing: rewrite all routes to index.html
- Environment variables set in platform
- Build command: `npm run build`
- Output directory: `dist`

---

## Resources & Documentation

### Official Documentation

- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### Internal Documentation

- `README.md` - User-facing project overview
- `PRD.md` - Product requirements document (if exists)
- `CLAUDE.md` - This file (AI assistant guide)

### Key Concepts to Understand

1. **React Hooks:** useState, useEffect, useMemo, useCallback
2. **TypeScript:** Interfaces, type unions, generics
3. **Tailwind:** Utility-first CSS, responsive design, dark mode
4. **Glassmorphism:** backdrop-filter, blur effects, transparency
5. **Framer Motion:** Declarative animations, variants, gestures
6. **Radix UI:** Accessible primitives, composition patterns
7. **OKLch Color Space:** Perceptually uniform, better than RGB/HSL

---

## Changelog & Version History

### Version 0.0.0 (Current)

**Implemented Features:**
- 5 thematic drinking cultures with unique color schemes
- Venue discovery with glassmorphic cards & filtering
- Bartender profiles with follow functionality
- Social threads (live/offline discussions)
- Integrated calendar with RSVP system
- AI-generated daily content (GPT-4o)
- Achievement system (18 types)
- Drinking game generator
- User profile with visit history
- Persistent state with useKV

**Planned Features (from README.md):**
- Real-time chat within social threads
- User profiles with achievement badges
- Bartender scheduling system
- Photo upload for UGC
- Search filters for threads/events
- Notification system for follows

---

## Contact & Support

**Project Maintainer:** GitHub Spark Team
**Framework:** GitHub Spark (v0.39.0)
**License:** MIT (Spark Template files)

**For Issues:**
- Check browser console for errors
- Verify TypeScript compilation: `npm run build`
- Run ESLint: `npm run lint`
- Review this CLAUDE.md for guidance

**For Feature Requests:**
- Review README.md "Next Steps" section
- Consider existing patterns and conventions
- Propose implementation plan before coding

---

## Quick Reference

### Most Important Files
1. `src/App.tsx` - Main application logic
2. `src/lib/types.ts` - All type definitions
3. `src/lib/theme-config.ts` - Theme configurations
4. `src/lib/mock-data.ts` - Sample data

### Most Common Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npx shadcn@latest add [component]  # Add UI component
```

### Most Common Patterns
```typescript
// State persistence
const [state, setState] = useKV<Type>('key', defaultValue);

// Filtering
const filtered = useMemo(() => data.filter(condition), [deps]);

// Styling
<div className={cn("base", conditional && "extra")} />

// Animation
<motion.div initial={{}} animate={{}} exit={{}} />
```

### Color Scheme (Default)
```typescript
background: 'oklch(0.98 0.01 85)'    // Near-white
foreground: 'oklch(0.25 0.08 250)'   // Dark blue-gray
primary: 'oklch(0.45 0.14 250)'      // Blue
secondary: 'oklch(0.72 0.15 35)'     // Orange
accent: 'oklch(0.75 0.16 85)'        // Yellow
```

---

**Last Updated:** 2025-11-18
**CLAUDE.md Version:** 1.0.0
**Project Version:** 0.0.0
