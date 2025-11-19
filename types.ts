
export enum ScenarioType {
  STUDIO_MINIMAL = 'Minimalist Studio',
  URBAN_STREET = 'Urban Streetwear',
  LUXURY_INTERIOR = 'Luxury Penthouse',
  NATURE_BEACH = 'Golden Hour Beach',
  NATURE_FOREST = 'Misty Forest',
  NEON_CYBERPUNK = 'Neon Cyberpunk',
  ABSTRACT_ART = 'Abstract Art Installation',
  MODERN_GYM = 'Modern High-End Gym'
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
  CINEMATIC = 'Cinematic Color Grading'
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
