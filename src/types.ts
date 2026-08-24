export interface FashionItem {
  id: string;
  title: string;
  category: 'tops' | 'jeans' | 'kurtis' | 'bottoms' | 'ethnic' | 'western' | 'casual' | 'dress-materials' | 'occasion' | 'trending';
  categoryLabel: string;
  tag: string; // 'NEW ARRIVAL' | 'EVERYDAY EDIT' | 'ETHNIC EDIT' | 'WEEKEND STYLE' | 'OCCASION EDIT' | 'JUST IN' | 'TRENDING' | 'NEW SEASON' | 'MOST LOVED' | 'INSTAGRAM IMPORT' | 'BESTSELLER'
  image: string;
  description: string;
  details: {
    fabric: string;
    fit: string;
    occasion: string;
    sizes: string[];
    care: string;
  };
  isFeaturedWeekly?: boolean;
  aspectRatio?: 'tall' | 'square' | 'wide';
  instagramUrl?: string;
}

export interface CollectionCategory {
  id: string;
  title: string;
  subtitle: string;
  itemCount: string;
  image: string;
  categoryKey: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  legacyNote: string;
  tagline: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  review: string;
  verified: boolean;
  context: string;
}

export interface InstagramPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
  caption: string;
  tag: string;
}

export interface MediaLibraryItem {
  id: string;
  url: string;
  source: 'instagram' | 'upload' | 'url' | 'preset';
  title: string;
  instagramUrl?: string;
  importedAt: string;
  aspectRatio?: 'tall' | 'square' | 'wide';
}

export type WebsiteSlot =
  | { type: 'hero' }
  | { type: 'category'; categoryId: string; categoryTitle?: string }
  | { type: 'newArrival'; category: 'tops' | 'jeans' | 'kurtis' | 'bottoms'; title?: string; fabric?: string; tag?: string }
  | { type: 'replaceNewArrival'; itemId: string }
  | { type: 'instagramPost'; postId: string; caption?: string }
  | { type: 'editorial'; itemId?: string };
