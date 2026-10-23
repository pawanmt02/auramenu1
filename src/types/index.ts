export type DishCategory = 'All' | 'Starters' | 'Platters' | 'Main Course' | 'Desserts' | 'Street Food Legend' | 'Scanned Creations';

export type DietaryTag = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Jain-Friendly' | 'Halal' | 'Dairy-Free' | 'Street Gourmet' | 'Vegan Option' | 'Handcrafted' | 'Custom';

export type ARModelType = 
  | 'mysore_bonda'
  | 'vada_pav'
  | 'maddur_vada'
  | 'paneer_pakoda'
  | 'south_thali'
  | 'hyderabadi_biryani'
  | 'tandoori_platter'
  | 'gulab_jamun'
  | 'masala_dosa';

export interface NutritionInfo {
  protein: number; // in grams
  carbs: number;   // in grams
  fats: number;    // in grams
  fiber: number;   // in grams
  sodium: number;  // in mg
}

export interface DishDimensions {
  diameterCm: number;
  heightCm: number;
}

export interface Dish {
  id: string;
  name: string;
  nativeName: string;
  subtitle: string;
  origin: string;
  category: DishCategory;
  spiceLevel: 1 | 2 | 3 | 4 | 5;
  calories: number;
  prepTime: string;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  story: string;
  ingredients: string[];
  allergens: string[];
  dietary: DietaryTag[];
  arModelType: ARModelType;
  accentColor: string;
  gradient: string;
  tags: string[];
  portion: string;
  steamIntensity: number;
  textureHighlights: string[];
  pairings: string[];
  nutrition: NutritionInfo;
  servingTemperature: string;
  physicalDimensions: DishDimensions;
  chefTip: string;
  audioAromaProfile: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: 'Guest' | 'Foodie Explorer' | 'Culinary Connoisseur' | 'Chef Patron';
  avatar: string;
  dietaryPreferences: DietaryTag[];
  favoriteOrigins: string[];
}

export interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
}

export interface DishCustomization {
  spiceAdjustment: number; // -1 to +2
  extraDips: string[];
  portionMultiplier: number; // 0.5 to 2.0
  notes: string;
}

export interface SavedExperience {
  id: string;
  dishId: string;
  savedAt: string;
  customizations: DishCustomization;
  isFavorite: boolean;
  notes?: string;
}

export type LightingMode = 'warm-candle' | 'studio' | 'daylight' | 'lounge';

export type ARVisionMode = 'standard' | 'thermal-infrared' | 'exploded-anatomy' | 'wireframe-lidar';

export interface ARSettings {
  planeDetectionMode: 'auto' | 'manual';
  lightingMode: LightingMode;
  shadowQuality: 'high' | 'medium' | 'soft';
  hapticsEnabled: boolean;
  steamEffectEnabled: boolean;
  audioGuidanceEnabled: boolean;
  gyroParallaxEnabled: boolean;
  surfaceSensitivity: number;
  scaleOverride: number;
  renderFidelity: 'ultra' | 'high' | 'balanced';
}

export type AppPage = 'auth' | 'library' | 'webxr' | 'saved';
