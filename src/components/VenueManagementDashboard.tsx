import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChartBar,
  Users,
  CalendarBlank,
  Briefcase,
  Star,
  TrendUp,
  Sparkle,
  BeerBottle,
  Clock,
  CheckCircle,
  Eye,
  ChatCircleDots
} from '@phosphor-icons/react';
import { Venue, JobApplication, Review, ThemedEvent } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface VenueManagementDashboardProps {
  venue: Venue;
  applications?: JobApplication[];
  reviews?: Review[];
  events?: ThemedEvent[];
  onCreateDeal?: () => void;
  onCreateEvent?: () => void;
  onViewApplications?: () => void;
}

export function VenueManagementDashboard({
  venue,
  applications = [],
  reviews = [],
  events = [],
  onCreateDeal,
  onCreateEvent,
  onViewApplications
}: VenueManagementDashboardProps) {
  // Calculate analytics
  const analytics = useMemo(() => {
    const venueReviews = reviews.filter(r => r.venueId === venue.id);
    const pendingApplications = applications.filter(a => a.venueName === venue.name && a.status === 'pending');
    const activeApplications = applications.filter(a =>
      a.venueName === venue.name &&
      ['pending', 'reviewed', 'interviewing'].includes(a.status)
    );
    const upcomingEvents = events.filter(e =>
      new Date(e.date) > new Date() &&
      e.title.toLowerCase().includes(venue.name.toLowerCase())
    );
    const totalRSVPs = upcomingEvents.reduce((sum, e) => sum + (e.rsvpCount || 0), 0);

    // Calculate average rating from reviews
    const avgRating = venueReviews.length > 0
      ? venueReviews.reduce((sum, r) => sum + r.rating, 0) / venueReviews.length
      : venue.rating;

    return {
      totalReviews: venueReviews.length,
      averageRating: avgRating.toFixed(1),
      pendingApplications: pendingApplications.length,
      activeApplications: activeApplications.length,
      upcomingEvents: upcomingEvents.length,
      totalRSVPs,
      followerCount: venue.followerCount || 0,
      activeDeals: venue.deals?.length || 0
    };
  }, [venue, applications, reviews, events]);

  const recentActivity = useMemo(() => {
    const activities: Array<{
      id: string;
      type: 'review' | 'application' | 'rsvp';
      content: string;
      timestamp: string;
      icon: React.ReactNode;
    }> = [];

    // Add recent reviews
    reviews
      .filter(r => r.venueId === venue.id)
      .slice(0, 3)
      .forEach(review => {
        activities.push({
          id: review.id,
          type: 'review',
          content: `${review.userName} left a ${review.rating}⭐ review`,
          timestamp: review.date,
          icon: <Star weight="fill" className="text-accent" />
        });
      });

    // Add recent applications
    applications
      .filter(a => a.venueName === venue.name)
      .slice(0, 3)
      .forEach(app => {
        activities.push({
          id: app.id,
          type: 'application',
          content: `${app.applicantName} applied for ${app.jobTitle}`,
          timestamp: app.appliedAt,
          icon: <Briefcase weight="fill" className="text-primary" />
        });
      });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [venue, applications, reviews]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <ChartBar weight="fill" className="text-accent" />
              Venue Dashboard
            </h2>
            <p className="text-muted-foreground">{venue.name}</p>
          </div>
          <Badge className="bg-gradient-to-r from-primary to-accent">
            {venue.neighborhood}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Card className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-accent/10">
                <Star weight="fill" className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics.averageRating}</div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {analytics.totalReviews} reviews
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Card className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Users weight="fill" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics.followerCount}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
            </div>
            <div className="text-xs text-accent flex items-center gap-1">
              <TrendUp weight="bold" className="w-3 h-3" />
              Growing
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Card className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-secondary/10">
                <CalendarBlank weight="fill" className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics.upcomingEvents}</div>
                <div className="text-xs text-muted-foreground">Events</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {analytics.totalRSVPs} total RSVPs
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Card className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-accent/10">
                <Briefcase weight="fill" className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{analytics.activeApplications}</div>
                <div className="text-xs text-muted-foreground">Applications</div>
              </div>
            </div>
            {analytics.pendingApplications > 0 && (
              <div className="text-xs text-accent font-semibold">
                {analytics.pendingApplications} pending
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="glass-card p-6 rounded-3xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkle weight="fill" className="text-accent" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            {onCreateDeal && (
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onCreateDeal}
                  className="w-full glass-morphic border border-accent/30 hover:border-accent hover:bg-accent/10 justify-start font-semibold"
                  variant="outline"
                >
                  <BeerBottle weight="fill" className="w-5 h-5 mr-3 text-accent" />
                  Create Happy Hour Special
                </Button>
              </motion.div>
            )}

            {onCreateEvent && (
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onCreateEvent}
                  className="w-full glass-morphic border border-primary/30 hover:border-primary hover:bg-primary/10 justify-start font-semibold"
                  variant="outline"
                >
                  <CalendarBlank weight="fill" className="w-5 h-5 mr-3 text-primary" />
                  Create Event
                </Button>
              </motion.div>
            )}

            {onViewApplications && (
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onViewApplications}
                  className="w-full glass-morphic border border-secondary/30 hover:border-secondary hover:bg-secondary/10 justify-start font-semibold"
                  variant="outline"
                >
                  <Briefcase weight="fill" className="w-5 h-5 mr-3 text-secondary" />
                  View Job Applications
                  {analytics.pendingApplications > 0 && (
                    <Badge className="ml-auto bg-accent">{analytics.pendingApplications}</Badge>
                  )}
                </Button>
              </motion.div>
            )}
          </div>

          <Separator className="my-4 bg-border/30" />

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-muted-foreground mb-3">ACTIVE SPECIALS</h4>
            {venue.deals && venue.deals.length > 0 ? (
              venue.deals.slice(0, 3).map((deal) => (
                <motion.div
                  key={deal.id}
                  whileHover={{ x: 5 }}
                  className="glass-morphic p-3 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{deal.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <Clock weight="fill" className="w-3 h-3" />
                        {deal.timeRange.start} - {deal.timeRange.end}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {deal.price}
                    </Badge>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active specials
              </p>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card p-6 rounded-3xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ChatCircleDots weight="fill" className="text-primary" />
            Recent Activity
          </h3>
          <ScrollArea className="h-[300px]">
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-morphic p-3 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted/30 shrink-0">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium mb-1">{activity.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Eye weight="fill" className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No recent activity to show
                </p>
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="glass-card p-6 rounded-3xl">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendUp weight="fill" className="text-accent" />
          Performance Insights
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-morphic p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle weight="fill" className="w-5 h-5 text-accent" />
              <span className="font-semibold text-sm">Response Rate</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {analytics.activeApplications > 0
                ? Math.round((analytics.activeApplications - analytics.pendingApplications) / analytics.activeApplications * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Application response rate
            </p>
          </div>

          <div className="glass-morphic p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CalendarBlank weight="fill" className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">Event Engagement</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {analytics.upcomingEvents > 0
                ? Math.round(analytics.totalRSVPs / analytics.upcomingEvents)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg RSVPs per event
            </p>
          </div>

          <div className="glass-morphic p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Star weight="fill" className="w-5 h-5 text-accent" />
              <span className="font-semibold text-sm">Review Score</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {analytics.averageRating}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {analytics.totalReviews} reviews
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
