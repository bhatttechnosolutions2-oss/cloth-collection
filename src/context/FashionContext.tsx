import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FashionItem, CollectionCategory, InstagramPost } from '../types';
import {
  NEW_ARRIVALS as DEFAULT_NEW_ARRIVALS,
  CATEGORIES as DEFAULT_CATEGORIES,
  EDITORIAL_GALLERY as DEFAULT_EDITORIAL,
  INSTAGRAM_POSTS as DEFAULT_IG_POSTS,
} from '../data/fashionData';

interface FashionContextType {
  newArrivals: FashionItem[];
  categories: CollectionCategory[];
  editorialGallery: FashionItem[];
  instagramPosts: InstagramPost[];
  heroImage: string;
  addCustomItem: (item: Omit<FashionItem, 'id'>, placement: 'new-arrival' | 'editorial' | 'instagram' | 'all') => void;
  updateCategoryPhoto: (categoryId: string, newImageUrl: string) => void;
  updateHeroPhoto: (newImageUrl: string) => void;
  updateInstagramPostPhoto: (postId: string, newImageUrl: string, newCaption?: string) => void;
  replaceItemPhoto: (itemId: string, newImageUrl: string) => void;
  deleteCustomItem: (itemId: string) => void;
  resetToDefaults: () => void;
  isManagerOpen: boolean;
  setIsManagerOpen: (open: boolean) => void;
}

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=85&w=2000&auto=format&fit=crop';

const STORAGE_KEY_ITEMS = 'clothes_collection_items_v1';
const STORAGE_KEY_CATEGORIES = 'clothes_collection_cats_v1';
const STORAGE_KEY_EDITORIAL = 'clothes_collection_editorial_v1';
const STORAGE_KEY_IG = 'clothes_collection_ig_v1';
const STORAGE_KEY_HERO = 'clothes_collection_hero_v1';

const FashionContext = createContext<FashionContextType | undefined>(undefined);

export const FashionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [newArrivals, setNewArrivals] = useState<FashionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved items', e);
      }
    }
    return DEFAULT_NEW_ARRIVALS;
  });

  const [categories, setCategories] = useState<CollectionCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved categories', e);
      }
    }
    return DEFAULT_CATEGORIES;
  });

  const [editorialGallery, setEditorialGallery] = useState<FashionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EDITORIAL);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved editorial', e);
      }
    }
    return DEFAULT_EDITORIAL;
  });

  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_IG);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved ig posts', e);
      }
    }
    return DEFAULT_IG_POSTS;
  });

  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_HERO) || DEFAULT_HERO_IMAGE;
  });

  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(newArrivals));
  }, [newArrivals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EDITORIAL, JSON.stringify(editorialGallery));
  }, [editorialGallery]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_IG, JSON.stringify(instagramPosts));
  }, [instagramPosts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HERO, heroImage);
  }, [heroImage]);

  const addCustomItem = (
    itemData: Omit<FashionItem, 'id'>,
    placement: 'new-arrival' | 'editorial' | 'instagram' | 'all'
  ) => {
    const newItem: FashionItem = {
      ...itemData,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    if (placement === 'new-arrival' || placement === 'all') {
      setNewArrivals((prev) => [newItem, ...prev]);
    }
    if (placement === 'editorial' || placement === 'all') {
      setEditorialGallery((prev) => [newItem, ...prev]);
    }
    if (placement === 'instagram') {
      const newPost: InstagramPost = {
        id: `custom-ig-${Date.now()}`,
        image: newItem.image,
        likes: Math.floor(Math.random() * 400) + 600,
        comments: Math.floor(Math.random() * 40) + 20,
        caption: `${newItem.title} - Now in store at Clothes Collection, Sadar Bazar, Agra.`,
        tag: '#ClothCollectionAgra',
      };
      setInstagramPosts((prev) => [newPost, ...prev.slice(0, 5)]);
    }
  };

  const updateCategoryPhoto = (categoryId: string, newImageUrl: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, image: newImageUrl } : c))
    );
  };

  const updateHeroPhoto = (newImageUrl: string) => {
    setHeroImage(newImageUrl);
  };

  const updateInstagramPostPhoto = (postId: string, newImageUrl: string, newCaption?: string) => {
    setInstagramPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              image: newImageUrl,
              ...(newCaption ? { caption: newCaption } : {}),
            }
          : p
      )
    );
  };

  const replaceItemPhoto = (itemId: string, newImageUrl: string) => {
    setNewArrivals((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, image: newImageUrl } : it))
    );
    setEditorialGallery((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, image: newImageUrl } : it))
    );
  };

  const deleteCustomItem = (itemId: string) => {
    setNewArrivals((prev) => prev.filter((it) => it.id !== itemId));
    setEditorialGallery((prev) => prev.filter((it) => it.id !== itemId));
  };

  const resetToDefaults = () => {
    setNewArrivals(DEFAULT_NEW_ARRIVALS);
    setCategories(DEFAULT_CATEGORIES);
    setEditorialGallery(DEFAULT_EDITORIAL);
    setInstagramPosts(DEFAULT_IG_POSTS);
    setHeroImage(DEFAULT_HERO_IMAGE);
    localStorage.removeItem(STORAGE_KEY_ITEMS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_EDITORIAL);
    localStorage.removeItem(STORAGE_KEY_IG);
    localStorage.removeItem(STORAGE_KEY_HERO);
  };

  return (
    <FashionContext.Provider
      value={{
        newArrivals,
        categories,
        editorialGallery,
        instagramPosts,
        heroImage,
        addCustomItem,
        updateCategoryPhoto,
        updateHeroPhoto,
        updateInstagramPostPhoto,
        replaceItemPhoto,
        deleteCustomItem,
        resetToDefaults,
        isManagerOpen,
        setIsManagerOpen,
      }}
    >
      {children}
    </FashionContext.Provider>
  );
};

export const useFashion = (): FashionContextType => {
  const context = useContext(FashionContext);
  if (!context) {
    throw new Error('useFashion must be used within a FashionProvider');
  }
  return context;
};
