
export enum AppTab {
  HOME = 'home',
  ANALYSIS = 'analysis',
  PROFILE = 'profile',
  STYLE_DETAIL = 'style_detail'
}

export interface Recommendation {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  badge?: string;
  subCategory?: string; // e.g., 'Wedding', 'Shoes', 'Face'
}

export interface SkinHealth {
  overallHealth: string;
  oiliness: string;
  spots: string;
  wrinkles: string;
  darkCircles: string;
  healthScore?: number;
}

export interface PhysicalAttributes {
  estimatedAge: string;
  skinColor: string;
  eyeColor: string;
  hairColor: string;
  gender?: 'male' | 'female' | 'other';
  height?: string;
  weight?: string;
}

export interface StyleAnalysis {
  vibe: string;
  faceShape: string;
  bodyType: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    shades: string[];
  };
  skinHealth: SkinHealth;
  physicalAttributes: PhysicalAttributes;
  // Dynamic categories keyed by sub-category name
  recommendations: {
    hair: Record<string, Recommendation[]>;
    outfit: Record<string, Recommendation[]>;
    access: Record<string, Recommendation[]>;
    tattoo: Record<string, Recommendation[]>;
    diet: Record<string, Recommendation[]>;
  };
  occasionTips: string[];
}

export interface AnalysisState {
  status: 'idle' | 'previewing' | 'uploading' | 'scanning' | 'analyzing' | 'completed' | 'error';
  image: string | null;
  result: StyleAnalysis | null;
  error?: string;
}

export interface StyleDeal {
  id: string;
  title: string;
  price: string;
  discount: string;
  image: string;
  brandIcon: string;
}
