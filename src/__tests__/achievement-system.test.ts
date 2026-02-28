import { describe, it, expect } from 'vitest';
import {
  ACHIEVEMENT_DEFINITIONS,
  checkAchievements,
  getAchievementProgress,
} from '../lib/achievement-system';
import type { UserProfile, Achievement } from '../lib/types';

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'test-user',
    name: 'Test User',
    role: 'the-drinker',
    favoriteBartenders: [],
    visitHistory: [],
    ...overrides,
  } as UserProfile;
}

describe('ACHIEVEMENT_DEFINITIONS', () => {
  it('has 18 achievements', () => {
    expect(ACHIEVEMENT_DEFINITIONS.length).toBe(18);
  });

  it('all have unique ids', () => {
    const ids = ACHIEVEMENT_DEFINITIONS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all have required fields', () => {
    for (const def of ACHIEVEMENT_DEFINITIONS) {
      expect(def.id).toBeTruthy();
      expect(def.title).toBeTruthy();
      expect(def.description).toBeTruthy();
      expect(def.icon).toBeTruthy();
      expect(def.category).toBeTruthy();
      expect(def.requirement).toBeTruthy();
      expect(def.requirement.target).toBeGreaterThan(0);
    }
  });
});

describe('checkAchievements', () => {
  it('returns empty for fresh profile', () => {
    const profile = makeProfile();
    const result = checkAchievements(profile, []);
    expect(result).toEqual([]);
  });

  it('unlocks first-visit with 1 visit', () => {
    const profile = makeProfile({
      visitHistory: [{ venueId: 'v1', visitedAt: '2026-01-01', rating: 5 }],
    });
    const result = checkAchievements(profile, []);
    const firstVisit = result.find(a => a.id === 'first-visit');
    expect(firstVisit).toBeDefined();
    expect(firstVisit!.title).toBe('First Pour');
  });

  it('unlocks bartender-supporter with 5 follows', () => {
    const profile = makeProfile({
      favoriteBartenders: ['b1', 'b2', 'b3', 'b4', 'b5'],
    });
    const result = checkAchievements(profile, []);
    const supporter = result.find(a => a.id === 'bartender-supporter');
    expect(supporter).toBeDefined();
  });

  it('does not unlock already-earned achievements', () => {
    const profile = makeProfile({
      visitHistory: [{ venueId: 'v1', visitedAt: '2026-01-01', rating: 5 }],
    });
    const existing: Achievement[] = [{
      id: 'first-visit',
      title: 'First Pour',
      description: 'test',
      icon: '🍺',
      category: 'explorer',
      unlockedAt: '2026-01-01',
    }];
    const result = checkAchievements(profile, existing);
    expect(result.find(a => a.id === 'first-visit')).toBeUndefined();
  });

  it('unlocks regular with 10 unique venues', () => {
    const visits = Array.from({ length: 10 }, (_, i) => ({
      venueId: `v${i}`,
      visitedAt: '2026-01-01',
      rating: 5,
    }));
    const profile = makeProfile({ visitHistory: visits });
    const result = checkAchievements(profile, []);
    expect(result.find(a => a.id === 'regular')).toBeDefined();
  });
});

describe('getAchievementProgress', () => {
  it('returns 0 progress for fresh profile', () => {
    const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === 'first-visit')!;
    const profile = makeProfile();
    const progress = getAchievementProgress(def, profile);
    expect(progress.current).toBe(0);
    expect(progress.target).toBe(1);
    expect(progress.percentage).toBe(0);
  });

  it('returns 100% when target met', () => {
    const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === 'first-visit')!;
    const profile = makeProfile({
      visitHistory: [{ venueId: 'v1', visitedAt: '2026-01-01', rating: 5 }],
    });
    const progress = getAchievementProgress(def, profile);
    expect(progress.current).toBe(1);
    expect(progress.percentage).toBe(100);
  });

  it('returns partial progress', () => {
    const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === 'regular')!;
    const visits = Array.from({ length: 5 }, (_, i) => ({
      venueId: `v${i}`,
      visitedAt: '2026-01-01',
      rating: 5,
    }));
    const profile = makeProfile({ visitHistory: visits });
    const progress = getAchievementProgress(def, profile);
    expect(progress.current).toBe(5);
    expect(progress.target).toBe(10);
    expect(progress.percentage).toBe(50);
  });

  it('caps percentage at 100', () => {
    const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === 'first-visit')!;
    const visits = Array.from({ length: 5 }, (_, i) => ({
      venueId: `v${i}`,
      visitedAt: '2026-01-01',
      rating: 5,
    }));
    const profile = makeProfile({ visitHistory: visits });
    const progress = getAchievementProgress(def, profile);
    expect(progress.percentage).toBe(100);
  });

  it('counts bartender follows', () => {
    const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === 'bartender-supporter')!;
    const profile = makeProfile({
      favoriteBartenders: ['b1', 'b2', 'b3'],
    });
    const progress = getAchievementProgress(def, profile);
    expect(progress.current).toBe(3);
    expect(progress.target).toBe(5);
    expect(progress.percentage).toBe(60);
  });
});
