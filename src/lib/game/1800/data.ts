export const CATEGORIES = {
  Cosmetic: 'cosmetic',
  General: 'general',
  Housing: 'housing',
  Island: 'island',
  Production: 'production',
} as const

export const REGIONS_1800 = {
  Arctic: 'arctic',
  Enbesa: 'enbesa',
  NewWorld: 'new world',
  OldWorld: 'old world',
} as const

export const CAPITALS_1800 = {
  Crown: 'crown falls',
  Manola: 'manola',
} as const

// all chatgpt generated could be errors

const FARMERS = [
  'Wood',
  'Timber',
  'Fish',
  'Potato',
  'Schnapps',
  'Wool',
  'Work Clothes',
]

const WORKERS = [
  'Clay',
  'Bricks',
  'Pigs',
  'Sausages',
  'Grain',
  'Flour',
  'Bread',
  'Sails',
  'Coal',
  'Iron',
  'Steel',
  'Steel Beams',
  'Tallow',
  'Soap',
  'Weapons',
  'Hops',
  'Malt',
  'Beer',
]

const ARTISANS = [
  'Sand',
  'Glass',
  'Windows',
  'Beef',
  'Red Peppers',
  'Goulash',
  'Canned Food',
  'Sewing Machines',
  'Hunting Cabin',
  'Fur Coats',
]

const ENGINEERS = [
  'Cement',
  'Reinforced Concrete',
  'Copper',
  'Zinc',
  'Brass',
  'Glasses',
  'Dynamite',
  'Saltpetre',
  'Advanced Weapons',
  'Penny Farthings',
  'Steam Motors',
  'Gold',
  'Pocket Watches',
  'Filaments',
  'Light Bulbs',
]

const TOURISTS = ['Jam', 'Shampoo', 'Lemonade', 'Souvenirs']

const INVESTORS = [
  'Wine',
  'Champagne',
  'Jewellery',
  'Wood Veneers',
  'Gramophones',
  'Chassis',
  'Steam Carriages',
]
const SCHOLARS = [
  'Leather Boots',
  'Tailored Suits',
  'Telephones',
  'Advanced Coffee',
  'Advanced Rum',
  'Advanced Cotton Fabric',
]
const SKYSCRAPERS = [
  'Elevators',
  'Chewing Gum',
  'Biscuits',
  'Cognac',
  'Ethanol',
  'Celluloid',
  'Lacquer',
  'Typewriters',
  'Billiard Tables',
  'Violins',
  'Toys',
]

export const OLD_WORLD_GOODS = [
  ...FARMERS,
  ...WORKERS,
  ...ARTISANS,
  ...ENGINEERS,
  ...INVESTORS,
  ...TOURISTS,
  ...SCHOLARS,
  ...SKYSCRAPERS,
] as const

const JORNALEROS = [
  'Plantains',
  'Fish Oil',
  'Sugar Cane',
  'Fried Plantains',
  'Rum',
  'Alpaca Wool',
  'Ponchos',
  'Cotton',
  'Cotton Fabric',
  'Caoutchouc',
  'Pearls',
]

const OBREROS = [
  'Corn',
  'Tortillas',
  'Coffee Beans',
  'Coffee',
  'Felt',
  'Bowler Hats',
  'Tobacco',
  'Cigars',
  'Sugar',
  'Cocoa',
  'Chocolate',
  'Gold Ore',
  'Bauxite',
  'Aluminium Profiles',
  'Dung',
  'Helium',
]

const ARTISTAS = [
  'Nandu Leather',
  'Soccer Balls',
  'Citrus',
  'Herbs',
  'Mezcal',
  'Calamari',
  'Jalea',
  'Milk',
  'Ice Cream',
  'Fire Extinguishers',
  'Fire Department',
  'Orchid',
  'Ethanol',
  'Coconut Oil',
  'Perfumes',
  'Minerals',
  'Pigments',
  'Samba School',
  'Nandu Feathers',
  'Costumes',
  'Camphor Wax',
  'Celluloid',
  'Police Headquarters',
  'Motor',
  'Electric Cables',
  'Fans',
  'Film Reel',
  'Medicine',
  'Cinema',
  'City Hospital',
  'Scooter',
  'Police Equipment',
]
export const NEW_WORLD_GOODS = [...JORNALEROS, ...OBREROS, ...ARTISTAS]

const EXPLORERS = [
  'Whale Oil',
  'Caribou Meat',
  'Pemmican',
  'Seal Skin',
  'Goose Feathers',
  'Sleeping Bags',
  'Oil Lamps',
]

const TECHNICIANS = [
  'Bear Fur',
  'Parkas',
  'Sleds',
  'Huskies',
  'Husky Sleds',
  'Arctic Gas',
]

export const ARCTIC_GOODS = [...EXPLORERS, ...TECHNICIANS]

const SHEPHERDS = [
  'Wanza Timber',
  'Goat Milk',
  'Finery',
  'Dried Meat',
  'Hibiscus Tea',
  'Sanga Cow',
  'Linseed',
  'Linen',
]

const ELDERS = [
  'Teff',
  'Mud Bricks',
  'Ceramics',
  'Tapestries',
  'Seafood Stew',
  'Clay Pipes',
  'Illuminated Script',
  'Lanterns',
]

export const ENBESA_GOODS = [...SHEPHERDS, ...ELDERS]
