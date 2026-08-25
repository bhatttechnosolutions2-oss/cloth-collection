import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FashionItem, CollectionCategory, InstagramPost, MediaLibraryItem, WebsiteSlot } from '../types';
import {
  NEW_ARRIVALS as DEFAULT_NEW_ARRIVALS,
  CATEGORIES as DEFAULT_CATEGORIES,
  EDITORIAL_GALLERY as DEFAULT_EDITORIAL,
  INSTAGRAM_POSTS as DEFAULT_IG_POSTS,
} from '../data/fashionData';
import { db, doc, setDoc, onSnapshot } from '../lib/firebase';

// Initial real boutique media library items
const DEFAULT_MEDIA_LIBRARY: MediaLibraryItem[] = [
  {
    id: 'lib-1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    title: 'Korean Ribbed Puff Sleeve Crop Top',
    source: 'preset',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    importedAt: '2026-08-24T10:00:00.000Z',
  },
  {
    id: 'lib-2',
    url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop',
    title: 'Vintage High-Rise Wide Leg Rigid Denim',
    source: 'preset',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    importedAt: '2026-08-24T10:00:00.000Z',
  },
  {
    id: 'lib-3',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    title: 'Chanderi Handblock Artisanal A-Line Kurti',
    source: 'preset',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    importedAt: '2026-08-24T10:00:00.000Z',
  },
  {
    id: 'lib-4',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    title: 'Tailored Linen Pleated Straight Trousers',
    source: 'preset',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    importedAt: '2026-08-24T10:00:00.000Z',
  },
  {
    id: 'lib-5',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
    title: 'Floral Peplum Cotton Blouse',
    source: 'preset',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    importedAt: '2026-08-24T10:00:00.000Z',
  },
  {
    id: 'lib-6',
    url: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=1200&auto=format&fit=crop',
    title: 'Retro Flare Bootcut Comfort Washed Jeans',
    source: 'preset',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    importedAt: '2026-08-24T10:00:00.000Z',
  },
  {
    id: 'lib-7',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop',
    title: 'Lavender Pastel Flared Anarkali Kurti',
    source: 'preset',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    importedAt: '2026-08-24T10:00:00.000Z',
  },
  {
    id: 'lib-8',
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1200&auto=format&fit=crop',
    title: 'Wide Leg Modal Rayon Flowing Palazzo',
    source: 'preset',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    importedAt: '2026-08-24T10:00:00.000Z',
  },
];

interface FashionContextType {
  newArrivals: FashionItem[];
  categories: CollectionCategory[];
  editorialGallery: FashionItem[];
  instagramPosts: InstagramPost[];
  heroImage: string;
  mediaLibrary: MediaLibraryItem[];
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
  addToMediaLibrary: (items: Array<Omit<MediaLibraryItem, 'id' | 'importedAt'>>) => Promise<void>;
  removeFromMediaLibrary: (id: string) => Promise<void>;
  assignPhotoToSlot: (slot: WebsiteSlot, imageUrl: string, metadata?: any) => Promise<void>;
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
const STORAGE_KEY_LIBRARY = 'clothes_collection_library_v1';

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

  const [mediaLibrary, setMediaLibrary] = useState<MediaLibraryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LIBRARY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved media library', e);
      }
    }
    return DEFAULT_MEDIA_LIBRARY;
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
            if (Array.isArray(data.mediaLibrary) && data.mediaLibrary.length > 0) {
              setMediaLibrary(data.mediaLibrary);
              localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(data.mediaLibrary));
            }
            if (data.lastUpdated) {
              setLastSyncedTime(new Date(data.lastUpdated).toLocaleTimeString());
            }
          } else {
            setIsFirebaseLive(true);
          }
        },
        (error) => {
          console.warn('Firebase Firestore note (resilient local mode):', error.message);
          setIsFirebaseLive(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore initial connection note:', err);
    }
  }, []);

  // Helper to persist state to Firestore & localStorage
  const saveStateToFirestore = async (override?: {
    heroImage?: string;
    newArrivals?: FashionItem[];
    categories?: CollectionCategory[];
    editorialGallery?: FashionItem[];
    instagramPosts?: InstagramPost[];
    mediaLibrary?: MediaLibraryItem[];
  }) => {
    setIsSyncing(true);
    try {
      const payload = {
        heroImage: override?.heroImage || heroImage,
        newArrivals: override?.newArrivals || newArrivals,
        categories: override?.categories || categories,
        editorialGallery: override?.editorialGallery || editorialGallery,
        instagramPosts: override?.instagramPosts || instagramPosts,
        mediaLibrary: override?.mediaLibrary || mediaLibrary,
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

  // Add items into media library
  const addToMediaLibrary = async (items: Array<Omit<MediaLibraryItem, 'id' | 'importedAt'>>) => {
    const newItems: MediaLibraryItem[] = items.map((item, index) => ({
      ...item,
      id: `lib-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      importedAt: new Date().toISOString(),
    }));

    const updated = [...newItems, ...mediaLibrary];
    setMediaLibrary(updated);
    localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(updated));
    await saveStateToFirestore({ mediaLibrary: updated });
  };

  // Remove item from media library
  const removeFromMediaLibrary = async (id: string) => {
    const updated = mediaLibrary.filter((m) => m.id !== id);
    setMediaLibrary(updated);
    localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(updated));
    await saveStateToFirestore({ mediaLibrary: updated });
  };

  // Direct Slot Assignment helper ("Jaha Jaha Image Add karni hai waha 1-Click Slot Placement")
  const assignPhotoToSlot = async (slot: WebsiteSlot, imageUrl: string, metadata?: any) => {
    if (slot.type === 'hero') {
      await updateHeroPhoto(imageUrl);
      return;
    }

    if (slot.type === 'category') {
      await updateCategoryPhoto(slot.categoryId, imageUrl);
      return;
    }

    if (slot.type === 'replaceNewArrival') {
      await replaceItemPhoto(slot.itemId, imageUrl);
      return;
    }

    if (slot.type === 'instagramPost') {
      const updated = instagramPosts.map((post) => {
        if (post.id === slot.postId) {
          return {
            ...post,
            image: imageUrl,
            caption: slot.caption || metadata?.caption || post.caption,
            mediaType: slot.mediaType || metadata?.mediaType || post.mediaType || (metadata?.isReel ? 'reel' : 'image'),
            videoUrl: slot.videoUrl || metadata?.videoUrl || post.videoUrl,
            embedUrl: slot.embedUrl || metadata?.embedUrl || post.embedUrl,
          };
        }
        return post;
      });
      setInstagramPosts(updated);
      localStorage.setItem(STORAGE_KEY_IG, JSON.stringify(updated));
      await saveStateToFirestore({ instagramPosts: updated });
      return;
    }

    if (slot.type === 'newArrival') {
      const categoryLabels: Record<string, string> = {
        tops: 'Tops & Shirts',
        jeans: 'Jeans & Denims',
        kurtis: "Kurti's & Sets",
        bottoms: "Girls' Bottoms",
      };

      const sizePresets: Record<string, string[]> = {
        tops: ['XS', 'S', 'M', 'L', 'XL'],
        jeans: ['26', '28', '30', '32', '34', '36'],
        kurtis: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
        bottoms: ['26-28 (S)', '28-30 (M)', '30-32 (L)', '32-34 (XL)', '34-36 (XXL)'],
      };

      const targetCategory = slot.category;
      const isReelMedia = slot.mediaType === 'reel' || metadata?.mediaType === 'reel' || metadata?.isReel;

      await addCustomItem(
        {
          title: slot.title || metadata?.title || `${categoryLabels[targetCategory]} Boutique Edit`,
          tag: slot.tag || metadata?.tag || (isReelMedia ? 'REEL DROP' : 'INSTAGRAM DROP'),
          image: imageUrl,
          mediaType: slot.mediaType || metadata?.mediaType || (isReelMedia ? 'reel' : 'image'),
          videoUrl: slot.videoUrl || metadata?.videoUrl,
          instagramReelId: slot.instagramReelId || metadata?.instagramReelId,
          embedUrl: slot.embedUrl || metadata?.embedUrl,
          category: targetCategory,
          categoryLabel: categoryLabels[targetCategory],
          description: `Authentic boutique outfit in ${slot.fabric || metadata?.fabric || 'Pure Fabric'}. Available at Clothes Collection, Sadar Bazar, Agra.`,
          details: {
            fabric: slot.fabric || metadata?.fabric || 'Pure Boutique Blend',
            fit: targetCategory === 'jeans' ? 'High-Rise Comfort Fit' : targetCategory === 'kurtis' ? 'A-Line Comfort Cut' : 'Tailored Slim / Relaxed Fit',
            occasion: 'Everyday, College, Workwear & Parties',
            sizes: sizePresets[targetCategory] || ['Free Size', 'S', 'M', 'L', 'XL'],
            care: 'Gentle Wash Recommended',
          },
          instagramUrl: metadata?.instagramUrl || 'https://instagram.com/clothcollection.agra',
        },
        'new-arrival'
      );
      return;
    }

    if (slot.type === 'editorial') {
      if (slot.itemId) {
        await replaceItemPhoto(slot.itemId, imageUrl);
      } else {
        await addCustomItem(
          {
            title: metadata?.title || 'Editorial Aesthetic Highlight',
            tag: metadata?.tag || 'EDITORIAL LOOK',
            image: imageUrl,
            mediaType: slot.mediaType || metadata?.mediaType,
            videoUrl: slot.videoUrl || metadata?.videoUrl,
            embedUrl: slot.embedUrl || metadata?.embedUrl,
            category: 'tops',
            categoryLabel: 'Signature Edit',
            description: 'Curated boutique showcase at Sadar Bazar Agra.',
            details: {
              fabric: 'Premium Fabric',
              fit: 'Signature Silhouette',
              occasion: 'Occasion & Everyday Luxury',
              sizes: ['Free Size', 'S', 'M', 'L', 'XL'],
              care: 'Gentle Care',
            },
          },
          'editorial'
        );
      }
    }
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
        caption: `${newItem.title} - Real boutique drop at Clothes Collection, Sadar Bazar, Agra.`,
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
    setMediaLibrary(DEFAULT_MEDIA_LIBRARY);
    localStorage.removeItem(STORAGE_KEY_ITEMS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_EDITORIAL);
    localStorage.removeItem(STORAGE_KEY_IG);
    localStorage.removeItem(STORAGE_KEY_HERO);
    localStorage.removeItem(STORAGE_KEY_LIBRARY);
    await saveStateToFirestore({
      heroImage: DEFAULT_HERO_IMAGE,
      newArrivals: DEFAULT_NEW_ARRIVALS,
      categories: DEFAULT_CATEGORIES,
      editorialGallery: DEFAULT_EDITORIAL,
      instagramPosts: DEFAULT_IG_POSTS,
      mediaLibrary: DEFAULT_MEDIA_LIBRARY,
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
        mediaLibrary,
        isFirebaseLive,
        isSyncing,
        lastSyncedTime,
        addCustomItem,
        updateCategoryPhoto,
        updateHeroPhoto,
        updateInstagramPostPhoto,
        replaceItemPhoto,
        deleteCustomItem,
        addToMediaLibrary,
        removeFromMediaLibrary,
        assignPhotoToSlot,
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

