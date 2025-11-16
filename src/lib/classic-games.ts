import { DrinkingGame } from './types';

export const CLASSIC_DRINKING_GAMES: DrinkingGame[] = [
  {
    id: 'kings-cup',
    name: 'Kings Cup',
    description: 'A classic card-based drinking game where each card has a rule. Draw cards and follow the rules until the King\'s Cup is filled!',
    rules: [
      'Ace (Waterfall): Everyone starts drinking. You can\'t stop until the person to your right stops.',
      '2 (You): Choose someone to take a drink',
      '3 (Me): Take a drink yourself',
      '4 (Floor): Last person to touch the floor drinks',
      '5 (Guys): All guys drink',
      '6 (Chicks): All ladies drink',
      '7 (Heaven): Last person to point up drinks',
      '8 (Mate): Choose a drinking buddy who drinks when you do',
      '9 (Rhyme): Say a word, everyone rhymes. First to mess up drinks',
      '10 (Categories): Pick a category, name things in it. First to fail drinks',
      'Jack (Make a Rule): Create a rule everyone must follow',
      'Queen (Questions): Ask questions. First to answer or mess up drinks',
      'King: Pour some of your drink into the Kings Cup. Last king drinks it all!'
    ],
    difficulty: 'medium',
    playerCount: { min: 3, max: 10 },
    duration: '30-60 minutes',
    materials: ['Deck of cards', 'Large cup (Kings Cup)', 'Drinks for all players'],
    variations: [
      'Speed Kings: Draw two cards at once for faster gameplay',
      'Custom Rules: Create your own card meanings',
      'Never Have I Ever mode: Replace some cards with Never Have I Ever questions'
    ],
    generatedAt: new Date().toISOString()
  },
  {
    id: 'beer-pong',
    name: 'Beer Pong',
    description: 'The quintessential party game. Toss ping pong balls into cups arranged in a triangle. Make a cup, your opponent drinks!',
    rules: [
      'Arrange 10 cups in a triangle formation at each end of the table',
      'Fill each cup with beer (about 1/3 full)',
      'Teams of 2 take turns throwing ping pong balls',
      'If a ball lands in a cup, the opposing team drinks it and removes the cup',
      'Balls can be thrown directly or bounced (bounce shots count as 2 cups)',
      'Re-rack cups into a triangle formation at 6, 3, and 1 cups remaining',
      'First team to eliminate all opposing cups wins',
      'Losing team drinks the remaining cups on the winner\'s side',
      'Redemption: Losing team gets one shot per player to extend the game',
      'If redeemed, game continues until one team has no cups left'
    ],
    difficulty: 'easy',
    playerCount: { min: 2, max: 4 },
    duration: '15-30 minutes',
    materials: ['Ping pong table or long table', '22 plastic cups', '2-3 ping pong balls', 'Beer or other beverages'],
    variations: [
      'Civil War: 3v3 with individual triangles',
      'Death Cup: If you make the cup someone is drinking from, game over',
      'Island Cup: One isolated cup worth multiple cups',
      'Trick Shots: Behind the back, under the leg, etc.'
    ],
    generatedAt: new Date().toISOString()
  },
  {
    id: 'flip-cup',
    name: 'Flip Cup',
    description: 'Fast-paced team relay race. Drink your cup, then flip it upside down by flicking the rim. First team to finish wins!',
    rules: [
      'Divide into two teams of equal size',
      'Line up on opposite sides of a long table',
      'Each player has a plastic cup filled with beer',
      'First players tap cups and drink when the game starts',
      'After finishing your drink, place cup on table edge',
      'Flick the rim to flip the cup upside down',
      'Once your cup lands upside down, next teammate goes',
      'First team to have all players successfully flip wins',
      'Losing team takes a penalty drink',
      'Switch sides and play again for best 2 out of 3'
    ],
    difficulty: 'easy',
    playerCount: { min: 4, max: 16 },
    duration: '5-10 minutes per round',
    materials: ['Long table', 'Plastic cups (one per player)', 'Beer or other beverages'],
    variations: [
      'Survivor Flip Cup: Losing player each round is eliminated',
      'Timed Challenge: See how fast one team can complete it',
      'Double Cup: Stack two cups for extra difficulty',
      'Blindfolded: One player per team goes blindfolded'
    ],
    generatedAt: new Date().toISOString()
  },
  {
    id: 'never-have-i-ever',
    name: 'Never Have I Ever',
    description: 'Learn secrets about your friends! Say something you\'ve never done. Anyone who has done it takes a drink.',
    rules: [
      'Everyone holds up 5-10 fingers (decide at start)',
      'Players take turns saying "Never have I ever..." statements',
      'Anyone who HAS done the thing puts a finger down and drinks',
      'Keep going around the circle',
      'First person to put all fingers down loses',
      'Loser takes a penalty shot or performs a dare',
      'New round starts with the loser going first',
      'Keep statements PG-13 unless everyone agrees otherwise',
      'No targeting specific people with your statements',
      'Be honest - lying defeats the purpose!'
    ],
    difficulty: 'easy',
    playerCount: { min: 3, max: 12 },
    duration: '20-40 minutes',
    materials: ['Drinks for all players', 'Optional: pre-written question cards'],
    variations: [
      'Point System: Drink = 1 point, highest score loses',
      'Two Truths and a Lie: Mix in false statements',
      'Category Mode: All statements must fit a theme',
      'Speed Round: 30 seconds to think of a statement'
    ],
    generatedAt: new Date().toISOString()
  },
  {
    id: 'quarters',
    name: 'Quarters',
    description: 'Test your coordination! Bounce a quarter off the table into a shot glass. Make it, choose who drinks!',
    rules: [
      'Place a shot glass in the center of the table',
      'Players sit in a circle around the table',
      'Take turns bouncing a quarter off the table',
      'Try to land the quarter in the shot glass',
      'If you make it: Choose someone to drink a shot',
      'If you make it twice in a row: Make a new rule',
      'Rules stack throughout the game (can\'t use first names, etc.)',
      'Breaking a rule = drink',
      'After 3 misses, pass the quarter to the next player',
      'Game continues until the alcohol runs out or players give up'
    ],
    difficulty: 'medium',
    playerCount: { min: 2, max: 8 },
    duration: '20-40 minutes',
    materials: ['Quarter', 'Shot glass', 'Table', 'Liquor for shots'],
    variations: [
      'Speed Quarters: Two quarters going at once',
      'Around the World: Make it from different positions',
      'Challenge Mode: Use smaller glass or bounce from further away',
      'Team Quarters: Teams compete for points'
    ],
    generatedAt: new Date().toISOString()
  },
  {
    id: 'power-hour',
    name: 'Power Hour',
    description: 'The endurance test. Take a shot of beer every minute for an hour. 60 shots total. Can you handle it?',
    rules: [
      'Set a timer to beep/ring every 60 seconds',
      'When the timer goes off, everyone takes a shot of beer',
      'Continue for 60 minutes (60 total shots)',
      'That\'s about 5 beers worth - pace yourself!',
      'No skipping rounds or you\'re out',
      'Stay seated between shots to pace yourself',
      'Hydrate with water between some rounds',
      'Last person standing wins',
      'Warning: This is approximately 5 beers in an hour - drink responsibly',
      'Century Club: Brave souls can attempt 100 shots in 100 minutes'
    ],
    difficulty: 'hard',
    playerCount: { min: 2, max: 20 },
    duration: '60 minutes',
    materials: ['Timer or Power Hour playlist/app', 'Shot glasses', 'Lots of beer', 'Water for hydration'],
    variations: [
      'Century Club: 100 shots in 100 minutes',
      'Half Hour: 30 shots for beginners',
      'Themed Hour: Use themed music/videos',
      'Team Power Hour: Teams compete to finish together'
    ],
    generatedAt: new Date().toISOString()
  },
  {
    id: 'ride-the-bus',
    name: 'Ride the Bus',
    description: 'Progressive card game of chance. Guess card attributes correctly to give drinks, wrong to take drinks. Loser rides the bus!',
    rules: [
      'Round 1: Guess red or black. Wrong = drink',
      'Round 2: Guess higher or lower than first card. Wrong = drink',
      'Round 3: Guess if next card is between or outside your two cards',
      'Round 4: Guess the suit (hearts, diamonds, clubs, spades)',
      'Dealer lays out pyramid of cards (4-3-2-1)',
      'Flip pyramid cards - match cards in hand = give drinks',
      'Bottom row = 1 drink, 2nd row = 2 drinks, etc.',
      'Player with most cards left "rides the bus"',
      'Riding the bus: Guess 4 cards in a row correctly to get off',
      'Wrong guess resets the sequence and add one card'
    ],
    difficulty: 'medium',
    playerCount: { min: 3, max: 8 },
    duration: '20-30 minutes',
    materials: ['Deck of cards', 'Drinks for all players'],
    variations: [
      'Speed Bus: 30 second time limits on guesses',
      'Double Deck: Use two decks for longer game',
      'Team Ride: Losing team all rides together',
      'Sudden Death: Three wrong guesses and you auto-lose'
    ],
    generatedAt: new Date().toISOString()
  },
  {
    id: 'chandeliers',
    name: 'Chandeliers',
    description: 'Beer pong meets flip cup! Bounce balls into cups, make one and everyone drinks and flips. Last to flip drinks the center!',
    rules: [
      'Arrange cups in a circle with one tall cup (chandelier) in the middle',
      'Each player has their own cup in the circle',
      'Players take turns bouncing a ping pong ball',
      'If you make your own cup: Choose someone to drink it',
      'If you make someone else\'s cup: They drink it',
      'When a cup is made, everyone drinks their cup and flips it',
      'Last person to successfully flip drinks the chandelier',
      'Refill all cups after a chandelier is drunk',
      'First player to make the chandelier twice wins',
      'Loser finishes any remaining beer'
    ],
    difficulty: 'medium',
    playerCount: { min: 4, max: 10 },
    duration: '15-25 minutes',
    materials: ['Cups for each player plus chandelier', 'Ping pong balls', 'Beer', 'Table'],
    variations: [
      'King\'s Chandelier: Add special rules for chandelier',
      'Speed Chandeliers: Everyone shoots at once',
      'Rainbow Chandelier: Different drinks in each cup',
      'Mega Chandelier: Use a pitcher in the center'
    ],
    generatedAt: new Date().toISOString()
  }
];

export const GAME_CATEGORIES = {
  card: ['kings-cup', 'ride-the-bus'],
  skill: ['beer-pong', 'flip-cup', 'quarters', 'chandeliers'],
  social: ['never-have-i-ever'],
  endurance: ['power-hour']
};

export const DIFFICULTY_FILTERS = {
  easy: ['beer-pong', 'flip-cup', 'never-have-i-ever'],
  medium: ['kings-cup', 'quarters', 'ride-the-bus', 'chandeliers'],
  hard: ['power-hour']
};
