import { DailyContent, DrinkingTheme } from './types';

export async function generateDailyContent(theme: DrinkingTheme): Promise<DailyContent> {
  const today = new Date().toISOString().split('T')[0];
  
  const themePrompts = {
    'famous-drunks': 'a legendary drinker from history (like Hemingway, Churchill, Bukowski, or Dorothy Parker)',
    'literary': 'literature and drinking culture (famous writers, books about drinking, or cocktails from literature)',
    'archetypal': 'archetypal drinking personas and universal drinking rituals across cultures',
    'prohibition': 'the Prohibition era (1920-1933), speakeasies, and the culture of illicit drinking',
    'ancient-rome': 'ancient Roman drinking culture, wine traditions, symposiums, and Bacchanalian celebrations'
  };

  const prompt = spark.llmPrompt`You are a creative content generator for "Hello Happier Hour", a social drinking discovery app.

Generate engaging daily content about ${themePrompts[theme]}.

Return the result as a valid JSON object with these properties:
{
  "quote": "An inspiring or witty quote related to the theme",
  "quoteAuthor": "The person who said the quote",
  "story": "A fascinating 2-3 paragraph story or historical fact related to the theme (200-300 words)",
  "cocktailOfTheDay": {
    "name": "Name of a cocktail relevant to the theme",
    "recipe": "Simple recipe with measurements",
    "history": "1-2 sentences about the cocktail's historical or cultural significance"
  },
  "historicalFact": "One surprising and interesting fact related to the theme"
}

Make it entertaining, educational, and authentic. Use a warm, conversational tone.`;

  try {
    const response = await spark.llm(prompt, 'gpt-4o', true);
    const generated = JSON.parse(response);
    
    return {
      id: `daily-${theme}-${today}`,
      date: today,
      theme,
      quote: generated.quote,
      quoteAuthor: generated.quoteAuthor,
      story: generated.story,
      cocktailOfTheDay: generated.cocktailOfTheDay,
      historicalFact: generated.historicalFact,
      recommendedVenues: [],
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to generate daily content:', error);
    return getFallbackContent(theme, today);
  }
}

function getFallbackContent(theme: DrinkingTheme, date: string): DailyContent {
  const fallbacks: Record<DrinkingTheme, Omit<DailyContent, 'id' | 'date' | 'theme' | 'recommendedVenues' | 'generatedAt'>> = {
    'famous-drunks': {
      quote: "Write drunk, edit sober.",
      quoteAuthor: "Ernest Hemingway",
      story: "Ernest Hemingway was known for his love of strong drinks and stronger stories. His favorite haunts included Harry's Bar in Venice and La Floridita in Havana, where he claimed to have consumed thousands of daiquiris. Hemingway believed that writing while drinking allowed him to access deeper emotions and truths, though he always maintained the discipline to edit his work with a clear head the next day.",
      cocktailOfTheDay: {
        name: "Death in the Afternoon",
        recipe: "1 jigger absinthe, champagne to fill. Pour absinthe into champagne glass, add champagne until it attains proper opalescent milkiness.",
        history: "Created by Hemingway himself and named after his 1932 book about bullfighting."
      },
      historicalFact: "Winston Churchill started drinking champagne at breakfast and continued throughout the day, claiming it saved him during difficult wartime decisions."
    },
    'literary': {
      quote: "I like to have a martini, two at the very most. After three I'm under the table, after four I'm under my host.",
      quoteAuthor: "Dorothy Parker",
      story: "The Algonquin Round Table was a group of writers, critics, and actors who met daily for lunch at the Algonquin Hotel in New York during the 1920s. Dorothy Parker, Robert Benchley, and their witty companions would trade barbs over martinis, creating some of the era's most memorable quips. Their gathering became legendary for combining intellectual discourse with heavy drinking, setting the standard for literary salon culture.",
      cocktailOfTheDay: {
        name: "The Algonquin",
        recipe: "2 oz rye whiskey, 1 oz dry vermouth, 1 oz pineapple juice. Shake with ice, strain into coupe.",
        history: "Created at the Algonquin Hotel, this cocktail became the unofficial drink of the literary Round Table."
      },
      historicalFact: "F. Scott Fitzgerald was reportedly drunk for most of the 1920s, yet produced his masterpiece 'The Great Gatsby' during this period."
    },
    'archetypal': {
      quote: "Wine is the most civilized thing in the world.",
      quoteAuthor: "Ernest Hemingway",
      story: "Across cultures and throughout history, certain drinking personas have emerged as universal archetypes. The Sage drinks slowly, contemplating life's mysteries. The Trickster uses drink to break social barriers and reveal truth. The Warrior drinks to celebrate victory and bond with comrades. These archetypes transcend culture and time, appearing in ancient symposiums, medieval taverns, and modern cocktail bars alike. Understanding these patterns helps us understand our own relationship with drinking and community.",
      cocktailOfTheDay: {
        name: "The Philosopher's Stone",
        recipe: "2 oz cognac, 1 oz Grand Marnier, 2 dashes Angostura bitters. Stir with ice, serve in old fashioned glass with orange peel.",
        history: "A contemplative drink designed for slow sipping and deep conversation."
      },
      historicalFact: "In nearly every culture, from Norse mead halls to Japanese sake ceremonies, drinking rituals serve to create social bonds and mark important transitions."
    },
    'prohibition': {
      quote: "I'll stick to gin. Champagne is just ginger ale that knows somebody.",
      quoteAuthor: "Hawkeye Pierce (M*A*S*H)",
      story: "When Prohibition began in 1920, Americans didn't stop drinking—they just became more creative. Speakeasies proliferated, hidden behind false walls, in basements, and even in phone booths. Passwords changed nightly, and corrupt cops looked the other way for the right price. 'Bathtub gin' got its name from diluting grain alcohol in tall containers. The cocktail renaissance we enjoy today has its roots in Prohibition-era bartenders who learned to mask rough liquor with creative mixers and fresh juices.",
      cocktailOfTheDay: {
        name: "Bee's Knees",
        recipe: "2 oz gin, 3/4 oz fresh lemon juice, 3/4 oz honey syrup. Shake hard with ice, strain into coupe.",
        history: "Created during Prohibition to mask the harsh taste of bathtub gin. The name was 1920s slang for 'the best.'"
      },
      historicalFact: "During Prohibition, grape growers sold 'bricks' of concentrated grape juice with a warning label: 'Do not add water and yeast and let sit for 21 days, or it will turn into wine.'"
    },
    'ancient-rome': {
      quote: "In vino veritas (In wine, there is truth)",
      quoteAuthor: "Pliny the Elder",
      story: "Ancient Romans elevated drinking to an art form. The symposium wasn't just about getting drunk—it was a structured social ritual combining wine, philosophy, music, and poetry. Romans diluted their wine with water (drinking undiluted wine was considered barbaric) and flavored it with honey, spices, and herbs to create mulsum and conditum. They believed wine freed the tongue and revealed truth. Bacchus, god of wine, was worshipped in elaborate festivals called Bacchanalia, where normal social rules were suspended.",
      cocktailOfTheDay: {
        name: "Mulsum",
        recipe: "1 bottle red wine, 1/2 cup honey, 1 bay leaf, pinch of saffron. Warm gently, add honey and spices, serve warm or chilled.",
        history: "Ancient Roman honey wine, served at banquets and symposiums. The favorite drink of Julius Caesar."
      },
      historicalFact: "Romans consumed an estimated 180 liters of wine per person per year—nearly 50 gallons, or about a bottle a day for every citizen including children."
    }
  };

  const fallback = fallbacks[theme];
  return {
    id: `daily-${theme}-${date}`,
    date,
    theme,
    ...fallback,
    recommendedVenues: [],
    generatedAt: new Date().toISOString()
  };
}
