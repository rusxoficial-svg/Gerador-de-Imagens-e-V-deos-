
export enum ScenarioType {
  STUDIO_MINIMAL = 'Minimalist Studio',
  URBAN_STREET = 'Urban Streetwear',
  LUXURY_INTERIOR = 'Luxury Penthouse',
  NATURE_BEACH = 'Golden Hour Beach',
  NATURE_FOREST = 'Misty Forest',
  NEON_CYBERPUNK = 'Neon Cyberpunk',
  ABSTRACT_ART = 'Abstract Art Installation',
  MODERN_GYM = 'Modern High-End Gym',
  DESERT_DUNES = 'Sahara Desert Dunes',
  INDUSTRIAL_WAREHOUSE = 'Concrete Industrial Warehouse',
  CLASSIC_RUNWAY = 'Fashion Week Runway',
  EUROPEAN_STREET = 'Parisian Cobblestone Street',
  SNOW_MOUNTAIN = 'Snowy Mountain Peak',
  ROOFTOP_CITY = 'City Rooftop at Sunset',
  // New Sport/Street Scenarios
  CROSSFIT_BOX = 'Gritty Crossfit Box',
  BASKETBALL_COURT = 'Urban Basketball Court',
  BOXING_RING = 'Dramatic Boxing Ring',
  SUBWAY_STATION = 'Underground Subway Station',
  SKATE_PARK = 'Concrete Skate Park',
  LOCKER_ROOM = 'Sports Locker Room'
}

export enum ModelType {
  FEMALE_YOUNG = 'Young Female Adult',
  MALE_YOUNG = 'Young Male Adult',
  FEMALE_MATURE = 'Mature Female',
  MALE_MATURE = 'Mature Male',
  DIVERSE_GROUP = 'Group of Diverse Models',
  MANNEQUIN = 'Ghost Mannequin'
}

export enum LightingStyle {
  SOFT_BOX = 'Soft Box Studio Lighting',
  HARD_FLASH = 'High Contrast Flash',
  NATURAL_SUNLIGHT = 'Natural Sunlight',
  DRAMATIC_RIM = 'Dramatic Rim Lighting',
  CINEMATIC = 'Cinematic Color Grading',
  // New Lighting Options
  GOLDEN_HOUR = 'Warm Golden Hour Sunset Lighting',
  STUDIO_HIGH_KEY = 'High Key Studio Lighting (Bright White Background)',
  STUDIO_LOW_KEY = 'Low Key Studio Lighting (Dark Moody Background)',
  NEON_GEL = 'Neon Colored Gel Lighting (Blue and Pink)',
  REMBRANDT = 'Classic Rembrandt Portrait Lighting'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '16:9'
}

export enum ClothingView {
  FRONT = 'Front View',
  BACK = 'Back View'
}

export enum VideoMovement {
  SLOW_TURN = 'Slow 360 Turn',
  WALKING = 'Catwalk Forward',
  BREEZE = 'Fabric in Wind',
  POSE_SHIFT = 'Subtle Pose Shift',
  DETAIL_ZOOM = 'Slow Zoom In'
}

export interface GenerationSettings {
  scenario: ScenarioType;
  modelType: ModelType;
  lighting: LightingStyle;
  aspectRatio: AspectRatio;
  clothingView: ClothingView;
  customPrompt: string;
  seed: number;
  preserveModel: boolean;
}

export interface ImageAsset {
  id: string;
  data: string; // Base64
  mimeType: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  generatedImage: string; // Base64 result
  generatedVideo: string | null; // URL or null
  sourceImage: string; // Base64 source
  settings: GenerationSettings;
}