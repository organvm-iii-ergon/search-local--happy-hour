import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKV } from '@github/spark/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  DiceFive,
  Users,
  Clock,
  ListChecks,
  Heart,
  MagnifyingGlass,
  Sparkle,
  Target,
  Cards,
  UsersThree,
  Timer
} from '@phosphor-icons/react';
import { DrinkingGame } from '@/lib/types';
import { CLASSIC_DRINKING_GAMES, GAME_CATEGORIES } from '@/lib/classic-games';
import { DrinkingGamesGenerator } from '@/components/DrinkingGamesGenerator';
import { toast } from 'sonner';

const CATEGORY_CONFIG = {
  card: { label: 'Card Games', icon: <Cards weight="fill" className="w-4 h-4" /> },
  skill: { label: 'Skill Games', icon: <Target weight="fill" className="w-4 h-4" /> },
  social: { label: 'Social Games', icon: <UsersThree weight="fill" className="w-4 h-4" /> },
  endurance: { label: 'Endurance', icon: <Timer weight="fill" className="w-4 h-4" /> }
};

const DIFFICULTY_COLORS = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500'
};

export function DrinkingGamesLibrary() {
  const [favoriteGames, setFavoriteGames] = useKV<string[]>('favorite-games', []);
  const [selectedGame, setSelectedGame] = useState<DrinkingGame | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filteredGames = useMemo(() => {
    let games = [...CLASSIC_DRINKING_GAMES];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      games = games.filter(game =>
        game.name.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      const categoryIds = GAME_CATEGORIES[selectedCategory as keyof typeof GAME_CATEGORIES];
      games = games.filter(game => categoryIds.includes(game.id));
    }

    if (selectedDifficulty) {
      games = games.filter(game => game.difficulty === selectedDifficulty);
    }

    return games;
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const toggleFavorite = (gameId: string) => {
    setFavoriteGames((current) => {
      const favs = current || [];
      if (favs.includes(gameId)) {
        toast.success('Removed from favorites');
        return favs.filter(id => id !== gameId);
      } else {
        toast.success('Added to favorites');
        return [...favs, gameId];
      }
    });
  };

  const isFavorite = (gameId: string) => {
    return (favoriteGames || []).includes(gameId);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-3xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <DiceFive weight="fill" className="w-8 h-8 text-accent" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Drinking Games
          </h2>
        </div>
        <p className="text-muted-foreground text-lg mb-6">
          Classic games and AI-generated experiences for your party
        </p>

        <Tabs defaultValue="classic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2 mb-6">
            <TabsTrigger value="classic" className="glass-morphic data-[state=active]:bg-accent/20">
              <Cards weight="fill" className="w-4 h-4 mr-2" />
              Classic Games
            </TabsTrigger>
            <TabsTrigger value="generated" className="glass-morphic data-[state=active]:bg-accent/20">
              <Sparkle weight="fill" className="w-4 h-4 mr-2" />
              AI Generated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classic" className="mt-0 space-y-6">
            {/* Filters */}
            <div className="space-y-4">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-card"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-semibold text-muted-foreground mr-2">Category:</span>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                    className={`glass-morphic ${
                      selectedCategory === key ? 'ring-2 ring-accent bg-accent/10' : ''
                    }`}
                  >
                    {config.icon}
                    <span className="ml-2">{config.label}</span>
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-semibold text-muted-foreground mr-2">Difficulty:</span>
                {['easy', 'medium', 'hard'].map((diff) => (
                  <Button
                    key={diff}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
                    className={`glass-morphic ${
                      selectedDifficulty === diff ? 'ring-2 ring-accent bg-accent/10' : ''
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${DIFFICULTY_COLORS[diff as keyof typeof DIFFICULTY_COLORS]} mr-2`} />
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card
                      className="glass-card rounded-2xl cursor-pointer h-full border-2 border-transparent hover:border-accent/50 transition-all"
                      onClick={() => setSelectedGame(game)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-xl">{game.name}</CardTitle>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(game.id);
                            }}
                          >
                            <Heart
                              weight={isFavorite(game.id) ? 'fill' : 'regular'}
                              className={`w-6 h-6 ${
                                isFavorite(game.id) ? 'text-red-500' : 'text-muted-foreground'
                              }`}
                            />
                          </motion.button>
                        </div>
                        <CardDescription className="line-clamp-2">{game.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${DIFFICULTY_COLORS[game.difficulty]} text-white`}>
                            {game.difficulty}
                          </Badge>
                          <Badge variant="secondary" className="glass-morphic">
                            <Users weight="fill" className="w-3 h-3 mr-1" />
                            {game.playerCount.min}-{game.playerCount.max}
                          </Badge>
                          <Badge variant="secondary" className="glass-morphic">
                            <Clock weight="fill" className="w-3 h-3 mr-1" />
                            {game.duration}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredGames.length === 0 && (
              <div className="text-center py-12">
                <DiceFive className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No games found</h3>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="generated" className="mt-0">
            <DrinkingGamesGenerator />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Game Detail Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedGame(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full max-h-[90vh] overflow-hidden"
            >
              <Card className="glass-card border-2 border-accent/50 rounded-3xl">
                <CardHeader className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <DiceFive className="w-12 h-12 text-accent" weight="fill" />
                        <CardTitle className="text-4xl font-bold">{selectedGame.name}</CardTitle>
                      </div>
                      <CardDescription className="text-lg">{selectedGame.description}</CardDescription>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(selectedGame.id)}
                      className="ml-4"
                    >
                      <Heart
                        weight={isFavorite(selectedGame.id) ? 'fill' : 'regular'}
                        className={`w-8 h-8 ${
                          isFavorite(selectedGame.id) ? 'text-red-500' : 'text-muted-foreground'
                        }`}
                      />
                    </motion.button>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <Badge className={`${DIFFICULTY_COLORS[selectedGame.difficulty]} text-white`}>
                      {selectedGame.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="glass-morphic">
                      <Users weight="fill" className="w-4 h-4 mr-1" />
                      {selectedGame.playerCount.min}-{selectedGame.playerCount.max} players
                    </Badge>
                    <Badge variant="secondary" className="glass-morphic">
                      <Clock weight="fill" className="w-4 h-4 mr-1" />
                      {selectedGame.duration}
                    </Badge>
                  </div>
                </CardHeader>

                <ScrollArea className="max-h-[60vh]">
                  <CardContent className="pt-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <ListChecks weight="fill" className="text-accent" />
                        Rules
                      </h3>
                      <ol className="space-y-3">
                        {selectedGame.rules.map((rule, index) => (
                          <li key={index} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-primary-foreground font-bold shrink-0">
                              {index + 1}
                            </div>
                            <p className="flex-1 pt-1">{rule}</p>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold mb-3">Materials Needed</h3>
                        <ul className="space-y-2">
                          {selectedGame.materials.map((material, index) => (
                            <li key={index} className="flex items-center gap-2 text-muted-foreground">
                              <div className="w-2 h-2 rounded-full bg-accent" />
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {selectedGame.variations && selectedGame.variations.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold mb-3">Variations</h3>
                          <ul className="space-y-2">
                            {selectedGame.variations.map((variation, index) => (
                              <li key={index} className="flex items-center gap-2 text-muted-foreground">
                                <div className="w-2 h-2 rounded-full bg-secondary" />
                                {variation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-border/50">
                      <Button
                        onClick={() => setSelectedGame(null)}
                        variant="outline"
                        className="flex-1 glass-morphic"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => toggleFavorite(selectedGame.id)}
                        className="flex-1 bg-gradient-to-r from-primary to-accent"
                      >
                        <Heart
                          weight={isFavorite(selectedGame.id) ? 'fill' : 'regular'}
                          className="mr-2"
                        />
                        {isFavorite(selectedGame.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                      </Button>
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
