import { Venue, Bartender, MenuItem, ThemedEvent, Review } from './types';

export const MOCK_BARTENDERS: Bartender[] = [
  {
    id: 'b1',
    name: 'Marcus Chen',
    bio: 'Award-winning mixologist specializing in craft cocktails with Asian-fusion flavors. 10+ years crafting experiences.',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80',
    venueId: '1',
    specialties: ['Craft Cocktails', 'Whiskey', 'Asian Fusion'],
    signatureDrinks: ['Yuzu Margarita', 'Ginger Old Fashioned', 'Sakura Martini'],
    yearsExperience: 12,
    followerCount: 1247,
    rating: 4.8,
    isVerified: true,
    thematicStyle: 'archetypal'
  },
  {
    id: 'b2',
    name: 'Sofia Rodriguez',
    bio: 'Passionate about beer culture and local brews. Creating the perfect pour since 2015.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    venueId: '2',
    specialties: ['Craft Beer', 'Beer Pairing', 'Local Brews'],
    signatureDrinks: ['IPA Flight', 'Smoked Porter', 'Citrus Wheat'],
    yearsExperience: 8,
    followerCount: 892,
    rating: 4.9,
    isVerified: true,
    thematicStyle: 'ancient-rome'
  },
  {
    id: 'b3',
    name: 'James Wellington',
    bio: 'Classical bartending meets modern innovation. Wine sommelier and spirits enthusiast.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    venueId: '3',
    specialties: ['Wine', 'Classic Cocktails', 'Spirits'],
    signatureDrinks: ['The Wellington', 'Elderflower Spritz', 'Smoked Manhattan'],
    yearsExperience: 15,
    followerCount: 2103,
    rating: 4.7,
    isVerified: true,
    thematicStyle: 'prohibition'
  },
  {
    id: 'b4',
    name: 'Ernest "Papa" Morrison',
    bio: 'If Hemingway tended bar, this would be him. Master of strong drinks and stronger stories. Every cocktail comes with a tale.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    venueId: '6',
    specialties: ['Whiskey Neat', 'Classic Cocktails', 'Storytelling'],
    signatureDrinks: ['Death in the Afternoon', 'Papa Doble', 'Old Fashioned'],
    yearsExperience: 22,
    followerCount: 3456,
    rating: 4.9,
    isVerified: true,
    thematicStyle: 'famous-drunks'
  },
  {
    id: 'b5',
    name: 'Dorothy Parker-Mills',
    bio: 'Wit as sharp as her martinis. Specializing in pre-prohibition classics with a modern tongue-in-cheek twist.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    venueId: '6',
    specialties: ['Gin Martinis', 'Literary Classics', 'Witty Banter'],
    signatureDrinks: ['The Algonquin', 'Bee\'s Knees', 'French 75'],
    yearsExperience: 14,
    followerCount: 2891,
    rating: 4.8,
    isVerified: true,
    thematicStyle: 'literary'
  },
  {
    id: 'b6',
    name: 'Aurelius Vinifera',
    bio: 'Bringing ancient Roman hospitality to modern times. Wine, mead, and mulled delights served with imperial grandeur.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    venueId: '2',
    specialties: ['Ancient Wines', 'Mead', 'Mulled Drinks'],
    signatureDrinks: ['Mulsum', 'Posca Revival', 'Falernian Flight'],
    yearsExperience: 11,
    followerCount: 1567,
    rating: 4.6,
    isVerified: true,
    thematicStyle: 'ancient-rome'
  }
];

export const MOCK_MENU_ITEMS: Record<string, MenuItem[]> = {
  '1': [
    {
      id: 'm1',
      name: 'Yuzu Margarita',
      description: 'Fresh yuzu juice, premium tequila, agave, lime, and a chili salt rim',
      price: '$12',
      category: 'Signature Cocktails',
      ingredients: ['Yuzu', 'Tequila', 'Agave', 'Lime', 'Chili Salt'],
      isSignature: true,
      available: true
    },
    {
      id: 'm2',
      name: 'Ginger Old Fashioned',
      description: 'House-infused ginger bourbon, maple syrup, aromatic bitters',
      price: '$14',
      category: 'Signature Cocktails',
      ingredients: ['Bourbon', 'Ginger', 'Maple', 'Bitters'],
      isSignature: true,
      available: true
    },
    {
      id: 'm3',
      name: 'Classic Mojito',
      description: 'White rum, fresh mint, lime, cane sugar, soda',
      price: '$10',
      category: 'Classic Cocktails',
      ingredients: ['Rum', 'Mint', 'Lime', 'Sugar'],
      available: true
    },
    {
      id: 'm4',
      name: 'House Red Wine',
      description: 'Rotating selection of premium reds',
      price: '$8',
      category: 'Wine',
      available: true
    }
  ],
  '2': [
    {
      id: 'm5',
      name: 'Hazy IPA',
      description: 'Juicy, tropical hop bomb with notes of mango and passionfruit',
      price: '$7',
      category: 'Draft Beer',
      isSignature: true,
      available: true
    },
    {
      id: 'm6',
      name: 'Smoked Porter',
      description: 'Rich, smoky dark beer with chocolate and coffee notes',
      price: '$8',
      category: 'Draft Beer',
      isSignature: true,
      available: true
    },
    {
      id: 'm7',
      name: 'Loaded Nachos',
      description: 'House-made chips, cheese, jalapeños, sour cream, salsa',
      price: '$12',
      category: 'Food',
      available: true
    },
    {
      id: 'm5a',
      name: 'Mulsum (Honey Wine)',
      description: 'Ancient Roman sweet wine infused with honey and warm spices - Aurelius\'s specialty',
      price: '$14',
      category: 'Ancient Rome Collection',
      isSignature: true,
      available: true
    },
    {
      id: 'm5b',
      name: 'Posca Revival',
      description: 'Roman soldier\'s drink reimagined: wine vinegar, honey, herbs - surprisingly refreshing',
      price: '$11',
      category: 'Ancient Rome Collection',
      ingredients: ['Wine Vinegar', 'Honey', 'Coriander', 'Mint'],
      isSignature: true,
      available: true
    }
  ],
  '3': [
    {
      id: 'm8',
      name: 'The Wellington',
      description: 'Barrel-aged gin, elderflower, cucumber, topped with champagne',
      price: '$16',
      category: 'Signature Cocktails',
      isSignature: true,
      available: true
    },
    {
      id: 'm9',
      name: 'Smoked Manhattan',
      description: 'Rye whiskey, sweet vermouth, smoked with applewood',
      price: '$15',
      category: 'Classic Cocktails',
      isSignature: true,
      available: true
    },
    {
      id: 'm10',
      name: 'Chardonnay Flight',
      description: 'Three premium chardonnays from around the world',
      price: '$18',
      category: 'Wine',
      available: true
    }
  ],
  '6': [
    {
      id: 'm11',
      name: 'Death in the Afternoon',
      description: 'Hemingway\'s favorite - absinthe and champagne. "Pour one jigger absinthe into a champagne glass. Add iced champagne until it attains the proper opalescent milkiness."',
      price: '$18',
      category: 'Famous Drunks',
      ingredients: ['Absinthe', 'Champagne'],
      isSignature: true,
      available: true
    },
    {
      id: 'm12',
      name: 'Papa Doble',
      description: 'Hemingway\'s double daiquiri - white rum, grapefruit, lime, maraschino, no sugar',
      price: '$16',
      category: 'Famous Drunks',
      ingredients: ['White Rum', 'Grapefruit', 'Lime', 'Maraschino'],
      isSignature: true,
      available: true
    },
    {
      id: 'm13',
      name: 'The Algonquin',
      description: 'Dorothy Parker\'s favorite haunt - rye whiskey, dry vermouth, pineapple juice',
      price: '$14',
      category: 'Literary Cocktails',
      ingredients: ['Rye Whiskey', 'Dry Vermouth', 'Pineapple Juice'],
      isSignature: true,
      available: true
    },
    {
      id: 'm14',
      name: 'Bee\'s Knees',
      description: 'Prohibition-era classic - gin, lemon, honey syrup. Made to mask bathtub gin.',
      price: '$13',
      category: 'Prohibition Classics',
      ingredients: ['Gin', 'Lemon', 'Honey Syrup'],
      isSignature: true,
      available: true
    },
    {
      id: 'm15',
      name: 'French 75',
      description: 'Named after WWI artillery - gin, lemon, sugar, champagne with a kick',
      price: '$15',
      category: 'Literary Cocktails',
      ingredients: ['Gin', 'Lemon', 'Sugar', 'Champagne'],
      isSignature: true,
      available: true
    },
    {
      id: 'm16',
      name: 'Sazerac',
      description: 'New Orleans original from the 1800s - rye, absinthe rinse, Peychaud\'s bitters',
      price: '$17',
      category: 'Prohibition Classics',
      ingredients: ['Rye Whiskey', 'Absinthe', 'Peychaud\'s Bitters', 'Sugar'],
      isSignature: true,
      available: true
    }
  ]
};

export const MOCK_EVENTS: Record<string, ThemedEvent[]> = {
  '1': [
    {
      id: 'e1',
      title: 'Tiki Paradise Night',
      description: 'Transport yourself to a tropical paradise with exotic cocktails, tiki decorations, and island vibes',
      theme: 'Tiki',
      drinkingTheme: 'archetypal',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
      startTime: '18:00',
      endTime: '23:00',
      image: 'https://images.unsplash.com/photo-1561564765-6c49c37e99c8?w=800&q=80',
      rsvpCount: 47,
      tags: ['Tiki', 'Tropical', 'Live Music']
    },
    {
      id: 'e2',
      title: 'Craft Cocktail Workshop',
      description: 'Learn from Marcus Chen how to make signature cocktails. Includes all materials and tastings.',
      theme: 'Educational',
      drinkingTheme: 'archetypal',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
      startTime: '19:00',
      endTime: '21:00',
      rsvpCount: 24,
      tags: ['Workshop', 'Educational', 'Cocktails']
    }
  ],
  '2': [
    {
      id: 'e3',
      title: 'Bacchanalia Revival',
      description: 'An evening of ancient Roman revelry! Wine, mead, and mulled drinks served in amphora-style vessels. Togas encouraged but not required.',
      theme: 'Ancient Rome',
      drinkingTheme: 'ancient-rome',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
      startTime: '19:00',
      endTime: '23:00',
      image: 'https://images.unsplash.com/photo-1555669784-8e8f49564142?w=800&q=80',
      rsvpCount: 67,
      tags: ['Ancient Rome', 'Wine', 'Mead', 'Historical']
    },
    {
      id: 'e3b',
      title: 'Oktoberfest Celebration',
      description: 'Authentic German beers, pretzels, bratwurst, and live music all night long!',
      theme: 'Oktoberfest',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
      startTime: '17:00',
      endTime: '22:00',
      image: 'https://images.unsplash.com/photo-1554692090-b8d076e0d5e2?w=800&q=80',
      rsvpCount: 89,
      tags: ['Oktoberfest', 'Beer', 'Food', 'Live Music']
    }
  ],
  '3': [
    {
      id: 'e4',
      title: 'Wine Down Wednesday',
      description: 'Half-price wine bottles, live jazz, and coastal sunset views',
      theme: 'Wine Night',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      startTime: '17:00',
      endTime: '21:00',
      rsvpCount: 35,
      tags: ['Wine', 'Jazz', 'Sunset']
    }
  ],
  '6': [
    {
      id: 'e5',
      title: 'Hemingway\'s Paris: A Literary Evening',
      description: 'Journey through 1920s Paris with Papa Morrison. Death in the Afternoon cocktails, readings from "A Moveable Feast," and tales of the Lost Generation.',
      theme: 'Literary History',
      drinkingTheme: 'famous-drunks',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      startTime: '19:00',
      endTime: '22:00',
      image: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80',
      rsvpCount: 52,
      tags: ['Literary', 'Hemingway', 'Historic', 'Readings']
    },
    {
      id: 'e6',
      title: 'The Algonquin Round Table',
      description: 'Dorothy Parker-Mills hosts an evening of wit, martinis, and literary banter. Bring your best bon mots and sharpest quips.',
      theme: 'Literary Salon',
      drinkingTheme: 'literary',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
      startTime: '18:30',
      endTime: '22:00',
      rsvpCount: 41,
      tags: ['Literary', 'Salon', 'Dorothy Parker', 'Martinis']
    },
    {
      id: 'e7',
      title: 'Speakeasy Saturday: Prohibition Night',
      description: 'Step back to 1925. Password required at the door. Bathtub gin, jazz music, and cocktails that made the era roar.',
      theme: 'Prohibition Era',
      drinkingTheme: 'prohibition',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      startTime: '20:00',
      endTime: '01:00',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
      rsvpCount: 78,
      tags: ['Prohibition', 'Speakeasy', 'Jazz', '1920s']
    }
  ]
};

export const MOCK_REVIEWS: Record<string, Review[]> = {
  '1': [
    {
      id: 'r1',
      userId: 'u1',
      userName: 'Alex Thompson',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      venueId: '1',
      rating: 5,
      comment: 'Marcus makes the best cocktails in the city! The Yuzu Margarita is absolutely incredible. The rooftop atmosphere during sunset is unbeatable.',
      photos: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80'],
      tags: ['Great Cocktails', 'Amazing Views', 'Expert Bartender'],
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      helpfulCount: 24
    },
    {
      id: 'r2',
      userId: 'u2',
      userName: 'Emma Davis',
      venueId: '1',
      rating: 5,
      comment: 'Perfect spot for after-work drinks. The happy hour deals are fantastic and the staff is super friendly!',
      tags: ['Great Value', 'Friendly Staff', 'Happy Hour'],
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      helpfulCount: 18
    }
  ],
  '2': [
    {
      id: 'r3',
      userId: 'u3',
      userName: 'Mike Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      venueId: '2',
      rating: 5,
      comment: 'Sofia knows everything about craft beer! She helped me discover my new favorite IPA. Great selection and even better service.',
      tags: ['Beer Expert', 'Great Selection', 'Knowledgeable Staff'],
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      helpfulCount: 31
    }
  ],
  '3': [
    {
      id: 'r4',
      userId: 'u4',
      userName: 'Sarah Martinez',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      venueId: '3',
      rating: 4,
      comment: 'Upscale and elegant. James crafted a custom cocktail based on my preferences. Pricey but worth it for special occasions.',
      tags: ['Upscale', 'Custom Drinks', 'Special Occasion'],
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      helpfulCount: 15
    }
  ]
};

export const MOCK_VENUES: Venue[] = [
  {
    id: '1',
    name: 'The Golden Hour',
    address: '123 Main St',
    neighborhood: 'Downtown',
    priceLevel: 2,
    rating: 4.5,
    reviewCount: 342,
    tags: ['Rooftop', 'Cocktails', 'Outdoor'],
    drinkingThemes: ['archetypal'],
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
      'https://images.unsplash.com/photo-1560962462-08b29cccf1ae?w=800&q=80'
    ],
    distance: 0.3,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    description: 'Elevated cocktail lounge with panoramic city views. Our award-winning mixologists craft innovative drinks using premium spirits and fresh ingredients.',
    followerCount: 1847,
    amenities: ['Rooftop', 'Outdoor Seating', 'Live Music', 'Private Events'],
    bartenders: [MOCK_BARTENDERS[0]],
    menu: MOCK_MENU_ITEMS['1'],
    events: MOCK_EVENTS['1'],
    hours: {
      monday: { start: '16:00', end: '23:00' },
      tuesday: { start: '16:00', end: '23:00' },
      wednesday: { start: '16:00', end: '23:00' },
      thursday: { start: '16:00', end: '00:00' },
      friday: { start: '16:00', end: '02:00' },
      saturday: { start: '14:00', end: '02:00' },
      sunday: { start: '14:00', end: '22:00' }
    },
    deals: [
      {
        id: 'd1',
        title: '$5 House Cocktails',
        description: 'All house cocktails and draft beers',
        type: 'cocktails',
        price: '$5',
        daysActive: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        timeRange: { start: '16:00', end: '19:00' }
      },
      {
        id: 'd2',
        title: 'Half-Price Wine',
        description: 'All wine by the glass',
        type: 'wine',
        price: '50% off',
        daysActive: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        timeRange: { start: '16:00', end: '18:00' }
      }
    ]
  },
  {
    id: '2',
    name: 'Brewmaster\'s Hideaway',
    address: '456 Elm Ave',
    neighborhood: 'Arts District',
    priceLevel: 1,
    rating: 4.7,
    reviewCount: 523,
    tags: ['Craft Beer', 'Casual', 'Games'],
    drinkingThemes: ['ancient-rome'],
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80'
    ],
    distance: 0.7,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    description: 'Neighborhood craft beer haven with 30+ rotating taps featuring local and regional breweries. Cozy atmosphere with board games. Home to Aurelius and his Ancient Rome collection.',
    followerCount: 2134,
    amenities: ['Board Games', 'Dog Friendly', 'Darts', 'Pool Table'],
    bartenders: [MOCK_BARTENDERS[1], MOCK_BARTENDERS[5]],
    menu: MOCK_MENU_ITEMS['2'],
    events: MOCK_EVENTS['2'],
    hours: {
      monday: { start: '15:00', end: '23:00' },
      tuesday: { start: '15:00', end: '23:00' },
      wednesday: { start: '15:00', end: '23:00' },
      thursday: { start: '15:00', end: '00:00' },
      friday: { start: '15:00', end: '01:00' },
      saturday: { start: '12:00', end: '01:00' },
      sunday: { start: '12:00', end: '22:00' }
    },
    deals: [
      {
        id: 'd3',
        title: '$3 Draft Beers',
        description: 'Select draft beers and appetizers',
        type: 'beer',
        price: '$3',
        daysActive: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        timeRange: { start: '15:00', end: '18:00' }
      },
      {
        id: 'd4',
        title: 'Taco Tuesday',
        description: '$2 tacos with drink purchase',
        type: 'food',
        price: '$2',
        daysActive: ['tuesday'],
        timeRange: { start: '15:00', end: '20:00' }
      }
    ]
  },
  {
    id: '3',
    name: 'Sunset Lounge',
    address: '789 Beach Blvd',
    neighborhood: 'Waterfront',
    priceLevel: 3,
    rating: 4.3,
    reviewCount: 287,
    tags: ['Upscale', 'Ocean View', 'Live Music'],
    drinkingThemes: ['prohibition'],
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80',
      'https://images.unsplash.com/photo-1509669803555-fd5dbb783b5f?w=800&q=80'
    ],
    distance: 1.2,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    description: 'Sophisticated waterfront lounge with breathtaking ocean views. Premium wines, craft cocktails, and live jazz every Friday and Saturday.',
    followerCount: 1456,
    amenities: ['Ocean View', 'Live Music', 'Valet Parking', 'Dress Code'],
    bartenders: [MOCK_BARTENDERS[2]],
    menu: MOCK_MENU_ITEMS['3'],
    events: MOCK_EVENTS['3'],
    hours: {
      monday: null,
      tuesday: { start: '17:00', end: '23:00' },
      wednesday: { start: '17:00', end: '23:00' },
      thursday: { start: '17:00', end: '00:00' },
      friday: { start: '17:00', end: '01:00' },
      saturday: { start: '17:00', end: '01:00' },
      sunday: { start: '17:00', end: '22:00' }
    },
    deals: [
      {
        id: 'd5',
        title: 'Wine Down Wednesday',
        description: '$6 select wines and small plates',
        type: 'wine',
        price: '$6',
        daysActive: ['wednesday'],
        timeRange: { start: '17:00', end: '20:00' }
      }
    ]
  },
  {
    id: '4',
    name: 'The Local Tap',
    address: '321 Oak Street',
    neighborhood: 'University District',
    priceLevel: 1,
    rating: 4.6,
    reviewCount: 612,
    tags: ['Sports Bar', 'Wings', 'Beer Garden'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    distance: 0.5,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    description: 'Classic sports bar with outdoor beer garden. Watch the game on our 20+ screens while enjoying wings and cold beer.',
    followerCount: 3241,
    amenities: ['Beer Garden', 'Sports TVs', 'Outdoor Games', 'Group Friendly'],
    deals: [
      {
        id: 'd6',
        title: 'All Day Happy Hour',
        description: '$4 select beers and well drinks',
        type: 'all',
        price: '$4',
        daysActive: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        timeRange: { start: '11:00', end: '19:00' }
      },
      {
        id: 'd7',
        title: 'Wing Wednesday',
        description: '50¢ wings with any drink',
        type: 'food',
        price: '50¢',
        daysActive: ['wednesday'],
        timeRange: { start: '16:00', end: '22:00' }
      }
    ]
  },
  {
    id: '5',
    name: 'Verde Garden Bar',
    address: '555 Park Lane',
    neighborhood: 'Midtown',
    priceLevel: 2,
    rating: 4.4,
    reviewCount: 198,
    tags: ['Garden Patio', 'Farm-to-Table', 'Cocktails'],
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
    distance: 0.9,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    description: 'Lush garden oasis in the heart of the city. Farm-to-table cocktails made with fresh herbs from our garden.',
    followerCount: 987,
    amenities: ['Garden Patio', 'Fresh Ingredients', 'Pet Friendly', 'Brunch'],
    deals: [
      {
        id: 'd8',
        title: 'Garden Hour',
        description: '$7 craft cocktails and $5 small bites',
        type: 'cocktails',
        price: '$7',
        daysActive: ['tuesday', 'wednesday', 'thursday', 'friday'],
        timeRange: { start: '16:00', end: '18:30' }
      }
    ]
  },
  {
    id: '6',
    name: 'Bourbon & Branch',
    address: '888 Whiskey Row',
    neighborhood: 'Historic District',
    priceLevel: 3,
    rating: 4.8,
    reviewCount: 456,
    tags: ['Whiskey Bar', 'Speakeasy', 'Craft Cocktails', 'Literary'],
    drinkingThemes: ['famous-drunks', 'literary', 'prohibition'],
    image: 'https://images.unsplash.com/photo-1509669803555-fd5dbb783b5f?w=800&q=80',
    distance: 1.5,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    description: 'Hidden speakeasy-style whiskey bar with over 200 bourbon selections. Prohibition-era ambiance, literary heritage, and cocktails favored by famous writers. Papa Morrison and Dorothy Parker-Mills craft legendary drinks with legendary stories.',
    followerCount: 1654,
    amenities: ['Speakeasy', 'Whiskey Collection', 'Reservations', 'Cigar Lounge', 'Book Library'],
    bartenders: [MOCK_BARTENDERS[3], MOCK_BARTENDERS[4]],
    menu: MOCK_MENU_ITEMS['6'],
    events: MOCK_EVENTS['6'],
    hours: {
      monday: null,
      tuesday: { start: '18:00', end: '00:00' },
      wednesday: { start: '18:00', end: '00:00' },
      thursday: { start: '18:00', end: '01:00' },
      friday: { start: '18:00', end: '02:00' },
      saturday: { start: '18:00', end: '02:00' },
      sunday: { start: '18:00', end: '23:00' }
    },
    deals: [
      {
        id: 'd9',
        title: 'Literary Hour',
        description: '$8 select bourbons and classic literary cocktails',
        type: 'cocktails',
        price: '$8',
        daysActive: ['thursday', 'friday'],
        timeRange: { start: '18:00', end: '20:00' }
      }
    ]
  }
];

import { SocialThread, ThreadMessage, CalendarEvent } from './types';

export const MOCK_SOCIAL_THREADS: SocialThread[] = [
  {
    id: 't1',
    type: 'live',
    title: 'Who\'s hitting The Golden Hour tonight?',
    description: 'Marcus is doing a special tasting menu for happy hour. Let\'s get a group together!',
    author: {
      id: 'u1',
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      role: 'the-drinker'
    },
    venueId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    lastActivity: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    participantCount: 8,
    messageCount: 23,
    tags: ['Golden Hour', 'Tonight', 'Group'],
    isActive: true,
    drinkingTheme: 'archetypal'
  },
  {
    id: 't2',
    type: 'live',
    title: 'Hemingway Night - Who\'s in?',
    description: 'Papa Morrison is hosting a Hemingway literary evening next week at Bourbon & Branch. Looking for fellow literature lovers!',
    author: {
      id: 'b4',
      name: 'Ernest "Papa" Morrison',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
      role: 'the-pourer'
    },
    venueId: '6',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    lastActivity: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    participantCount: 15,
    messageCount: 47,
    tags: ['Hemingway', 'Literary', 'Event Planning'],
    isActive: true,
    drinkingTheme: 'famous-drunks'
  },
  {
    id: 't3',
    type: 'offline',
    title: 'Best Prohibition-Era Cocktails Discussion',
    description: 'What\'s your favorite pre-prohibition cocktail? Let\'s share recipes and stories!',
    author: {
      id: 'u3',
      name: 'Sarah Martinez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      role: 'the-drinker'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    participantCount: 22,
    messageCount: 89,
    tags: ['Prohibition', 'Recipes', 'Discussion'],
    isActive: false,
    drinkingTheme: 'prohibition'
  },
  {
    id: 't4',
    type: 'live',
    title: 'Ancient Roman Wine Tasting - Tomorrow!',
    description: 'Aurelius is hosting a Roman wine symposium tomorrow. We\'ll taste Falernian-style wines and learn about ancient drinking culture. Limited spots!',
    author: {
      id: 'b6',
      name: 'Aurelius Vinifera',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
      role: 'the-pourer'
    },
    venueId: '2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    lastActivity: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    participantCount: 12,
    messageCount: 31,
    tags: ['Ancient Rome', 'Wine', 'Tasting'],
    isActive: true,
    drinkingTheme: 'ancient-rome'
  },
  {
    id: 't5',
    type: 'offline',
    title: 'Literary Cocktails: From Page to Glass',
    description: 'Discussing cocktails mentioned in classic literature. From James Bond\'s martini to Gatsby\'s champagne towers.',
    author: {
      id: 'b5',
      name: 'Dorothy Parker-Mills',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      role: 'the-pourer'
    },
    venueId: '6',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    participantCount: 34,
    messageCount: 127,
    tags: ['Literary', 'Books', 'Cocktails'],
    isActive: false,
    drinkingTheme: 'literary'
  }
];

export const MOCK_THREAD_MESSAGES: Record<string, ThreadMessage[]> = {
  't1': [
    {
      id: 'msg1',
      threadId: 't1',
      userId: 'u1',
      userName: 'Alex Thompson',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      userRole: 'the-drinker',
      content: 'Marcus mentioned he\'s doing a special yuzu cocktail tonight. Who wants to join?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      reactions: [{ emoji: '🍹', count: 5, users: ['u2', 'u3', 'u4', 'u5', 'u6'] }],
    },
    {
      id: 'msg2',
      threadId: 't1',
      userId: 'u2',
      userName: 'Emma Davis',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      userRole: 'the-drinker',
      content: 'I\'m in! What time are we meeting?',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      reactions: [{ emoji: '👍', count: 3, users: ['u1', 'u3', 'u4'] }],
    },
    {
      id: 'msg3',
      threadId: 't1',
      userId: 'b1',
      userName: 'Marcus Chen',
      userAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80',
      userRole: 'the-pourer',
      content: 'Looking forward to seeing you all! I\'ll have the special tasting menu ready by 6pm. 🥃',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      reactions: [{ emoji: '🔥', count: 8, users: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'] }],
    }
  ],
  't2': [
    {
      id: 'msg4',
      threadId: 't2',
      userId: 'b4',
      userName: 'Ernest "Papa" Morrison',
      userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
      userRole: 'the-pourer',
      content: 'Next Thursday at 7pm. We\'ll be reading passages from "A Moveable Feast" and I\'ll mix up proper Death in the Afternoon cocktails. Password at the door: "Fiesta".',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      reactions: [{ emoji: '📚', count: 12, users: ['u1', 'u2', 'u3'] }],
    }
  ]
};

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ce1',
    title: 'Daily Happy Hour',
    description: 'Classic happy hour with discounted drinks and appetizers',
    venueId: '1',
    venueName: 'The Golden Hour',
    date: new Date().toISOString(),
    startTime: '16:00',
    endTime: '19:00',
    type: 'happy-hour',
    rsvpCount: 12,
    price: '$5-8',
    tags: ['Cocktails', 'Rooftop']
  },
  {
    id: 'ce2',
    title: 'Bacchanalia Revival',
    description: 'An evening of ancient Roman revelry! Wine, mead, and mulled drinks.',
    venueId: '2',
    venueName: 'Brewmaster\'s Hideaway',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    startTime: '19:00',
    endTime: '23:00',
    type: 'themed-event',
    drinkingTheme: 'ancient-rome',
    bartenderId: 'b6',
    rsvpCount: 67,
    maxCapacity: 80,
    price: '$25',
    image: 'https://images.unsplash.com/photo-1555669784-8e8f49564142?w=800&q=80',
    tags: ['Ancient Rome', 'Wine', 'Mead']
  },
  {
    id: 'ce3',
    title: 'Hemingway\'s Paris: A Literary Evening',
    description: 'Journey through 1920s Paris with Papa Morrison',
    venueId: '6',
    venueName: 'Bourbon & Branch',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    startTime: '19:00',
    endTime: '22:00',
    type: 'themed-event',
    drinkingTheme: 'famous-drunks',
    bartenderId: 'b4',
    rsvpCount: 52,
    maxCapacity: 60,
    price: '$30',
    image: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80',
    tags: ['Hemingway', 'Literary', 'Readings']
  },
  {
    id: 'ce4',
    title: 'The Algonquin Round Table',
    description: 'Dorothy Parker-Mills hosts an evening of wit and martinis',
    venueId: '6',
    venueName: 'Bourbon & Branch',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    startTime: '18:30',
    endTime: '22:00',
    type: 'themed-event',
    drinkingTheme: 'literary',
    bartenderId: 'b5',
    rsvpCount: 41,
    maxCapacity: 50,
    price: '$25',
    tags: ['Literary', 'Salon', 'Martinis']
  },
  {
    id: 'ce5',
    title: 'Speakeasy Saturday',
    description: 'Step back to 1925. Password required at the door.',
    venueId: '6',
    venueName: 'Bourbon & Branch',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    startTime: '20:00',
    endTime: '01:00',
    type: 'themed-event',
    drinkingTheme: 'prohibition',
    rsvpCount: 78,
    maxCapacity: 90,
    price: '$20',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    tags: ['Prohibition', 'Speakeasy', 'Jazz']
  }
];
