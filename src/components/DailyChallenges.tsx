import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { VenueCard } from '@/components/VenueCard';
import {
  Trophy,
  Target,
  Fire,
  CheckCircle,
  Clock,
  Sparkle,
  Lightbulb,
  TrendUp
} from '@phosphor-icons/react';
import { UserProfile, Venue, VenueVisit } from '@/lib/types';
import { generatePersonalizedChallenges, DailyChallenge, getChallengeRecommendations } from '@/lib/challenge-system';
import { toast } from 'sonner';

interface DailyChallengesProps {
  userProfile: UserProfile;
  visitHistory: VenueVisit[];
  allVenues: Venue[];
  onSelectVenue?: (venue: Venue) => void;
}

const DIFFICULTY_COLORS = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500'
};

const TYPE_COLORS = {
  visit: 'from-blue-500 to-cyan-500',
  social: 'from-purple-500 to-pink-500',
  discovery: 'from-green-500 to-emerald-500',
  theme: 'from-orange-500 to-red-500',
  special: 'from-violet-500 to-fuchsia-500'
};

export function DailyChallenges({
  userProfile,
  visitHistory,
  allVenues,
  onSelectVenue
}: DailyChallengesProps) {
  const [completedChallenges, setCompletedChallenges] = useKV<string[]>('completed-challenges', []);
  const [totalPoints, setTotalPoints] = useKV<number>('challenge-points', 0);

  const challenges = useMemo(() =>
    generatePersonalizedChallenges(userProfile, visitHistory, allVenues),
    [userProfile, visitHistory, allVenues]
  );

  const recommendations = useMemo(() =>
    getChallengeRecommendations(challenges, allVenues),
    [challenges, allVenues]
  );

  const activeChallenges = challenges.filter(c =>
    !completedChallenges?.includes(c.id) && new Date(c.expiresAt) > new Date()
  );

  const completedToday = challenges.filter(c =>
    completedChallenges?.includes(c.id)
  );

  const handleCompleteChallenge = (challenge: DailyChallenge) => {
    setCompletedChallenges((current) => [...(current || []), challenge.id]);
    setTotalPoints((current) => (current || 0) + challenge.points);
    toast.success('Challenge completed!', {
      description: `+${challenge.points} points ${challenge.rewards.badge || ''}`
    });
  };

  const totalAvailablePoints = activeChallenges.reduce((sum, c) => sum + c.points, 0);
  const earnedToday = completedToday.reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-3xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Trophy weight="fill" className="w-8 h-8 text-accent" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Daily Challenges
            </h2>
            <p className="text-muted-foreground text-lg">
              Personalized tasks to enhance your experience
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-morphic p-4 rounded-2xl text-center"
          >
            <div className="text-3xl font-bold text-accent mb-1">{totalPoints || 0}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-morphic p-4 rounded-2xl text-center"
          >
            <div className="text-3xl font-bold text-primary mb-1">{earnedToday}</div>
            <div className="text-sm text-muted-foreground">Earned Today</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-morphic p-4 rounded-2xl text-center"
          >
            <div className="text-3xl font-bold text-secondary mb-1">{activeChallenges.length}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-morphic p-4 rounded-2xl text-center"
          >
            <div className="text-3xl font-bold text-accent mb-1">{completedToday.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </motion.div>
        </div>

        {totalAvailablePoints > 0 && (
          <div className="mt-6 glass-morphic p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Daily Progress</span>
              <span className="text-sm text-muted-foreground">
                {earnedToday} / {totalAvailablePoints + earnedToday} pts
              </span>
            </div>
            <Progress
              value={(earnedToday / (totalAvailablePoints + earnedToday)) * 100}
              className="h-3"
            />
          </div>
        )}
      </motion.div>

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Target weight="fill" className="text-accent" />
            Active Challenges
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Card className={`glass-card border-2 rounded-2xl overflow-hidden ${
                  challenge.progress >= 100 ? 'border-accent' : 'border-border/30'
                }`}>
                  <div className={`h-2 bg-gradient-to-r ${TYPE_COLORS[challenge.type]}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{challenge.icon}</div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{challenge.title}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                        </div>
                      </div>
                      <Badge className={`${DIFFICULTY_COLORS[challenge.difficulty]} text-white`}>
                        {challenge.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{Math.round(challenge.progress)}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />

                      {challenge.hint && (
                        <div className="flex items-start gap-2 glass-morphic p-3 rounded-xl">
                          <Lightbulb weight="fill" className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span className="text-xs text-muted-foreground">{challenge.hint}</span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4 bg-border/30" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Trophy weight="fill" className="w-4 h-4 text-accent" />
                          <span className="font-bold text-accent">{challenge.points} pts</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock weight="fill" className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(challenge.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {challenge.progress >= 100 && (
                        <Button
                          onClick={() => handleCompleteChallenge(challenge)}
                          size="sm"
                          className="bg-gradient-to-r from-accent to-secondary"
                        >
                          <CheckCircle weight="fill" className="mr-2" />
                          Claim
                        </Button>
                      )}
                    </div>

                    {/* Venue Recommendations for Challenge */}
                    {recommendations[challenge.id] && recommendations[challenge.id].length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border/30">
                        <h5 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Sparkle weight="fill" className="w-4 h-4 text-accent" />
                          Recommended Venues
                        </h5>
                        <div className="grid grid-cols-3 gap-2">
                          {recommendations[challenge.id].map(venue => (
                            <motion.div
                              key={venue.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="glass-morphic p-2 rounded-xl cursor-pointer text-center"
                              onClick={() => onSelectVenue?.(venue)}
                            >
                              <div className="text-xs font-semibold mb-1 line-clamp-1">{venue.name}</div>
                              <div className="text-xs text-muted-foreground">{venue.neighborhood}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Completed Challenges */}
      {completedToday.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
            <CheckCircle weight="fill" className="text-accent" />
            Completed Today
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {completedToday.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass-morphic p-4 rounded-2xl text-center opacity-60"
              >
                <div className="text-3xl mb-2">{challenge.icon}</div>
                <div className="font-semibold text-sm mb-1">{challenge.title}</div>
                <div className="flex items-center justify-center gap-1 text-xs text-accent">
                  <Trophy weight="fill" className="w-3 h-3" />
                  <span>+{challenge.points} pts</span>
                </div>
                {challenge.rewards.badge && (
                  <div className="mt-2 text-xl">{challenge.rewards.badge}</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {activeChallenges.length === 0 && completedToday.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Fire className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground">
            Check back tomorrow for new challenges
          </p>
        </motion.div>
      )}

      {/* Level Progress (Bonus) */}
      {totalPoints && totalPoints > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-3xl"
        >
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <TrendUp weight="fill" className="text-accent" />
            Your Level
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-accent">
              {Math.floor((totalPoints || 0) / 100) + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Level Progress</span>
                <span className="font-semibold">
                  {(totalPoints || 0) % 100} / 100 pts
                </span>
              </div>
              <Progress value={((totalPoints || 0) % 100)} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {100 - ((totalPoints || 0) % 100)} points until next level
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
