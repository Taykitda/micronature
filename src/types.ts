export interface Plant {
  id: string;
  name: string;
  latinName: string;
  status: 'optimal' | 'warning';
  thumbnail: string;
  soilMoisture: number; // percentage
  soilStatus: string; // e.g., "20% (过低)"
  lightLevel: number; // percentage
  lightStatus: string; // e.g., "适宜"
  category: string;
}

export interface CareTask {
  id: string;
  plantId: string;
  taskName: string;
  plantName: string;
  category: 'watering' | 'fertilizer' | 'light' | 'pruning';
  done: boolean;
  description: string;
  thumbnail: string;
}

export interface EncyclopediaPlant {
  id: string;
  name: string;
  latinName: string;
  category: string;
  lightRequirement: 'direct' | 'diffuse' | 'low';
  toxicity: 'safe' | 'toxic';
  difficulty: 'easy' | 'medium' | 'hard';
  thumbnail: string;
  waterRequirement: string; // e.g. "保持土壤微湿"
  description: string;
  careSecrets?: string;
}

export interface CommunityPost {
  id: string;
  title?: string;
  content: string;
  image?: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  likes: number;
  commentsCount: number;
  tag: string;
  hasLiked?: boolean;
}

export interface LandscapingMaterial {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
}

export interface InspirationItem {
  id: string;
  title: string;
  author: string;
  image: string;
}
