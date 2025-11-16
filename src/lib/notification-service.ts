import { Notification } from './types';

export function createReviewNotification(
  userName: string,
  venueName: string,
  rating: number
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  return {
    type: 'review',
    title: 'New Review',
    description: `${userName} left a ${rating}⭐ review for ${venueName}`,
    icon: '⭐',
    metadata: {}
  };
}

export function createApplicationNotification(
  applicantName: string,
  jobTitle: string,
  status?: 'pending' | 'reviewed' | 'interviewing' | 'accepted' | 'rejected'
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  const statusMessages = {
    pending: `${applicantName} applied for ${jobTitle}`,
    reviewed: `Your application for ${jobTitle} has been reviewed`,
    interviewing: `You have an interview for ${jobTitle}!`,
    accepted: `Congratulations! You've been accepted for ${jobTitle}`,
    rejected: `Your application for ${jobTitle} was not accepted`
  };

  return {
    type: 'application',
    title: status === 'pending' ? 'New Application' : 'Application Update',
    description: statusMessages[status || 'pending'],
    icon: '💼',
    metadata: {}
  };
}

export function createMessageNotification(
  senderName: string,
  preview: string
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  return {
    type: 'message',
    title: 'New Message',
    description: `${senderName}: ${preview.substring(0, 50)}${preview.length > 50 ? '...' : ''}`,
    icon: '💬',
    metadata: {}
  };
}

export function createRSVPNotification(
  userName: string,
  eventTitle: string
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  return {
    type: 'rsvp',
    title: 'New RSVP',
    description: `${userName} RSVP'd to ${eventTitle}`,
    icon: '📅',
    metadata: {}
  };
}

export function createAchievementNotification(
  achievementTitle: string,
  achievementDescription: string,
  achievementIcon: string
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  return {
    type: 'achievement',
    title: 'Achievement Unlocked!',
    description: `${achievementIcon} ${achievementTitle}: ${achievementDescription}`,
    icon: achievementIcon,
    metadata: {}
  };
}

export function createFollowNotification(
  userName: string,
  userType: 'bartender' | 'venue' | 'user'
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  const typeLabels = {
    bartender: 'bartender',
    venue: 'venue',
    user: 'user'
  };

  return {
    type: 'follow',
    title: 'New Follower',
    description: `${userName} started following you`,
    icon: '👥',
    metadata: {}
  };
}

export function createEventNotification(
  eventTitle: string,
  venueName: string,
  eventDate: string
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  const date = new Date(eventDate);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  return {
    type: 'event',
    title: 'Upcoming Event',
    description: `${eventTitle} at ${venueName} - ${dateStr}`,
    icon: '🎉',
    metadata: {}
  };
}

export function createJobPostingNotification(
  jobTitle: string,
  venueName: string
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  return {
    type: 'job',
    title: 'New Job Posting',
    description: `${venueName} is hiring: ${jobTitle}`,
    icon: '💼',
    metadata: {}
  };
}

export function addNotification(
  notifications: Notification[],
  notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
): Notification[] {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    read: false
  };

  return [newNotification, ...(notifications || [])];
}
