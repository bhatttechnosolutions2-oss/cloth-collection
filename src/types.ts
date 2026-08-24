export interface FashionItem {
  id: string;
  title: string;
  category: 'ethnic' | 'western' | 'casual' | 'dress-materials' | 'occasion' | 'trending';
  categoryLabel: string;
  tag: string; // 'NEW ARRIVAL' | 'EVERYDAY EDIT' | 'ETHNIC EDIT' | 'WEEKEND STYLE' | 'OCCASION EDIT' | 'JUST IN' | 'TRENDING' | 'NEW SEASON' | 'MOST LOVED'
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
