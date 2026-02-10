[![ORGAN-III: Ergon](https://img.shields.io/badge/ORGAN--III-Ergon-1b5e20?style=flat-square)](https://github.com/organvm-iii-ergon)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

# search-local--happy-hour

**Social drink discovery and cultural exploration platform connecting bartenders, venues, and drink enthusiasts through curated happy hour experiences — enriched by five historically grounded drinking-culture themes and daily AI-generated content.**

Hello Happier Hour reimagines venue discovery as a cultural act. Instead of presenting a static list of deals, the platform wraps each venue, event, and social thread in one of five drinking-culture lenses — Famous Drunks, Literary, Archetypal, Prohibition, and Ancient Rome — so that choosing where to drink on a Thursday evening becomes an encounter with Hemingway's daiquiris, Fitzgerald's jazz-age excess, or the structured conviviality of a Roman symposium. A built-in AI content service generates fresh quotes, cocktail recipes, historical stories, and surprising facts for each theme every day, keeping the experience alive and evergreen without manual editorial overhead.

The application supports three distinct user roles — **the-drinker** (customers discovering venues and tracking their journey), **the-pourer** (bartenders building professional profiles and finding work), and **the-venue** (venue owners managing staff, scheduling, and hiring) — each with a tailored interface, onboarding flow, and feature set. A gamification layer (achievements with four rarity tiers, visit history tracking, and theme-exploration badges) and a real-time social system (live and offline discussion threads with emoji reactions, @mentions, and message editing) turn passive browsing into active community participation.

---

## Table of Contents

- [Product Overview](#product-overview)
- [Technical Architecture](#technical-architecture)
- [Directory Structure](#directory-structure)
- [Installation and Quick Start](#installation-and-quick-start)
- [Features](#features)
  - [Thematic Drinking Cultures](#thematic-drinking-cultures)
  - [Daily Generative Content](#daily-generative-content)
  - [Venue Discovery and Filtering](#venue-discovery-and-filtering)
  - [Social Threads and Real-Time Chat](#social-threads-and-real-time-chat)
  - [Calendar and Event System](#calendar-and-event-system)
  - [Achievement and Gamification System](#achievement-and-gamification-system)
  - [AI-Generated Drinking Games](#ai-generated-drinking-games)
  - [Bartender Profiles and Job Marketplace](#bartender-profiles-and-job-marketplace)
- [Design System](#design-system)
- [Data Model](#data-model)
- [User Flows](#user-flows)
- [Cross-Organ Context](#cross-organ-context)
- [Roadmap](#roadmap)
- [Related Work](#related-work)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Product Overview

Most happy-hour apps treat venues as commodities — pins on a map with a price tag. Hello Happier Hour treats them as cultural sites. The core insight is that people do not choose a bar; they choose an experience. By layering historically informed drinking-culture themes over the venue graph, the platform converts a utilitarian search ("cheap drinks near me") into an expressive one ("where can I drink like Dorothy Parker tonight?").

This repositioning serves a practical purpose as well. For bartenders, the platform is a career tool: a place to build a portfolio, showcase signature drinks, attract followers, and find job openings posted by venues. For venue owners, it is a hiring and scheduling dashboard that surfaces qualified candidates with verified profiles. The three-sided marketplace — drinkers, pourers, and venues — is held together by the thematic layer, which gives every participant a shared vocabulary and a reason to keep coming back.

The product sits within ORGAN-III (Ergon), the commerce organ of the eight-organ creative-institutional system. ORGAN-III houses all revenue-generating products, SaaS tools, and B2C applications. Hello Happier Hour is classified as a **B2C consumer product** — a local-first social marketplace with future monetization vectors in promoted listings, premium venue dashboards, and bartender certification tiers.

### Key Metrics (Design Targets)

| Metric | Target |
|--------|--------|
| Thread-coordinated meetup attendance | 2x baseline |
| Achievement-driven repeat visits | 3x for users with 5+ badges |
| Review-influenced new-customer decisions | 70% |
| Calendar users event attendance | 3x more events |
| Job posting fill rate | 60% within 2 weeks |
| Daily content engagement | 60% of DAU |

---

## Technical Architecture

Hello Happier Hour is a single-page React application built on the GitHub Spark framework. The architecture prioritizes client-side rendering, local-first persistence, and AI-augmented content generation.

### Stack Overview

| Layer | Technology | Role |
|-------|-----------|------|
| **Framework** | React 19 + TypeScript 5.7 | Component model, strict typing |
| **Platform** | GitHub Spark (`@github/spark`) | Hosting, KV persistence, LLM access |
| **Build** | Vite 6.3 | Dev server, HMR, production bundling |
| **Styling** | Tailwind CSS v4 + shadcn/ui v4 | Utility-first CSS, 40+ accessible Radix UI primitives |
| **Animation** | Framer Motion 12.6 | Spring physics, gesture-responsive 3D transforms |
| **AI** | GPT-4o via Spark LLM service | Daily content generation, drinking game creation |
| **State** | React hooks + `useKV` (Spark) | Local-first persistence with browser KV store |
| **Forms** | React Hook Form + Zod | Schema-validated form handling |
| **Data Fetching** | TanStack React Query | Caching, background refetching |
| **Charts** | Recharts + D3 | Data visualization |
| **Icons** | Phosphor Icons, Lucide React, Hero Icons | Consistent iconography |
| **3D** | Three.js | Ambient visual effects |

### Architectural Decisions

**Local-first persistence.** All user state — role selection, favorites, RSVPs, theme preferences, visit history, achievement progress — persists through Spark's `useKV` hook, which writes to the browser's key-value store. This eliminates the need for a backend database during the prototype phase while preserving data between sessions. The trade-off (no cross-device sync) is acceptable for a venue-discovery product where usage is inherently local.

**AI content pipeline with graceful degradation.** The daily content service calls GPT-4o through Spark's LLM abstraction to generate theme-specific quotes, stories, cocktail recipes, and historical facts. Every AI call is wrapped in a try/catch that falls back to a curated set of hand-written content per theme. The fallback library covers all five themes with full content payloads, so the product never shows an empty state even if the AI service is unavailable. Content is cached by date to minimize redundant API calls.

**Component architecture.** The application is organized into 23 feature components (venue cards, bartender profiles, event cards, thread chat, calendar views, filter panels, role selection, daily content display, drinking games generator, scheduling, user profiles) and 40+ shared UI primitives from shadcn/ui. Feature components are colocated in `src/components/`; shared primitives live in `src/components/ui/`. Business logic (types, theme configuration, achievement evaluation, game generation, time utilities, mock data) is isolated in `src/lib/`.

**Theme-driven color system.** Each of the five drinking-culture themes defines a complete color scheme (primary, secondary, accent, background, card background, text, border, and glow colors) using OKLCH color space for perceptual uniformity. Theme styles are applied as CSS custom properties via a `getThemeStyles()` function, allowing the entire UI to re-skin itself dynamically when the user switches themes. All theme combinations maintain WCAG AA contrast ratios.

---

## Directory Structure

```
search-local--happy-hour/
├── src/
│   ├── App.tsx                          # Root component: routing, role state, tab navigation
│   ├── ErrorFallback.tsx                # Error boundary UI
│   ├── main.tsx                         # Entry point
│   ├── components/
│   │   ├── BartenderCard.tsx            # Bartender profile card with follow/unfollow
│   │   ├── BartenderScheduling.tsx      # Weekly schedule view and shift management
│   │   ├── CalendarView.tsx             # Month view with day detail and RSVP
│   │   ├── DailyContentDisplay.tsx      # AI-generated daily theme content
│   │   ├── DrinkingGamesGenerator.tsx   # AI-powered game creation UI
│   │   ├── EventCard.tsx                # Themed event card with RSVP
│   │   ├── FilterPanel.tsx              # Multi-faceted venue filtering
│   │   ├── FloatingDecor.tsx            # Ambient animated background icons
│   │   ├── MenuDisplay.tsx              # Venue drink and food menus
│   │   ├── QuickStats.tsx               # Dashboard statistics cards
│   │   ├── ReviewCard.tsx               # User review display
│   │   ├── RoleSelection.tsx            # Onboarding role picker
│   │   ├── SocialThreadCard.tsx         # Thread preview in list view
│   │   ├── ThreadChat.tsx               # Real-time chat with reactions and mentions
│   │   ├── UserProfileModal.tsx         # Profile with achievements and visit history
│   │   ├── VenueCard.tsx                # Glassmorphic venue card with 3D tilt
│   │   ├── VenueDetail.tsx              # Full venue page with tabs
│   │   └── ui/                          # 40+ shadcn/ui primitives (Radix-based)
│   ├── hooks/
│   │   └── use-mobile.ts               # Responsive breakpoint hook
│   ├── lib/
│   │   ├── types.ts                     # 25+ TypeScript interfaces and type unions
│   │   ├── theme-config.ts             # 5 OKLCH color schemes + theme descriptions
│   │   ├── achievement-system.ts       # 18 achievements, progress tracking, unlock logic
│   │   ├── daily-content-service.ts    # GPT-4o content generation + fallback library
│   │   ├── game-generator.ts           # AI drinking game creation + 6 fallback games
│   │   ├── mock-data.ts               # Sample venues, bartenders, events, threads
│   │   ├── time-utils.ts              # Deal activity time calculations
│   │   └── utils.ts                   # Shared utility functions (cn, etc.)
│   └── styles/
│       └── theme.css                   # CSS custom properties and theme variables
├── .github/
│   └── dependabot.yml                  # Automated dependency updates
├── package.json                        # Dependencies and scripts
├── vite.config.ts                      # Vite build configuration
├── tsconfig.json                       # TypeScript compiler options
├── tailwind.config.js                  # Tailwind CSS configuration
├── components.json                     # shadcn/ui component registry
├── theme.json                          # Design token definitions
├── runtime.config.json                 # Spark runtime settings
├── PRD.md                              # Product Requirements Document
├── ROADMAP.md                          # Development roadmap
├── SECURITY.md                         # Security policy
├── CLAUDE.md                           # AI assistant context guide
└── LICENSE                             # MIT License
```

---

## Installation and Quick Start

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+ or equivalent package manager
- A GitHub Spark environment (for `useKV` persistence and LLM access)

### Setup

```bash
# Clone the repository
git clone https://github.com/organvm-iii-ergon/search-local--happy-hour.git
cd search-local--happy-hour

# Install dependencies
npm install

# Start development server
npm run dev
```

The application launches at `http://localhost:5000` with hot module replacement enabled. On first visit, you will be presented with a role-selection screen to choose between **the-drinker**, **the-pourer**, or **the-venue**.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run ESLint across the codebase |
| `npm run preview` | Preview production build locally |
| `npm run optimize` | Pre-bundle dependencies with Vite |

### Environment Notes

This application is built on the GitHub Spark framework. The `@github/spark` package provides:

- **`useKV` hook** for persistent key-value storage (user preferences, favorites, RSVPs, theme selections, achievements)
- **`spark.llm()` and `spark.llmPrompt`** for GPT-4o content generation (daily themes, drinking games)
- **Hosting infrastructure** with built-in routing and asset serving

If running outside of Spark, the AI-powered features (daily content generation, drinking game creation) will fall back to curated static content. All other features — venue discovery, social threads, calendar, achievements, bartender profiles — function fully with mock data.

---

## Features

### Thematic Drinking Cultures

The platform's defining feature is its five historically grounded drinking-culture themes, each providing a complete visual and narrative identity:

| Theme | Color Palette | Cultural Frame |
|-------|--------------|----------------|
| **Famous Drunks** | Rich bourbon, aged brass, sunset gold on mahogany | Hemingway, Churchill, Sinatra, Dorothy Parker — legendary imbibers and their haunts |
| **Literary** | Ink blue, library purple, aqua on midnight navy | The Algonquin Round Table, Paris cafes, book-lined speakeasies, writers' cocktails |
| **Archetypal** | Mystic plum, royal magenta, dawn pink on shadow purple | The Sage, the Trickster, the Rebel — universal drinking personas across cultures |
| **Prohibition** | Sepia brown, brass fixture, champagne fizz on cellar dark | Speakeasies, bathtub gin, jazz age rebellion, passwords and hidden doors |
| **Ancient Rome** | Terracotta, bronze patina, honey wine on stone chamber | Symposiums, mulsum, amphora vessels, Bacchanalian feasts, "in vino veritas" |

Each theme applies a complete OKLCH color scheme (nine color tokens: primary, secondary, accent, background, card background, text primary/secondary, border, glow) through CSS custom properties. Switching themes re-skins the entire UI — venue cards, filter panels, thread badges, event markers, daily content displays — in a single state update. All color pairings maintain WCAG AA contrast ratios.

### Daily Generative Content

Every day, the AI content service generates a fresh payload for each of the five themes:

- **Inspirational quote** with attribution (historical figure relevant to the theme)
- **Cultural story** (200-300 words of historical narrative)
- **Cocktail of the day** with recipe, measurements, and history
- **Surprising historical fact** tied to the theme

Content is generated via GPT-4o through the Spark LLM service and cached by date to avoid redundant API calls. A complete fallback library covers all five themes with hand-curated content, ensuring the daily content tab is never empty even if AI generation fails. The fallback content is itself substantive — full stories, real recipes, verified historical facts — not placeholder text.

### Venue Discovery and Filtering

The venue discovery system supports multi-faceted filtering:

- **Deal type**: Beer, wine, cocktails, food, or all
- **Price level**: Three tiers ($, $$, $$$)
- **Drinking theme**: Filter by one or more cultural themes
- **Active now**: Real-time indicator based on current day and time against deal schedules
- **Search query**: Free-text search across venue names, neighborhoods, and tags
- **Event availability**: Filter to venues with upcoming themed events

Venue cards use a glassmorphic design with backdrop blur, multi-layer shadows, and mouse-tracking 3D tilt effects (via Framer Motion). Distance-based sorting and a quick-stats dashboard provide at-a-glance information density.

### Social Threads and Real-Time Chat

The social system supports two thread types:

- **Live threads**: Same-day coordination for meetups, urgent RSVPs, real-time planning
- **Offline threads**: Ongoing discussions about recipes, venue recommendations, cultural deep dives

Each thread supports a full chat experience:

- Message composition with @mentions (highlighted inline, increased response rates)
- Eight emoji reactions per message (with user tracking and counts)
- Message editing and deletion (own messages only)
- Reply threading for nested conversations
- Role badges (the-pourer, the-drinker, the-venue) displayed next to usernames
- Participant and message counts on thread cards
- Theme-specific visual treatments on thread cards and chat UI

### Calendar and Event System

An integrated month-view calendar displays all happy hours, themed events, live music nights, tastings, and specials:

- Month navigation with event-indicator dots on active dates
- Day detail view listing all events for the selected date
- RSVP system with capacity tracking and attendee counts
- Theme-colored event markers matching the drinking-culture theme
- Venue integration linking events back to full venue profiles
- Event types: happy-hour, themed-event, live-music, tasting, special

### Achievement and Gamification System

The achievement system defines 18 distinct badges across five categories, each with a rarity tier:

| Category | Achievements | Examples |
|----------|-------------|----------|
| **Explorer** | 3 | First Pour (1 visit), Regular (10 venues), Neighborhood Explorer (25 venues) |
| **Connoisseur** | 7 | City Connoisseur (50 venues), per-theme exploration badges (5 themed venues each), Theme Master (all themes) |
| **Social** | 4 | Event Enthusiast (5 events), Party Animal (20 events), Voice of the People (10 reviews), Social Butterfly (25 threads) |
| **Supporter** | 2 | Bartender Supporter (5 follows), Super Fan (15 follows) |
| **Special** | 2 | Living Legend (100 venues), Certified Critic (50 reviews) |

Rarity tiers — **Common**, **Rare**, **Epic**, **Legendary** — carry distinct visual treatments. Achievement progress is tracked continuously and evaluated against the user's profile state (visit history, follows, review count, theme exploration). Unlocked achievements are timestamped and displayed in the user profile modal with progress bars for in-progress badges.

### AI-Generated Drinking Games

Users can generate custom drinking games by selecting:

- **Theme**: Any of the five drinking cultures (or general)
- **Player count**: 2-12 players
- **Difficulty**: Easy, medium, or hard

The AI generates a complete game with a name, description, 5-8 rules, required materials, estimated duration, and 2-3 variations. All generated games emphasize responsible drinking and include non-alcoholic alternatives. A fallback library provides one curated game per theme plus a default game, each with full rules and variations:

- *The Hemingway Challenge* (Famous Drunks) — share bold life philosophies, group votes
- *Plot Twist* (Literary) — collaborative storytelling with literary references
- *Caesar's Decree* (Ancient Rome) — rotating rule-maker with silly mandates
- *Speakeasy Secrets* (Prohibition) — character-based deduction game
- *Archetype Assignment* (Archetypal) — stay in character or drink
- *Social Sips* (Default) — classic icebreaker format

### Bartender Profiles and Job Marketplace

**For bartenders (the-pourer):**
- Detailed profiles with bio, specialties, signature drinks, years of experience
- Follower counts, ratings, and verified badges
- Thematic style associations linking bartenders to drinking cultures
- Weekly schedule management with shift assignments
- Job board browsing with application tracking (resume, cover letter, availability)

**For venues (the-venue):**
- Job posting creation with title, description, requirements, pay range, benefits
- Application management with status tracking (open, reviewing, filled)
- Staff scheduling with recurring shift support
- Capacity and staffing metrics

The job marketplace connects the supply side (bartenders seeking work or additional shifts) with the demand side (venues needing qualified staff), using the platform's existing profile and verification infrastructure.

---

## Design System

### Glassmorphism Aesthetic

The visual language is built on modern glassmorphism: semi-transparent card backgrounds with backdrop blur, layered shadows for depth, and stacked pseudo-elements creating progressive depth effects. The approach evokes the atmosphere of a well-lit cocktail bar — warm, layered, and slightly luminous.

### Animation Philosophy

Animations serve three purposes: feedback (spring physics on button presses, 0.95x tap scale), discovery (staggered entrance animations with 50ms delays for list items), and atmosphere (floating decorative icons drifting across the background on 6-second loops, parallax gradient drift on 30-second cycles). Mouse-tracking 3D tilt on venue cards provides a tactile quality. All animations use spring physics via Framer Motion for natural deceleration curves rather than linear or ease-in-out timing.

### Responsive Strategy

The design is mobile-first with a single-column card layout below 768px, touch targets at minimum 44px, reduced animation complexity on mobile for performance, and a sticky glassmorphic header with scroll-responsive styling. The filter panel adapts to a full-screen sheet on narrow viewports.

### Typography

- **Display**: Cal Sans (headings, venue names) — warm, slightly playful
- **Body**: Inter (UI elements, body text) — clean, highly legible
- Hierarchy: H1 at 32px, H2 at 24px, H3 at 20px, body at 16px, small at 14px, caption at 12px

---

## Data Model

The TypeScript type system defines 25+ interfaces covering the full domain:

```
UserRole = 'the-pourer' | 'the-drinker' | 'the-venue' | null
DrinkingTheme = 'famous-drunks' | 'literary' | 'archetypal' | 'prohibition' | 'ancient-rome'

Venue ──────── Deal[], MenuItem[], ThemedEvent[], Bartender[], Review[]
UserProfile ── Achievement[], VenueVisit[], preferences, following
SocialThread ── ThreadMessage[] (with reactions, mentions, role badges)
CalendarEvent ─ venue linkage, RSVP tracking, capacity, theme
DailyContent ── quote, story, cocktailOfTheDay, historicalFact (per theme)
DrinkingGame ── rules[], materials[], variations[], difficulty, playerCount
JobPosting ──── requirements[], benefits[], applicants, status
BartenderSchedule ── recurring shifts, availability status
AchievementType ── requirement (type + target + optional theme), rarity tier
```

All entities carry string IDs, ISO 8601 timestamps, and optional theme associations. The `FilterState` interface governs the venue discovery query model with support for compound filters across deal type, price, theme, time, and search text.

---

## User Flows

### The Drinker

1. **Onboard** — Select "the-drinker" role; set drink preferences and dietary restrictions
2. **Discover** — Browse venues with theme filters, price levels, and "active now" indicators
3. **Dive in** — Open venue detail for menus, reviews, bartender profiles, and upcoming events
4. **Socialize** — Join live threads for same-day meetup coordination; participate in offline discussions
5. **Plan** — RSVP to themed events via the calendar; receive capacity updates
6. **Explore** — Read daily AI-generated cultural content; generate drinking games for group outings
7. **Progress** — Track visit history, unlock achievements, earn theme-exploration badges
8. **Follow** — Build a network of favorite bartenders and venues for personalized feeds

### The Pourer

1. **Onboard** — Select "the-pourer" role; build professional profile with specialties and signature drinks
2. **Showcase** — Manage venue profile, menus, and hours; create themed events
3. **Engage** — Host social threads; build follower base; respond to customer messages
4. **Work** — Browse job postings; submit applications with resume and availability
5. **Schedule** — View weekly shift assignments; manage availability status
6. **Grow** — Track follower counts, ratings, and engagement metrics

### The Venue

1. **Onboard** — Select "the-venue" role; configure venue details, capacity, and operating hours
2. **Hire** — Post job openings with requirements, pay ranges, and benefits
3. **Manage** — Review applications, track candidates, update posting status
4. **Schedule** — Assign bartender shifts, manage recurring schedules
5. **Promote** — Create themed events, update specials, maintain venue profile

---

## Cross-Organ Context

This repository is part of **ORGAN-III (Ergon)** — the commerce organ within the [eight-organ creative-institutional system](https://github.com/meta-organvm). ORGAN-III houses all revenue-generating products, SaaS tools, and consumer-facing applications.

| Organ | Name | Relationship |
|-------|------|-------------|
| **I (Theoria)** | Theory | Epistemological frameworks that inform the thematic layer's cultural ontology |
| **II (Poiesis)** | Art | Generative aesthetics that influence the glassmorphic design system and ambient animations |
| **III (Ergon)** | Commerce | **This repository** — B2C product with marketplace dynamics |
| **IV (Taxis)** | Orchestration | Governance and dependency routing across the organ system |
| **V (Logos)** | Public Process | Building-in-public essays that may reference this product's development |
| **VI (Koinonia)** | Community | Community salon model that parallels the social thread system |
| **VII (Kerygma)** | Marketing | Distribution channel for product announcements and launch content |
| **VIII (Meta)** | Meta | Umbrella org coordinating cross-organ standards and promotion pipelines |

The dependency flow is strictly **I -> II -> III** with no back-edges. ORGAN-III products may draw on theoretical frameworks (I) and aesthetic systems (II) but never introduce upstream dependencies.

---

## Roadmap

Near-term development priorities:

- **Photo uploads** — User-generated venue and drink photography
- **Push notifications** — Alerts for followed bartender shifts, venue specials, RSVP reminders
- **Cross-device sync** — Backend persistence layer replacing browser-only KV store
- **Search expansion** — Full-text search across threads, events, and bartender profiles
- **Recommendation engine** — AI-powered suggestions based on visit history, ratings, time of day, and trending venues
- **Bartender certification tiers** — Verified skill levels and specialization badges
- **Promoted listings** — Monetization vector for venues seeking premium placement
- **Real-time presence** — Show which bartenders are currently working at which venues
- **Accessibility audit** — Full WCAG AAA compliance pass

---

## Related Work

Other repositories within ORGAN-III (Ergon):

- [`organvm-iii-ergon/public-record-data-scrapper`](https://github.com/organvm-iii-ergon/public-record-data-scrapper) — Public record data extraction tool (flagship, Bronze Sprint deployed)
- [`organvm-iii-ergon/tab-bookmark-manager`](https://github.com/organvm-iii-ergon/tab-bookmark-manager) — Browser productivity tool for tab and bookmark management
- [`organvm-iii-ergon/a-i-chat--exporter`](https://github.com/organvm-iii-ergon/a-i-chat--exporter) — AI conversation export utility

---

## Contributing

This project follows the ORGAN-III contribution standards. To contribute:

1. Fork the repository and create a feature branch from `main`
2. Follow the existing TypeScript strict-mode conventions and component patterns
3. Ensure all new components include proper TypeScript interfaces
4. Maintain WCAG AA contrast ratios when adding or modifying theme colors
5. Test AI-powered features against both the live LLM path and the fallback content path
6. Submit a pull request with a clear description of the change and its motivation

For questions about the broader organ system architecture, see the [meta-organvm](https://github.com/meta-organvm) umbrella organization.

---

## License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for the full text.

The Spark Template files and resources are licensed under the MIT license, Copyright GitHub, Inc.

---

## Author

**[@4444j99](https://github.com/4444J99)** — Builder and maintainer of the eight-organ creative-institutional system.

Hello Happier Hour is a product of ORGAN-III (Ergon), where culture meets commerce. The conviction behind this project is that local venue discovery deserves the same care for narrative, history, and community that we bring to any other cultural artifact — and that the best way to find your next happy hour is to understand why humans have been gathering to drink together for three thousand years.
