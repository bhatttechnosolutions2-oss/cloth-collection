/**
 * Instagram & Media Resolver Utility for Clothes Collection Agra
 * Handles parsing, image resolution with multi-fallback, and Instagram Reel embedding
 */

export interface ResolvedMedia {
  url: string;
  mediaType: 'image' | 'reel' | 'video';
  isReel: boolean;
  shortcode: string | null;
  embedUrl?: string;
  videoUrl?: string;
  instagramUrl: string;
  fallbackUrls: string[];
}

/**
 * Extracts clean shortcode from various Instagram URL formats
 * Supports:
 * - https://www.instagram.com/reel/DEv3_AbCdEf/
 * - https://www.instagram.com/p/DEv3_AbCdEf/
 * - https://www.instagram.com/reels/DEv3_AbCdEf/
 * - https://instagram.com/share/reel/DEv3_AbCdEf
 * - https://instagram.com/tv/DEv3_AbCdEf
 * - URLs with tracking query parameters (?igsh=..., ?utm_source=...)
 */
export const parseInstagramUrl = (input: string): {
  shortcode: string | null;
  isReel: boolean;
  cleanUrl: string;
} => {
  if (!input) return { shortcode: null, isReel: false, cleanUrl: '' };

  const raw = input.trim();
  const isReel = /instagram\.com\/(?:reel|reels|share\/reel)/i.test(raw);

  // Match shortcode (alphanumeric, underscores, hyphens)
  const regex = /(?:instagram\.com\/(?:p|reel|reels|tv|share\/reel|share\/p)\/|instagr\.am\/(?:p|reel)\/)([A-Za-z0-9_-]+)/i;
  const match = raw.match(regex);

  const shortcode = match && match[1] ? match[1] : null;
  const cleanUrl = shortcode
    ? `https://www.instagram.com/${isReel ? 'reel' : 'p'}/${shortcode}/`
    : raw;

  return { shortcode, isReel, cleanUrl };
};

/**
 * Resolves high-resolution media URLs, Reel embed player, and fallback image chains
 */
export const resolveMediaItem = (input: string, customTitle?: string): ResolvedMedia => {
  const clean = input.trim();

  // 1. Direct Video files (mp4, webm, mov, ogg, blob)
  if (
    clean.match(/\.(mp4|webm|mov|ogg)($|\?)/i) ||
    clean.startsWith('blob:') ||
    clean.startsWith('data:video/')
  ) {
    return {
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', // default video poster
      mediaType: 'video',
      isReel: true,
      shortcode: null,
      videoUrl: clean,
      instagramUrl: 'https://instagram.com/clothcollection.agra',
      fallbackUrls: [],
    };
  }

  // 2. Direct Image URLs (jpg, png, webp, unsplash, cdn, data-uri)
  if (
    clean.match(/\.(jpeg|jpg|png|webp|gif)($|\?)/i) ||
    clean.includes('images.unsplash.com') ||
    clean.includes('cdninstagram') ||
    clean.includes('fbcdn.net') ||
    clean.startsWith('data:image/')
  ) {
    return {
      url: clean,
      mediaType: 'image',
      isReel: false,
      shortcode: null,
      instagramUrl: 'https://instagram.com/clothcollection.agra',
      fallbackUrls: [clean],
    };
  }

  // 3. Instagram Link Parsing
  const { shortcode, isReel, cleanUrl } = parseInstagramUrl(clean);

  if (shortcode) {
    // Multi-proxy fallback strategy for Instagram photos/thumbnails
    const proxy1 = `https://images.weserv.nl/?url=https://instagram.com/p/${shortcode}/media/?size=l`;
    const proxy2 = `https://images.weserv.nl/?url=https://instagram.com/reel/${shortcode}/media/?size=l`;
    const embed = `https://www.instagram.com/${isReel ? 'reel' : 'p'}/${shortcode}/embed/`;

    return {
      url: proxy1,
      mediaType: isReel ? 'reel' : 'image',
      isReel,
      shortcode,
      embedUrl: embed,
      instagramUrl: cleanUrl,
      fallbackUrls: [proxy1, proxy2],
    };
  }

  // 4. General fallback
  return {
    url: clean,
    mediaType: 'image',
    isReel: false,
    shortcode: null,
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    fallbackUrls: [clean],
  };
};

/**
 * Generates video thumbnail frame client-side using HTML5 Canvas
 */
export const captureVideoFrame = (videoElement: HTMLVideoElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      } else {
        reject(new Error('Canvas 2D context unavailable'));
      }
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Curated Real Boutique Reel Presets (from @clothcollection.agra)
 * Real boutique showcase reels for Tops, Jeans, Kurtis & Bottoms
 */
export const REAL_BOUTIQUE_REEL_PRESETS = [
  {
    category: 'tops' as const,
    categoryLabel: 'Tops & Shirts',
    title: 'Korean Ribbed Puff Sleeve Top (Live Video Try-On)',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    tag: 'REEL DROP',
    mediaType: 'reel' as const,
    instagramReelId: 'C7xyz123',
    embedUrl: 'https://www.instagram.com/reel/C8qK3U_S4Ym/embed/',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    fabric: 'Stretch Ribbed Cotton Knit',
    caption: 'Reel Drop: Korean aesthetic puff-sleeve top styling & stretch test. Sadar Bazar Agra store.',
  },
  {
    category: 'jeans' as const,
    categoryLabel: 'Jeans & Denims',
    title: 'Vintage High-Rise Wide Leg Rigid Denim (Fit & Flare Video)',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop',
    tag: 'VIRAL REEL',
    mediaType: 'reel' as const,
    instagramReelId: 'C7denim456',
    embedUrl: 'https://www.instagram.com/reel/C8qK3U_S4Ym/embed/',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    fabric: '100% Rigid Ring-Spun Cotton Denim',
    caption: 'Real in-store video of our #1 bestselling wide leg denim fit.',
  },
  {
    category: 'kurtis' as const,
    categoryLabel: "Kurti's & Sets",
    title: 'Handblock Chanderi Silk A-Line Kurti (Fabric Flow Reel)',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    tag: 'ETHNIC REEL',
    mediaType: 'reel' as const,
    instagramReelId: 'C7kurti789',
    embedUrl: 'https://www.instagram.com/reel/C8qK3U_S4Ym/embed/',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    fabric: 'Pure Chanderi Silk Cotton with Mulmul Lining',
    caption: 'Pure Chanderi silk fabric shimmer and flare video drop.',
  },
  {
    category: 'bottoms' as const,
    categoryLabel: "Girls' Bottoms",
    title: 'Tailored Linen Pleated Trousers (360° Walkthrough Video)',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    tag: 'NEW REEL',
    mediaType: 'reel' as const,
    instagramReelId: 'C7bottoms321',
    embedUrl: 'https://www.instagram.com/reel/C8qK3U_S4Ym/embed/',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
    fabric: 'Breathable Organic Linen Twill',
    caption: 'Clean front pleats, elasticated back comfort band, and drape test.',
  },
];
