import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Clock,
  CurrencyDollar,
  Path,
  Sparkle,
  ArrowRight,
  CheckCircle,
  Users,
  Lightbulb,
  Download,
  Share
} from '@phosphor-icons/react';
import { Venue, DrinkingTheme, VenueVisit } from '@/lib/types';
import { generateBarCrawlItinerary, generateQuickCrawlOptions, BarCrawlItinerary } from '@/lib/itinerary-generator';
import { toast } from 'sonner';

interface ItineraryGeneratorProps {
  allVenues: Venue[];
  visitHistory?: VenueVisit[];
  favoriteVenues?: string[];
}

const THEME_OPTIONS: { value: DrinkingTheme; label: string; emoji: string }[] = [
  { value: 'famous-drunks', label: 'Famous Drunks', emoji: '🥃' },
  { value: 'literary', label: 'Literary', emoji: '📚' },
  { value: 'archetypal', label: 'Archetypal', emoji: '🎭' },
  { value: 'prohibition', label: 'Prohibition', emoji: '🕵️' },
  { value: 'ancient-rome', label: 'Ancient Rome', emoji: '🏛️' }
];

export function ItineraryGenerator({
  allVenues,
  visitHistory = [],
  favoriteVenues = []
}: ItineraryGeneratorProps) {
  const [savedItineraries, setSavedItineraries] = useKV<BarCrawlItinerary[]>('saved-itineraries', []);
  const [currentItinerary, setCurrentItinerary] = useState<BarCrawlItinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [startTime, setStartTime] = useState('18:00');
  const [duration, setDuration] = useState([4]);
  const [selectedTheme, setSelectedTheme] = useState<DrinkingTheme | null>(null);
  const [partySize, setPartySize] = useState([4]);
  const [priceLevel, setPriceLevel] = useState<number[]>([1, 2, 3]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const itinerary = await generateBarCrawlItinerary(
        allVenues,
        {
          startTime,
          duration: duration[0],
          theme: selectedTheme || undefined,
          priceLevel,
          partySize: partySize[0]
        },
        visitHistory,
        favoriteVenues
      );
      setCurrentItinerary(itinerary);
      toast.success('Itinerary created!', {
        description: `${itinerary.stops.length} stops planned`
      });
    } catch (error) {
      toast.error('Failed to generate itinerary');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickGenerate = async (option: ReturnType<typeof generateQuickCrawlOptions>[0]) => {
    setIsGenerating(true);
    try {
      const itinerary = await generateBarCrawlItinerary(
        allVenues,
        {
          startTime: '18:00',
          duration: option.duration,
          theme: option.theme,
          priceLevel: [1, 2, 3],
          partySize: 4
        },
        visitHistory,
        favoriteVenues
      );
      setCurrentItinerary(itinerary);
      toast.success(`${option.title} created!`);
    } catch (error) {
      toast.error('Failed to generate itinerary');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveItinerary = () => {
    if (!currentItinerary) return;
    setSavedItineraries((current) => {
      if ((current || []).some(i => i.id === currentItinerary.id)) {
        toast.info('Already saved');
        return current;
      }
      toast.success('Itinerary saved!');
      return [...(current || []), currentItinerary];
    });
  };

  const quickOptions = generateQuickCrawlOptions();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-3xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Path weight="fill" className="w-8 h-8 text-accent" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bar Crawl Planner
            </h2>
            <p className="text-muted-foreground text-lg">
              AI-powered itineraries tailored to your vibe
            </p>
          </div>
        </div>

        {/* Quick Options */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkle weight="fill" className="text-accent" />
            Quick Plans
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 glass-morphic border-accent/30 hover:border-accent hover:bg-accent/10"
                  onClick={() => handleQuickGenerate(option)}
                  disabled={isGenerating}
                >
                  <div className="text-left w-full">
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <div className="font-bold text-sm mb-1">{option.title}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        <Separator className="my-8 bg-border/30" />

        {/* Custom Options */}
        <div>
          <h3 className="text-lg font-bold mb-4">Custom Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="glass-card"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">
                Duration: {duration[0]} hours
              </Label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={2}
                max={8}
                step={1}
                className="pt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Theme (Optional)</Label>
              <Select
                value={selectedTheme || 'none'}
                onValueChange={(v) => setSelectedTheme(v === 'none' ? null : v as DrinkingTheme)}
              >
                <SelectTrigger className="glass-morphic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Theme</SelectItem>
                  {THEME_OPTIONS.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.emoji} {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">
                Party Size: {partySize[0]} people
              </Label>
              <Slider
                value={partySize}
                onValueChange={setPartySize}
                min={1}
                max={12}
                step={1}
                className="pt-2"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-6 h-14 text-lg bg-gradient-to-r from-primary via-accent to-secondary hover:scale-105 transition-transform"
          >
            {isGenerating ? (
              <>
                <Sparkle className="mr-2 animate-spin" weight="fill" />
                Generating...
              </>
            ) : (
              <>
                <Path className="mr-2" weight="fill" />
                Generate Custom Crawl
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Current Itinerary */}
      <AnimatePresence mode="wait">
        {currentItinerary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-card border-2 border-accent/50 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{currentItinerary.name}</CardTitle>
                    <p className="text-muted-foreground">{currentItinerary.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <Badge variant="secondary" className="glass-morphic">
                    <Clock weight="fill" className="w-4 h-4 mr-1" />
                    {Math.floor(currentItinerary.totalDuration / 60)}h {currentItinerary.totalDuration % 60}m
                  </Badge>
                  <Badge variant="secondary" className="glass-morphic">
                    <MapPin weight="fill" className="w-4 h-4 mr-1" />
                    {currentItinerary.totalDistance}km
                  </Badge>
                  <Badge variant="secondary" className="glass-morphic">
                    <CurrencyDollar weight="fill" className="w-4 h-4 mr-1" />
                    {currentItinerary.estimatedCost}
                  </Badge>
                  <Badge variant="secondary" className="glass-morphic">
                    <Users weight="fill" className="w-4 h-4 mr-1" />
                    {currentItinerary.stops.length} stops
                  </Badge>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button onClick={saveItinerary} variant="outline" className="glass-morphic">
                    <Download weight="fill" className="mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" className="glass-morphic">
                    <Share weight="fill" className="mr-2" />
                    Share
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-8">
                <ScrollArea className="h-[600px] pr-4">
                  {/* Stops */}
                  <div className="space-y-6">
                    {currentItinerary.stops.map((stop, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                      >
                        {/* Timeline connector */}
                        {index < currentItinerary.stops.length - 1 && (
                          <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-accent to-secondary" />
                        )}

                        <div className="flex gap-4">
                          {/* Stop number */}
                          <div className="shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-lg relative z-10">
                              {index + 1}
                            </div>
                          </div>

                          {/* Stop details */}
                          <div className="flex-1 glass-morphic p-6 rounded-2xl">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold mb-1">{stop.venue.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{stop.purpose}</p>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock weight="fill" className="w-4 h-4 text-accent" />
                                  <span>{stop.arrivalTime} - {stop.departureTime}</span>
                                  <span className="text-muted-foreground">({stop.duration} min)</span>
                                </div>
                              </div>
                              <Badge className="bg-accent/20 text-accent border-accent/30">
                                {'$'.repeat(stop.venue.priceLevel)}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 mb-4 text-sm">
                              <MapPin weight="fill" className="w-4 h-4 text-secondary" />
                              <span className="text-muted-foreground">{stop.venue.neighborhood}</span>
                              {stop.distance && (
                                <>
                                  <ArrowRight className="w-4 h-4" />
                                  <span className="text-accent">{stop.distance.toFixed(1)}km from last</span>
                                </>
                              )}
                            </div>

                            <div className="mb-4">
                              <div className="text-sm font-semibold mb-2">Activities:</div>
                              <ul className="space-y-1">
                                {stop.activities.map((activity, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <CheckCircle weight="fill" className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Estimated spend:</span>
                              <span className="font-semibold">{stop.estimatedSpend}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tips */}
                  <div className="mt-8 glass-morphic p-6 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Lightbulb weight="fill" className="text-accent" />
                      Pro Tips
                    </h3>
                    <ul className="space-y-2">
                      {currentItinerary.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Itineraries */}
      {(savedItineraries || []).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-3xl"
        >
          <h3 className="text-lg font-bold mb-4">Saved Itineraries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(savedItineraries || []).map((itinerary) => (
              <motion.div
                key={itinerary.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-morphic p-4 rounded-2xl cursor-pointer"
                onClick={() => setCurrentItinerary(itinerary)}
              >
                <h4 className="font-bold mb-2">{itinerary.name}</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary">{itinerary.stops.length} stops</Badge>
                  <Badge variant="secondary">{itinerary.totalDistance}km</Badge>
                  <Badge variant="secondary">{itinerary.estimatedCost}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
