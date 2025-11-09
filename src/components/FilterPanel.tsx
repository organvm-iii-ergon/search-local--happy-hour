import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  BeerBottle, 
  Wine, 
  Martini, 
  ForkKnife,
  CurrencyDollar,
  Clock,
  Sparkle,
  BookOpen,
  Crown,
  Scroll,
  MaskHappy,
  Columns
} from '@phosphor-icons/react';
import { DealType, PriceLevel, FilterState, DrinkingTheme } from '@/lib/types';
import { THEME_COLOR_SCHEMES, THEME_ICONS } from '@/lib/theme-config';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const dealTypeOptions: { type: DealType; label: string; icon: React.ReactNode }[] = [
    { type: 'beer', label: 'Beer', icon: <BeerBottle weight="fill" /> },
    { type: 'wine', label: 'Wine', icon: <Wine weight="fill" /> },
    { type: 'cocktails', label: 'Cocktails', icon: <Martini weight="fill" /> },
    { type: 'food', label: 'Food', icon: <ForkKnife weight="fill" /> },
  ];

  const themeOptions: { theme: DrinkingTheme; label: string; icon: React.ReactNode; description: string }[] = [
    { theme: 'famous-drunks', label: 'Famous Drunks', icon: <Crown weight="fill" />, description: 'Hemingway, Bukowski & legends' },
    { theme: 'literary', label: 'Literary', icon: <BookOpen weight="fill" />, description: 'Writers\' haunts & classics' },
    { theme: 'archetypal', label: 'Archetypal', icon: <MaskHappy weight="fill" />, description: 'Timeless drinking experiences' },
    { theme: 'prohibition', label: 'Prohibition', icon: <Scroll weight="fill" />, description: 'Speakeasy & 1920s era' },
    { theme: 'ancient-rome', label: 'Ancient Rome', icon: <Columns weight="fill" />, description: 'Roman wine & hospitality' },
  ];

  const priceLevelOptions: PriceLevel[] = [1, 2, 3];

  const toggleDealType = (type: DealType) => {
    const newTypes = filters.dealTypes.includes(type)
      ? filters.dealTypes.filter(t => t !== type)
      : [...filters.dealTypes, type];
    onFiltersChange({ ...filters, dealTypes: newTypes });
  };

  const togglePriceLevel = (level: PriceLevel) => {
    const newLevels = filters.priceLevel.includes(level)
      ? filters.priceLevel.filter(l => l !== level)
      : [...filters.priceLevel, level];
    onFiltersChange({ ...filters, priceLevel: newLevels });
  };

  const toggleTheme = (theme: DrinkingTheme) => {
    const currentThemes = filters.drinkingThemes || [];
    const newThemes = currentThemes.includes(theme)
      ? currentThemes.filter(t => t !== theme)
      : [...currentThemes, theme];
    onFiltersChange({ ...filters, drinkingThemes: newThemes });
  };

  const hasActiveFilters = 
    filters.dealTypes.length > 0 || 
    filters.priceLevel.length > 0 || 
    filters.activeNow ||
    (filters.drinkingThemes && filters.drinkingThemes.length > 0);

  const clearFilters = () => {
    onFiltersChange({
      dealTypes: [],
      priceLevel: [],
      activeNow: false,
      searchQuery: filters.searchQuery,
      drinkingThemes: []
    });
  };

  return (
    <motion.div 
      className="glass-card p-8 rounded-3xl space-y-6 stacked-element floating-element-delayed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle weight="fill" className="w-6 h-6 text-accent" />
          <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Filters
          </h3>
        </div>
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-xs font-bold hover:text-destructive transition-colors"
              >
                Clear All
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div 
          className="glass-morphic p-4 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="active-now" className="flex items-center gap-3 cursor-pointer font-semibold text-base">
              <Clock className="w-5 h-5 text-accent" weight="fill" />
              Active Now
            </Label>
            <motion.div
              whileTap={{ scale: 0.9 }}
            >
              <Switch
                id="active-now"
                checked={filters.activeNow}
                onCheckedChange={(checked) => 
                  onFiltersChange({ ...filters, activeNow: checked })
                }
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <Separator className="bg-border/30" />

      <div className="space-y-4">
        <Label className="text-base font-bold flex items-center gap-2">
          <Sparkle className="w-4 h-4 text-secondary" weight="fill" />
          Deal Type
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {dealTypeOptions.map((option, index) => {
            const isSelected = filters.dealTypes.includes(option.type);
            return (
              <motion.div
                key={option.type}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleDealType(option.type)}
                  className={`justify-start gap-2 w-full h-12 transition-all duration-300 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg' 
                      : 'glass-morphic border-border/50 hover:border-accent/50'
                  }`}
                >
                  <motion.div
                    animate={isSelected ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {option.icon}
                  </motion.div>
                  <span className="font-semibold">{option.label}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Separator className="bg-border/30" />

      <div className="space-y-4">
        <Label className="text-base font-bold flex items-center gap-2">
          <Sparkle className="w-5 h-5 text-accent" weight="fill" />
          Drinking Themes
        </Label>
        <p className="text-xs text-muted-foreground">
          Explore venues and events by drinking culture & history
        </p>
        <div className="space-y-2">
          {themeOptions.map((option, index) => {
            const isSelected = (filters.drinkingThemes || []).includes(option.theme);
            const themeColors = THEME_COLOR_SCHEMES[option.theme];
            const themeIcon = THEME_ICONS[option.theme];
            
            return (
              <motion.div
                key={option.theme}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTheme(option.theme)}
                  className={`justify-start gap-3 w-full h-auto py-3 px-4 transition-all duration-300 relative overflow-hidden ${
                    !isSelected && 'glass-morphic border-border/50 hover:border-accent/50'
                  }`}
                  style={isSelected ? {
                    background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                    color: themeColors.textPrimary,
                    borderColor: themeColors.borderColor,
                  } : undefined}
                >
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      style={{ background: themeColors.accent }}
                      animate={{
                        opacity: [0.1, 0.3, 0.1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                  <motion.div
                    animate={isSelected ? { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-2xl relative z-10"
                  >
                    {themeIcon}
                  </motion.div>
                  <div className="flex flex-col items-start relative z-10">
                    <span className="font-semibold text-sm">{option.label}</span>
                    <span className="text-xs opacity-80 font-normal">{option.description}</span>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Separator className="bg-border/30" />

      <div className="space-y-4">
        <Label className="text-base font-bold flex items-center gap-2">
          <CurrencyDollar className="w-5 h-5 text-accent" weight="fill" />
          Price Level
        </Label>
        <div className="flex gap-3">
          {priceLevelOptions.map((level, index) => {
            const isSelected = filters.priceLevel.includes(level);
            return (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="flex-1"
              >
                <Badge
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer px-6 py-3 text-base font-bold w-full justify-center transition-all duration-300 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-secondary to-accent text-accent-foreground shadow-lg pulse-glow' 
                      : 'glass-morphic border-border/50 hover:border-secondary/50'
                  }`}
                  onClick={() => togglePriceLevel(level)}
                >
                  {'$'.repeat(level)}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4"
          >
            <div className="glass-morphic p-4 rounded-2xl text-center">
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                Active Filters
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <AnimatePresence>
                  {filters.activeNow && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Badge className="bg-accent text-accent-foreground">
                        <Clock className="w-3 h-3 mr-1" weight="fill" />
                        Active Now
                      </Badge>
                    </motion.div>
                  )}
                  {filters.dealTypes.map((type) => (
                    <motion.div
                      key={type}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Badge className="bg-primary text-primary-foreground">
                        {type}
                      </Badge>
                    </motion.div>
                  ))}
                  {filters.priceLevel.map((level) => (
                    <motion.div
                      key={level}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Badge className="bg-secondary text-secondary-foreground">
                        {'$'.repeat(level)}
                      </Badge>
                    </motion.div>
                  ))}
                  {(filters.drinkingThemes || []).map((theme) => (
                    <motion.div
                      key={theme}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Badge className="bg-accent text-accent-foreground text-xs">
                        {theme.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
