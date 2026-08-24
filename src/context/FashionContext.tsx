import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FashionItem, CollectionCategory, InstagramPost } from '../types';
import {
  NEW_ARRIVALS as DEFAULT_NEW_ARRIVALS,
  CATEGORIES as DEFAULT_CATEGORIES,
  EDITORIAL_GALLERY as DEFAULT_EDITORIAL,
  INSTAGRAM_POSTS as DEFAULT_IG_POSTS,
} from '../data/fashionData';
import { db, doc, setDoc, onSnapshot } from '../lib/firebase';

interface FashionContextType {
  newArrivals: FashionItem[];
  categories: CollectionCategory[];
  editorialGallery: FashionItem[];
  instagramPosts: InstagramPost[];
  heroImage: string;
  isFirebaseLive: boolean;
  isSyncing: boolean;
  lastSyncedTime: string | null;
  // Section-wise mutation actions
  addCustomItem: (item: Omit<FashionItem, 'id'>, placement: 'new-arrival' | 'editorial' | 'instagram' | 'all') => Promise<void>;
  updateCategoryPhoto: (categoryId: string, newImageUrl: string) => Promise<void>;
  updateHeroPhoto: (newImageUrl: string) => Promise<void>;
  updateInstagramPostPhoto: (postId: string, newImageUrl: string, newCaption?: string) => Promise<void>;
  replaceItemPhoto: (itemId: string, newImageUrl: string) => Promise<void>;
  deleteCustomItem: (itemId: string) => Promise<void>;
  syncAllToFirestore: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
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
  const [isFirebaseLive, setIsFirebaseLive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  // 1. Listen for Real-Time Changes from Firebase Firestore
  useEffect(() => {
    try {
      const liveDocRef = doc(db, 'boutique_content', 'live_state');
      const unsubscribe = onSnapshot(
        liveDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setIsFirebaseLive(true);
            if (data.heroImage) {
              setHeroImage(data.heroImage);
              localStorage.setItem(STORAGE_KEY_HERO, data.heroImage);
            }
            if (Array.isArray(data.newArrivals) && data.newArrivals.length > 0) {
              setNewArrivals(data.newArrivals);
              localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(data.newArrivals));
            }
            if (Array.isArray(data.categories) && data.categories.length > 0) {
              setCategories(data.categories);
              localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(data.categories));
            }
            if (Array.isArray(data.editorialGallery) && data.editorialGallery.length > 0) {
              setEditorialGallery(data.editorialGallery);
              localStorage.setItem(STORAGE_KEY_EDITORIAL, JSON.stringify(data.editorialGallery));
            }
            if (Array.isArray(data.instagramPosts) && data.instagramPosts.length > 0) {
              setInstagramPosts(data.instagramPosts);
              localStorage.setItem(STORAGE_KEY_IG, JSON.stringify(data.instagramPosts));
            }
            if (data.lastUpdated) {
              setLastSyncedTime(new Date(data.lastUpdated).toLocaleTimeString());
            }
          } else {
            // First time Firestore initialization - sync defaults
            setIsFirebaseLive(true);
          }
        },
        (error) => {
          console.warn('Firebase Firestore listening note (operating in resilient local mode):', error.message);
          setIsFirebaseLive(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore initial connection note:', err);
    }
  }, []);

  // Helper to persist state to Firestore
  const saveStateToFirestore = async (override?: {
    heroImage?: string;
    newArrivals?: FashionItem[];
    categories?: CollectionCategory[];
    editorialGallery?: FashionItem[];
    instagramPosts?: InstagramPost[];
  }) => {
    setIsSyncing(true);
    try {
      const payload = {
        heroImage: override?.heroImage || heroImage,
        newArrivals: override?.newArrivals || newArrivals,
        categories: override?.categories || categories,
        editorialGallery: override?.editorialGallery || editorialGallery,
        instagramPosts: override?.instagramPosts || instagramPosts,
        lastUpdated: new Date().toISOString(),
      };

      const liveDocRef = doc(db, 'boutique_content', 'live_state');
      await setDoc(liveDocRef, payload, { merge: true });
      setLastSyncedTime(new Date().toLocaleTimeString());
      setIsFirebaseLive(true);
    } catch (e) {
      console.warn('Firestore save note (saved locally):', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncAllToFirestore = async () => {
    await saveStateToFirestore();
  };

  const addCustomItem = async (
    itemData: Omit<FashionItem, 'id'>,
    placement: 'new-arrival' | 'editorial' | 'instagram' | 'all'
  ) => {
    const newItem: FashionItem = {
      ...itemData,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    let updatedNewArrivals = newArrivals;
    let updatedEditorial = editorialGallery;
    let updatedIg = instagramPosts;

    if (placement === 'new-arrival' || placement === 'all') {
      updatedNewArrivals = [newItem, ...newArrivals];
      setNewArrivals(updatedNewArrivals);
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updatedNewArrivals));
    }
    if (placement === 'editorial' || placement === 'all') {
      updatedEditorial = [newItem, ...editorialGallery];
      setEditorialGallery(updatedEditorial);
      localStorage.setItem(STORAGE_KEY_EDITORIAL, JSON.stringify(updatedEditorial));
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
      updatedIg = [newPost, ...instagramPosts.slice(0, 5)];
      setInstagramPosts(updatedIg);
      localStorage.setItem(STORAGE_KEY_IG, JSON.stringify(updatedIg));
    }

    await saveStateToFirestore({
      newArrivals: updatedNewArrivals,
      editorialGallery: updatedEditorial,
      instagramPosts: updatedIg,
    });
  };

  const updateCategoryPhoto = async (categoryId: string, newImageUrl: string) => {
    const updated = categories.map((c) => (c.id === categoryId ? { ...c, image: newImageUrl } : c));
    setCategories(updated);
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
    await saveStateToFirestore({ categories: updated });
  };

  const updateHeroPhoto = async (newImageUrl: string) => {
    setHeroImage(newImageUrl);
    localStorage.setItem(STORAGE_KEY_HERO, newImageUrl);
    await saveStateToFirestore({ heroImage: newImageUrl });
  };

  const updateInstagramPostPhoto = async (postId: string, newImageUrl: string, newCaption?: string) => {
    const updated = instagramPosts.map((p) =>
      p.id === postId
        ? {
            ...p,
            image: newImageUrl,
            ...(newCaption ? { caption: newCaption } : {}),
          }
        : p
    );
    setInstagramPosts(updated);
    localStorage.setItem(STORAGE_KEY_IG, JSON.stringify(updated));
    await saveStateToFirestore({ instagramPosts: updated });
  };

  const replaceItemPhoto = async (itemId: string, newImageUrl: string) => {
    const updatedArr = newArrivals.map((it) => (it.id === itemId ? { ...it, image: newImageUrl } : it));
    const updatedEd = editorialGallery.map((it) => (it.id === itemId ? { ...it, image: newImageUrl } : it));
    setNewArrivals(updatedArr);
    setEditorialGallery(updatedEd);
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updatedArr));
    localStorage.setItem(STORAGE_KEY_EDITORIAL, JSON.stringify(updatedEd));
    await saveStateToFirestore({ newArrivals: updatedArr, editorialGallery: updatedEd });
  };

  const deleteCustomItem = async (itemId: string) => {
    const updatedArr = newArrivals.filter((it) => it.id !== itemId);
    const updatedEd = editorialGallery.filter((it) => it.id !== itemId);
    setNewArrivals(updatedArr);
    setEditorialGallery(updatedEd);
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updatedArr));
    localStorage.setItem(STORAGE_KEY_EDITORIAL, JSON.stringify(updatedEd));
    await saveStateToFirestore({ newArrivals: updatedArr, editorialGallery: updatedEd });
  };

  const resetToDefaults = async () => {
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
    await saveStateToFirestore({
      heroImage: DEFAULT_HERO_IMAGE,
      newArrivals: DEFAULT_NEW_ARRIVALS,
      categories: DEFAULT_CATEGORIES,
      editorialGallery: DEFAULT_EDITORIAL,
      instagramPosts: DEFAULT_IG_POSTS,
    });
  };

  return (
    <FashionContext.Provider
      value={{
        newArrivals,
        categories,
        editorialGallery,
        instagramPosts,
        heroImage,
        isFirebaseLive,
        isSyncing,
        lastSyncedTime,
        addCustomItem,
        updateCategoryPhoto,
        updateHeroPhoto,
        updateInstagramPostPhoto,
        replaceItemPhoto,
        deleteCustomItem,
        syncAllToFirestore,
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
