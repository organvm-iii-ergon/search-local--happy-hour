import { describe, it, expect } from 'vitest';
import { isTimeInRange, formatTime, formatTimeRange, getRelativeTime } from '../lib/time-utils';

describe('isTimeInRange', () => {
  it('returns true when time is within range', () => {
    expect(isTimeInRange('17:00', { start: '16:00', end: '20:00' })).toBe(true);
  });

  it('returns true at start boundary', () => {
    expect(isTimeInRange('16:00', { start: '16:00', end: '20:00' })).toBe(true);
  });

  it('returns true at end boundary', () => {
    expect(isTimeInRange('20:00', { start: '16:00', end: '20:00' })).toBe(true);
  });

  it('returns false outside range', () => {
    expect(isTimeInRange('15:00', { start: '16:00', end: '20:00' })).toBe(false);
    expect(isTimeInRange('21:00', { start: '16:00', end: '20:00' })).toBe(false);
  });

  it('handles overnight ranges (end < start)', () => {
    expect(isTimeInRange('23:00', { start: '22:00', end: '02:00' })).toBe(true);
    expect(isTimeInRange('01:00', { start: '22:00', end: '02:00' })).toBe(true);
    expect(isTimeInRange('15:00', { start: '22:00', end: '02:00' })).toBe(false);
  });
});

describe('formatTime', () => {
  it('formats morning time', () => {
    expect(formatTime('09:00')).toBe('9AM');
  });

  it('formats afternoon time', () => {
    expect(formatTime('14:30')).toBe('2:30PM');
  });

  it('formats noon', () => {
    expect(formatTime('12:00')).toBe('12PM');
  });

  it('formats midnight', () => {
    expect(formatTime('00:00')).toBe('12AM');
  });

  it('omits minutes when zero', () => {
    expect(formatTime('16:00')).toBe('4PM');
  });

  it('includes minutes when nonzero', () => {
    expect(formatTime('16:45')).toBe('4:45PM');
  });
});

describe('formatTimeRange', () => {
  it('formats a time range', () => {
    expect(formatTimeRange({ start: '16:00', end: '20:00' })).toBe('4PM - 8PM');
  });

  it('formats range with minutes', () => {
    expect(formatTimeRange({ start: '16:30', end: '19:45' })).toBe('4:30PM - 7:45PM');
  });
});

describe('getRelativeTime', () => {
  it('returns "Just updated" for recent times', () => {
    const now = new Date().toISOString();
    expect(getRelativeTime(now)).toBe('Just updated');
  });

  it('returns hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(getRelativeTime(twoHoursAgo)).toBe('Updated 2h ago');
  });

  it('returns yesterday', () => {
    const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    expect(getRelativeTime(yesterday)).toBe('Updated yesterday');
  });

  it('returns days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(getRelativeTime(threeDaysAgo)).toBe('Updated 3d ago');
  });
});
