import { DailyContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkle, BookOpen, Wine, Question, ArrowRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { THEME_COLOR_SCHEMES, THEME_DESCRIPTIONS, THEME_ICONS } from '@/lib/theme-config';

interface DailyContentDisplayProps {
  content: DailyContent;
  onExploreVenues?: () => void;
}

export function DailyContentDisplay({ content, onExploreVenues }: DailyContentDisplayProps) {
  const themeColors = THEME_COLOR_SCHEMES[content.theme];
  const themeIcon = THEME_ICONS[content.theme];
  const themeDesc = THEME_DESCRIPTIONS[content.theme];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div
        className="glass-card p-8 rounded-3xl relative overflow-hidden"
        style={{
          borderColor: themeColors.borderColor,
          background: `linear-gradient(135deg, ${themeColors.cardBg}, ${themeColors.background}80)`,
        }}
      >
        <motion.div
          className="absolute top-0 right-0 text-[200px] opacity-5"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {themeIcon}
        </motion.div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkle weight="fill" className="w-8 h-8" style={{ color: themeColors.accent }} />
            <div>
              <h2 className="text-3xl font-bold" style={{ color: themeColors.textPrimary }}>
                Today's {themeIcon} Feature
              </h2>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                {themeDesc}
              </p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-6 rounded-2xl"
            style={{
              backgroundColor: `${themeColors.primary}20`,
              borderLeft: `4px solid ${themeColors.accent}`,
            }}
          >
            <p className="text-2xl font-serif italic mb-2" style={{ color: themeColors.textPrimary }}>
              "{content.quote}"
            </p>
            <p className="text-sm font-semibold" style={{ color: themeColors.secondary }}>
              — {content.quoteAuthor}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen weight="fill" className="w-5 h-5" style={{ color: themeColors.secondary }} />
              <h3 className="text-xl font-bold" style={{ color: themeColors.textPrimary }}>Today's Story</h3>
            </div>
            <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: themeColors.textSecondary }}>
              {content.story}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div
              className="p-6 rounded-2xl"
              style={{ backgroundColor: `${themeColors.secondary}20` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Wine weight="fill" className="w-5 h-5" style={{ color: themeColors.accent }} />
                <h3 className="text-lg font-bold" style={{ color: themeColors.textPrimary }}>
                  Cocktail of the Day
                </h3>
              </div>
              <h4 className="text-xl font-bold mb-2" style={{ color: themeColors.secondary }}>
                {content.cocktailOfTheDay.name}
              </h4>
              <p className="text-sm mb-3" style={{ color: themeColors.textSecondary }}>
                {content.cocktailOfTheDay.recipe}
              </p>
              <p className="text-xs italic" style={{ color: themeColors.textSecondary }}>
                {content.cocktailOfTheDay.history}
              </p>
            </div>
            
            <div
              className="p-6 rounded-2xl"
              style={{ backgroundColor: `${themeColors.accent}20` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Question weight="fill" className="w-5 h-5" style={{ color: themeColors.primary }} />
                <h3 className="text-lg font-bold" style={{ color: themeColors.textPrimary }}>
                  Did You Know?
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: themeColors.textSecondary }}>
                {content.historicalFact}
              </p>
            </div>
          </motion.div>
          
          {onExploreVenues && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Button
                size="lg"
                onClick={onExploreVenues}
                className="w-full group"
                style={{
                  background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.accent})`,
                  color: themeColors.textPrimary,
                }}
              >
                <span>Explore {themeIcon} Themed Venues</span>
                <ArrowRight weight="bold" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="text-center text-xs text-muted-foreground">
        <p>New content generated daily • Last updated: {new Date(content.generatedAt).toLocaleTimeString()}</p>
      </div>
    </motion.div>
  );
}
