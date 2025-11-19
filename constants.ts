
import { ScenarioType, ModelType, LightingStyle, AspectRatio, ClothingView, VideoMovement } from './types';

export const SCENARIO_OPTIONS = [
  { value: ScenarioType.STUDIO_MINIMAL, label: 'Estúdio: Minimalista Branco' },
  { value: ScenarioType.URBAN_STREET, label: 'Externo: Rua Urbana' },
  { value: ScenarioType.LUXURY_INTERIOR, label: 'Interno: Luxo' },
  { value: ScenarioType.MODERN_GYM, label: 'Interno: Academia Moderna' },
  { value: ScenarioType.NATURE_BEACH, label: 'Externo: Praia (Golden Hour)' },
  { value: ScenarioType.NATURE_FOREST, label: 'Externo: Floresta' },
  { value: ScenarioType.NEON_CYBERPUNK, label: 'Criativo: Noite Neon' },
  { value: ScenarioType.ABSTRACT_ART, label: 'Criativo: Arte Abstrata' },
];

export const MODEL_OPTIONS = [
  { value: ModelType.FEMALE_YOUNG, label: 'Modelo Feminina' },
  { value: ModelType.MALE_YOUNG, label: 'Modelo Masculino' },
  { value: ModelType.FEMALE_MATURE, label: 'Modelo Feminina Madura' },
  { value: ModelType.MALE_MATURE, label: 'Modelo Masculino Maduro' },
  { value: ModelType.DIVERSE_GROUP, label: 'Grupo de Modelos' },
  { value: ModelType.MANNEQUIN, label: 'Manequim Invisível (Ghost)' },
];

export const LIGHTING_OPTIONS = [
  { value: LightingStyle.SOFT_BOX, label: 'Estúdio Suave (Soft Box)' },
  { value: LightingStyle.NATURAL_SUNLIGHT, label: 'Luz Natural do Dia' },
  { value: LightingStyle.HARD_FLASH, label: 'Flash de Alto Contraste' },
  { value: LightingStyle.DRAMATIC_RIM, label: 'Dramático / Moody' },
  { value: LightingStyle.CINEMATIC, label: 'Cinematográfico' },
];

export const RATIO_OPTIONS = [
  { value: AspectRatio.SQUARE, label: 'Quadrado (1:1) - Instagram' },
  { value: AspectRatio.PORTRAIT, label: 'Retrato (3:4) - Lookbook' },
  { value: AspectRatio.LANDSCAPE, label: 'Paisagem (16:9) - Banner Web' },
];

export const VIEW_OPTIONS = [
  { value: ClothingView.FRONT, label: 'Frente da Peça' },
  { value: ClothingView.BACK, label: 'Costas da Peça' },
];

export const VIDEO_MOVEMENT_OPTIONS = [
  { 
    value: VideoMovement.SLOW_TURN, 
    label: 'Giro Lento (360°)',
    prompt: 'Cinematic fashion video. The model slowly turns 360 degrees to showcase the outfit from all angles. Smooth motion, professional studio lighting.'
  },
  { 
    value: VideoMovement.WALKING, 
    label: 'Caminhada (Catwalk)',
    prompt: 'Cinematic fashion video. The model walks confidently towards the camera like on a runway. Elegant stride, fabric moving naturally, high fashion attitude.'
  },
  { 
    value: VideoMovement.BREEZE, 
    label: 'Brisa no Tecido',
    prompt: 'Cinematic fashion video. The model stands still while a gentle wind blows the fabric of the clothing. Focus on the texture and movement of the material. Soft, ethereal vibe.'
  },
  { 
    value: VideoMovement.POSE_SHIFT, 
    label: 'Mudança de Pose (Editorial)',
    prompt: 'Cinematic fashion video. The model subtly shifts between two elegant poses. Editorial style, slow and controlled movement, intense gaze.'
  },
  { 
    value: VideoMovement.DETAIL_ZOOM, 
    label: 'Zoom de Detalhe',
    prompt: 'Cinematic fashion video. The camera slowly zooms in on the details of the clothing. High fidelity, showcasing fabric texture and design elements.'
  }
];
