# 🍸 Hello Happier Hour

**Social drink discovery & cultural exploration platform**

A vibrant social platform connecting bartenders ("the-pourer") and drink enthusiasts ("the-drinker") through curated happy hour experiences, enriched with five distinct drinking culture themes and daily AI-generated content.

## ✨ Key Features

### 🎨 Thematic Drinking Cultures
Explore five distinct drinking culture themes, each with unique color schemes and contextual content:
- **🥃 Famous Drunks**: Legendary imbibers like Hemingway, Churchill & Bukowski
- **📚 Literary**: Writers' haunts, literary cocktails, and book club culture  
- **🎭 Archetypal**: Universal drinking personas and timeless rituals
- **🚪 Prohibition**: Speakeasy era, 1920s culture, and bathtub gin
- **🏛️ Ancient Rome**: Roman wine traditions, symposiums & Bacchanalian feasts

### 🤖 Daily Generative Content
AI-powered daily content for each theme featuring:
- Inspirational quotes from historical figures
- 200-300 word historical/cultural stories
- Cocktail of the day with recipe and history
- Surprising historical facts

### 💬 Social Threads
- **Live Threads**: Real-time coordination for same-day meetups
- **Offline Threads**: Ongoing discussions about recipes, recommendations, culture
- Role badges showing bartenders vs. members
- Participant and message counts
- Theme-specific visual treatments

### 📅 Integrated Calendar
- Month view with event indicators
- Day detail view with all events
- RSVP system with capacity tracking
- Theme-colored event markers
- Venue integration

### 🍹 Venue Discovery
- Filter by deal type, price level, and drinking themes
- Real-time "active now" indicator
- Glassmorphic cards with 3D hover effects
- Distance-based sorting
- Quick stats dashboard

### 👨‍🍳 Bartender Profiles
- Detailed bios with specialties and signature drinks
- Years of experience and follower counts
- Thematic style associations
- Follow/unfollow functionality
- Verified badges

### 🎉 Themed Events
- Curated special events tied to drinking themes
- RSVP system
- Special menus
- Event cards with rich media

## 🎨 Design Philosophy

**Modern Glassmorphism with Thematic Depth**
- Advanced glassmorphic backgrounds with backdrop blur
- Theme-specific color schemes that transform the UI
- Smooth animations with spring physics
- 3D card interactions with mouse tracking
- Floating ambient decorations
- Stacked depth effects with progressive blur

**Responsive & Accessible**
- Mobile-first design
- WCAG AA contrast ratios across all themes
- Keyboard navigation support
- Semantic HTML structure

## 🛠️ Technical Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with custom theme system
- **UI Components**: shadcn/ui v4
- **Icons**: Phosphor Icons
- **Animations**: Framer Motion
- **State**: React hooks + useKV persistence
- **AI**: OpenAI GPT-4 for daily content generation
- **Build**: Vite

## 🚀 Getting Started

This is a Spark application. The development environment is pre-configured and ready to go.

### Key Files
- `/src/App.tsx` - Main application with tab navigation
- `/src/lib/types.ts` - TypeScript definitions for all data structures
- `/src/lib/theme-config.ts` - Theme color schemes and configurations
- `/src/lib/daily-content-service.ts` - AI content generation service
- `/src/lib/mock-data.ts` - Sample data for venues, bartenders, events, threads
- `/src/components/` - Reusable React components

### Storage
- User preferences, favorites, and RSVPs persist using `useKV` hook
- Daily content cached to minimize API calls
- Theme selections remembered between sessions

## 📱 User Flows

### The Drinker
1. Select "the-drinker" role
2. Browse venues with theme filters
3. Join social threads and plan meetups
4. RSVP to themed events via calendar
5. Read daily cultural content
6. Follow favorite bartenders
7. Save favorite venues

### The Pourer (Bartender)
1. Select "the-pourer" role
2. Manage venue profile and menu
3. Create themed events
4. Host social threads
5. View follower counts and engagement
6. Update hours and specials

## 🎯 Next Steps

- Add real-time chat within social threads with reactions and mentions
- Implement user profiles with achievement badges and visit history tracking
- Create bartender scheduling system showing which bartenders are working when
- Add photo upload for user-generated content
- Implement search filters for threads and events
- Create notification system for followed bartenders and venues

## 📄 License

The Spark Template files and resources are licensed under the MIT license, Copyright GitHub, Inc.

---

**Hello Happier Hour** - Where culture meets cocktails 🍸✨
