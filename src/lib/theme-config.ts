import { DrinkingTheme, ThemeColorScheme } from './types';

export const THEME_COLOR_SCHEMES: Record<DrinkingTheme, ThemeColorScheme> = {
  'famous-drunks': {
    primary: 'oklch(0.55 0.22 15)',
    secondary: 'oklch(0.68 0.18 35)',
    accent: 'oklch(0.75 0.20 50)',
    background: 'oklch(0.15 0.05 20)',
    cardBg: 'oklch(0.20 0.08 25 / 0.75)',
    textPrimary: 'oklch(0.95 0.02 50)',
    textSecondary: 'oklch(0.75 0.08 40)',
    borderColor: 'oklch(0.85 0.05 40 / 0.3)',
    glowColor: 'oklch(0.68 0.18 35 / 0.4)',
  },
  'literary': {
    primary: 'oklch(0.35 0.12 240)',
    secondary: 'oklch(0.58 0.15 200)',
    accent: 'oklch(0.75 0.18 180)',
    background: 'oklch(0.12 0.05 260)',
    cardBg: 'oklch(0.18 0.08 250 / 0.75)',
    textPrimary: 'oklch(0.95 0.02 240)',
    textSecondary: 'oklch(0.70 0.08 230)',
    borderColor: 'oklch(0.80 0.10 220 / 0.3)',
    glowColor: 'oklch(0.58 0.15 200 / 0.4)',
  },
  'archetypal': {
    primary: 'oklch(0.45 0.20 310)',
    secondary: 'oklch(0.65 0.22 340)',
    accent: 'oklch(0.78 0.18 20)',
    background: 'oklch(0.10 0.05 300)',
    cardBg: 'oklch(0.15 0.10 320 / 0.75)',
    textPrimary: 'oklch(0.98 0.02 330)',
    textSecondary: 'oklch(0.75 0.10 320)',
    borderColor: 'oklch(0.85 0.12 340 / 0.3)',
    glowColor: 'oklch(0.65 0.22 340 / 0.4)',
  },
  'prohibition': {
    primary: 'oklch(0.25 0.05 80)',
    secondary: 'oklch(0.68 0.12 65)',
    accent: 'oklch(0.82 0.15 85)',
    background: 'oklch(0.08 0.02 70)',
    cardBg: 'oklch(0.12 0.03 75 / 0.75)',
    textPrimary: 'oklch(0.92 0.03 80)',
    textSecondary: 'oklch(0.68 0.05 70)',
    borderColor: 'oklch(0.75 0.08 75 / 0.3)',
    glowColor: 'oklch(0.68 0.12 65 / 0.4)',
  },
  'ancient-rome': {
    primary: 'oklch(0.52 0.18 45)',
    secondary: 'oklch(0.70 0.16 55)',
    accent: 'oklch(0.80 0.20 75)',
    background: 'oklch(0.18 0.06 40)',
    cardBg: 'oklch(0.22 0.08 50 / 0.75)',
    textPrimary: 'oklch(0.95 0.03 60)',
    textSecondary: 'oklch(0.72 0.10 50)',
    borderColor: 'oklch(0.85 0.12 55 / 0.3)',
    glowColor: 'oklch(0.70 0.16 55 / 0.4)',
  },
};

export const THEME_DESCRIPTIONS: Record<DrinkingTheme, string> = {
  'famous-drunks': 'Walk in the footsteps of legendary imbibers—Hemingway, Churchill, and Sinatra',
  'literary': 'Sip with the great writers—from Fitzgerald\'s jazz age to Bukowski\'s dive bars',
  'archetypal': 'Explore timeless drinking personas—The Sage, The Trickster, The Rebel',
  'prohibition': 'Experience the speakeasy era—hidden doors, bathtub gin, and rebellious spirits',
  'ancient-rome': 'Toast like Caesar—ancient wine traditions, symposiums, and Bacchanalian feasts',
};

export const THEME_ICONS = {
  'famous-drunks': '🥃',
  'literary': '📚',
  'archetypal': '🎭',
  'prohibition': '🚪',
  'ancient-rome': '🏛️',
};

export function getThemeStyles(theme: DrinkingTheme | null): string {
  if (!theme) return '';
  
  const colors = THEME_COLOR_SCHEMES[theme];
  
  return `
    --theme-primary: ${colors.primary};
    --theme-secondary: ${colors.secondary};
    --theme-accent: ${colors.accent};
    --theme-background: ${colors.background};
    --theme-card-bg: ${colors.cardBg};
    --theme-text-primary: ${colors.textPrimary};
    --theme-text-secondary: ${colors.textSecondary};
    --theme-border: ${colors.borderColor};
    --theme-glow: ${colors.glowColor};
  `;
}
