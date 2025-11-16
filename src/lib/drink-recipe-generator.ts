import { DrinkingTheme } from './types';
import { callLLM } from '@github/spark/llm';

export interface DrinkRecipe {
  id: string;
  name: string;
  description: string;
  category: 'cocktail' | 'shot' | 'mocktail' | 'punch';
  theme?: DrinkingTheme;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number; // minutes
  servings: number;
  ingredients: Array<{
    item: string;
    amount: string;
    optional?: boolean;
  }>;
  instructions: string[];
  garnish: string[];
  glassware: string;
  flavorProfile: string[];
  alcoholContent: 'none' | 'low' | 'medium' | 'high';
  backstory?: string;
  variations?: string[];
  pairingSuggestions?: string[];
  createdAt: string;
}

export async function generateDrinkRecipe(
  preferences: {
    theme?: DrinkingTheme;
    baseSpirit?: string;
    flavorProfile?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
    occasion?: string;
    alcoholStrength?: 'light' | 'moderate' | 'strong';
    includeNonAlcoholic?: boolean;
  }
): Promise<DrinkRecipe> {
  const { theme, baseSpirit, flavorProfile, difficulty, occasion, alcoholStrength, includeNonAlcoholic } = preferences;

  const prompt = `Create an original, creative cocktail recipe based on these preferences:

${theme ? `Theme: ${theme} (incorporate this cultural/historical theme into the drink's concept and presentation)` : ''}
${baseSpirit ? `Base Spirit: ${baseSpirit}` : 'Base Spirit: Your choice'}
${flavorProfile && flavorProfile.length > 0 ? `Desired Flavors: ${flavorProfile.join(', ')}` : ''}
${difficulty ? `Difficulty Level: ${difficulty}` : 'Difficulty: Medium'}
${occasion ? `Occasion: ${occasion}` : ''}
${alcoholStrength ? `Alcohol Strength: ${alcoholStrength}` : ''}
${includeNonAlcoholic ? 'Include a mocktail variation' : ''}

Please provide a JSON response with:
{
  "name": "Creative cocktail name (theme-inspired if applicable)",
  "description": "2-3 sentence description of the drink's character and appeal",
  "category": "cocktail|shot|mocktail|punch",
  "difficulty": "easy|medium|hard",
  "prepTime": minutes as number,
  "servings": number,
  "ingredients": [{"item": "ingredient name", "amount": "measurement", "optional": boolean}],
  "instructions": ["step 1", "step 2", ...],
  "garnish": ["garnish 1", "garnish 2"],
  "glassware": "glass type",
  "flavorProfile": ["flavor 1", "flavor 2"],
  "alcoholContent": "none|low|medium|high",
  "backstory": "1-2 sentences about the drink's inspiration or cultural connection",
  "variations": ["variation 1", "variation 2"],
  "pairingSuggestions": ["food pairing 1", "food pairing 2"]
}

Make it creative, balanced, and actually drinkable!`;

  try {
    const response = await callLLM({
      prompt,
      temperature: 0.9, // High creativity
      max_tokens: 1500
    });

    const recipeData = JSON.parse(response);

    const recipe: DrinkRecipe = {
      id: `recipe-${Date.now()}`,
      name: recipeData.name,
      description: recipeData.description,
      category: recipeData.category,
      theme,
      difficulty: recipeData.difficulty || difficulty || 'medium',
      prepTime: recipeData.prepTime,
      servings: recipeData.servings,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      garnish: recipeData.garnish,
      glassware: recipeData.glassware,
      flavorProfile: recipeData.flavorProfile,
      alcoholContent: recipeData.alcoholContent,
      backstory: recipeData.backstory,
      variations: recipeData.variations,
      pairingSuggestions: recipeData.pairingSuggestions,
      createdAt: new Date().toISOString()
    };

    return recipe;
  } catch (error) {
    // Fallback to pre-generated recipe if AI fails
    return generateFallbackRecipe(preferences);
  }
}

function generateFallbackRecipe(preferences: any): DrinkRecipe {
  const themes = {
    'literary': {
      name: 'The Hemingway Daiquiri',
      description: 'A bold, no-nonsense classic favored by Ernest Hemingway. Tart grapefruit meets white rum with a hint of maraschino.',
      backstory: 'Hemingway famously ordered this at El Floridita in Havana, asking for no sugar and double the rum.'
    },
    'prohibition': {
      name: 'Bee\'s Knees',
      description: 'A Prohibition-era gem that used honey to mask bathtub gin\'s harsh edges. Smooth, sweet, and historically authentic.',
      backstory: 'Created in the 1920s when speakeasies needed to disguise inferior spirits with strong flavors.'
    },
    'ancient-rome': {
      name: 'Mulsum Moderne',
      description: 'Ancient Roman wine punch reimagined. Honeyed wine with herbs and citrus, fit for Bacchus himself.',
      backstory: 'Romans mixed wine with honey to create mulsum, drunk before meals to stimulate appetite.'
    },
    'famous-drunks': {
      name: 'Churchill\'s Victory',
      description: 'Strong, sophisticated, and unapologetic. Gin-forward with a whisper of vermouth, just how Winston liked it.',
      backstory: 'Churchill reportedly preferred his martinis so dry he\'d just bow in the direction of France.'
    },
    'archetypal': {
      name: 'The Philosopher\'s Stone',
      description: 'Transformative layers of flavor representing the alchemical journey. Gold rum, amaro, and sage.',
      backstory: 'Each ingredient represents a stage in the great work of transformation.'
    }
  };

  const defaultTheme = preferences.theme && themes[preferences.theme as keyof typeof themes]
    ? themes[preferences.theme as keyof typeof themes]
    : {
        name: 'The Signature',
        description: 'A perfectly balanced cocktail showcasing premium ingredients and expert technique.',
        backstory: 'Crafted to highlight the natural flavors of each component.'
      };

  return {
    id: `recipe-${Date.now()}`,
    name: defaultTheme.name,
    description: defaultTheme.description,
    category: 'cocktail',
    theme: preferences.theme,
    difficulty: preferences.difficulty || 'medium',
    prepTime: 5,
    servings: 1,
    ingredients: [
      { item: preferences.baseSpirit || 'Gin', amount: '2 oz' },
      { item: 'Fresh lemon juice', amount: '0.75 oz' },
      { item: 'Simple syrup', amount: '0.5 oz' },
      { item: 'Egg white', amount: '1', optional: true }
    ],
    instructions: [
      'Add all ingredients to a shaker without ice',
      'Dry shake vigorously for 15 seconds',
      'Add ice and shake again until well-chilled',
      'Double strain into a chilled coupe glass'
    ],
    garnish: ['Lemon twist', 'Expressed oils'],
    glassware: 'Coupe glass',
    flavorProfile: preferences.flavorProfile || ['Citrus', 'Bright', 'Balanced'],
    alcoholContent: 'medium',
    backstory: defaultTheme.backstory,
    variations: [
      'Substitute lime for lemon for a sharper profile',
      'Add 0.25 oz of herbal liqueur for complexity'
    ],
    pairingSuggestions: ['Oysters', 'Ceviche', 'Light appetizers'],
    createdAt: new Date().toISOString()
  };
}

export function getQuickRecipePrompts(): Array<{
  title: string;
  description: string;
  preferences: Partial<Parameters<typeof generateDrinkRecipe>[0]>;
  emoji: string;
}> {
  return [
    {
      title: 'Prohibition Speakeasy',
      description: 'Classic 1920s cocktail',
      preferences: { theme: 'prohibition', difficulty: 'medium' },
      emoji: '🕵️'
    },
    {
      title: 'Literary Classic',
      description: 'Book-inspired libation',
      preferences: { theme: 'literary', difficulty: 'easy' },
      emoji: '📚'
    },
    {
      title: 'Roman Feast',
      description: 'Ancient wine punch',
      preferences: { theme: 'ancient-rome', baseSpirit: 'Wine' },
      emoji: '🏛️'
    },
    {
      title: 'Tropical Paradise',
      description: 'Fruity rum cocktail',
      preferences: { baseSpirit: 'Rum', flavorProfile: ['Tropical', 'Sweet', 'Fruity'] },
      emoji: '🏝️'
    },
    {
      title: 'Whiskey Sour Twist',
      description: 'Modern whiskey classic',
      preferences: { baseSpirit: 'Whiskey', flavorProfile: ['Sour', 'Balanced'] },
      emoji: '🥃'
    },
    {
      title: 'Mocktail Magic',
      description: 'Zero-proof sophistication',
      preferences: { includeNonAlcoholic: true, category: 'mocktail' as any },
      emoji: '✨'
    }
  ];
}
