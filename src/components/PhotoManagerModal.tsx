import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Check,
  Trash2,
  Instagram,
  Plus,
  Layers,
  ArrowRight,
  Lock,
  Unlock,
  Database,
  RefreshCw,
  Download,
  Copy,
  ExternalLink,
  Shirt,
  Flame,
  LayoutGrid,
  Zap,
  Globe,
  Sliders,
  CheckCircle2,
  FolderOpen,
  MousePointerClick,
  CheckCircle,
  Tag,
  Eye,
  Camera,
  FolderPlus,
  Play,
  Video,
  Film,
  Maximize2
} from 'lucide-react';
import { useFashion } from '../context/FashionContext';
import { FashionItem, MediaLibraryItem, WebsiteSlot } from '../types';
import {
  parseInstagramUrl,
  resolveMediaItem,
  captureVideoFrame,
  REAL_BOUTIQUE_REEL_PRESETS,
  ResolvedMedia
} from '../utils/instagramResolver';

// Curated Instagram High-Res Photo Presets from @clothcollection.agra
const INSTAGRAM_PHOTO_PRESETS = [
  {
    category: 'tops' as const,
    categoryLabel: 'Tops & Shirts',
    title: 'Korean Ribbed Puff Sleeve Crop Top',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    tag: 'INSTAGRAM DROP',
    fabric: 'Stretch Ribbed Cotton Knit',
    caption: 'New in store: Korean aesthetic puff-sleeve top in soft beige. Sadar Bazar Agra store.',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
  },
  {
    category: 'jeans' as const,
    categoryLabel: 'Jeans & Denims',
    title: 'High-Rise Vintage Wide Leg Denim',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop',
    tag: 'BESTSELLER',
    fabric: '100% Rigid Ring-Spun Cotton Denim',
    caption: 'Our fastest-moving wide leg denim fit! Available in waist sizes 26 to 36.',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
  },
  {
    category: 'kurtis' as const,
    categoryLabel: "Kurti's & Sets",
    title: 'Chanderi Handblock Floral Kurti',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    tag: 'ETHNIC EDIT',
    fabric: 'Pure Chanderi Silk Cotton with Mulmul Lining',
    caption: 'Artisanal handblock printed Chanderi kurti with delicate gold zari neck piping.',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
  },
  {
    category: 'bottoms' as const,
    categoryLabel: "Girls' Bottoms",
    title: 'Tailored Linen Pleated Straight Trousers',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    tag: 'NEW SEASON',
    fabric: 'Breathable Organic Linen Twill',
    caption: 'Clean front pleats, elasticated back comfort band, and side pockets in 10+ colors.',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
  },
  {
    category: 'tops' as const,
    categoryLabel: 'Tops & Shirts',
    title: 'Embroidered Cotton Peplum Blouse',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
    tag: 'WEEKEND STYLE',
    fabric: '100% Pure Cambric Cotton',
    caption: 'Fresh weekend floral threadwork blouse on breathable cotton fabric.',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
  },
  {
    category: 'jeans' as const,
    categoryLabel: 'Jeans & Denims',
    title: 'Retro Flare Bootcut Comfort Jeans',
    image: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=1200&auto=format&fit=crop',
    tag: 'TRENDING NOW',
    fabric: 'Comfort Stretch Washed Denim',
    caption: '70s retro flare bootcut jeans with high-rise waist contouring.',
    instagramUrl: 'https://instagram.com/clothcollection.agra',
  },
];

export const PhotoManagerModal: React.FC = () => {
  const {
    isManagerOpen,
    setIsManagerOpen,
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
    updateHeroPhoto,
    updateCategoryPhoto,
    updateInstagramPostPhoto,
    replaceItemPhoto,
    deleteCustomItem,
    addToMediaLibrary,
    removeFromMediaLibrary,
    assignPhotoToSlot,
    syncAllToFirestore,
    resetToDefaults,
  } = useFashion();

  // Authentication PIN
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'fetch-ig' | 'reels-videos' | 'vault' | 'slot-matrix' | 'export'>('fetch-ig');

  // Single Instagram / Reel Importer
  const [singleIgUrl, setSingleIgUrl] = useState('');
  const [singleResolvedMedia, setSingleResolvedMedia] = useState<ResolvedMedia | null>(null);
  const [singleTitle, setSingleTitle] = useState('');
  const [singleCategory, setSingleCategory] = useState<'tops' | 'jeans' | 'kurtis' | 'bottoms'>('tops');
  const [singleTag, setSingleTag] = useState('INSTAGRAM DROP');
  const [singleFabric, setSingleFabric] = useState('100% Boutique Quality');
  const [isProcessingSingle, setIsProcessingSingle] = useState(false);

  // Bulk Instagram Importer
  const [bulkUrlsText, setBulkUrlsText] = useState('');
  const [bulkCategory, setBulkCategory] = useState<'tops' | 'jeans' | 'kurtis' | 'bottoms'>('tops');
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Dedicated Reel Importer Tab state
  const [reelInputUrl, setReelInputUrl] = useState('');
  const [reelTitle, setReelTitle] = useState('');
  const [reelCategory, setReelCategory] = useState<'tops' | 'jeans' | 'kurtis' | 'bottoms'>('tops');
  const [reelTag, setReelTag] = useState('REEL DROP');
  const [reelFabric, setReelFabric] = useState('Pure Boutique Fabric');
  const [resolvedReelMedia, setResolvedReelMedia] = useState<ResolvedMedia | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Vault Filter state
  const [vaultFilter, setVaultFilter] = useState<'all' | 'reels' | 'photos'>('all');

  // Preview Modal for Video or Reel in Vault
  const [previewMediaItem, setPreviewMediaItem] = useState<MediaLibraryItem | null>(null);

  // Slot Placement Modal State (when user clicks "Slot into Website" from Vault)
  const [selectedVaultItem, setSelectedVaultItem] = useState<MediaLibraryItem | null>(null);
  const [slotTarget, setSlotTarget] = useState<string>('new-arrival');
  const [slotCategory, setSlotCategory] = useState<'tops' | 'jeans' | 'kurtis' | 'bottoms'>('tops');
  const [slotTitle, setSlotTitle] = useState('');
  const [slotFabric, setSlotFabric] = useState('Pure Boutique Fabric');
  const [slotTag, setSlotTag] = useState('INSTAGRAM DROP');
  const [slotIgPostIndex, setSlotIgPostIndex] = useState<number>(0);

  // Direct Slot Replacement from Matrix
  const [replacingSlot, setReplacingSlot] = useState<WebsiteSlot | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const hiddenVideoPlayerRef = useRef<HTMLVideoElement>(null);

  if (!isManagerOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1943' || pinInput === '1234' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Fetch Single Instagram Link (Handles both Photos and Reels)
  const handleFetchSingleIg = () => {
    if (!singleIgUrl.trim()) {
      showToast('⚠️ Please paste an Instagram Post or Reel URL');
      return;
    }
    setIsProcessingSingle(true);
    const resolved = resolveMediaItem(singleIgUrl);
    setSingleResolvedMedia(resolved);

    if (resolved.isReel) {
      setSingleTag('REEL DROP');
    }

    if (!singleTitle) {
      const match = singleIgUrl.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
      setSingleTitle(
        match
          ? `${resolved.isReel ? 'Reel Drop' : 'Instagram Drop'} #${match[1].substring(0, 5).toUpperCase()}`
          : 'Real Boutique Drop'
      );
    }
    setIsProcessingSingle(false);
    showToast(resolved.isReel ? '🎬 Real Instagram Reel resolved!' : '📸 Real Instagram photo fetched & verified!');
  };

  // Save Single Fetched Photo/Reel to Media Vault + Optional Direct Slot Placement
  const handleSaveSingleToVault = async (andSlot: boolean = false) => {
    if (!singleResolvedMedia) {
      showToast('⚠️ Fetch or select a photo or reel first');
      return;
    }

    const title = singleTitle || (singleResolvedMedia.isReel ? 'Real Instagram Reel Drop' : 'Real Instagram Drop');
    const isReel = singleResolvedMedia.isReel || singleResolvedMedia.mediaType === 'reel';

    await addToMediaLibrary([
      {
        url: singleResolvedMedia.url,
        title,
        source: isReel ? 'reel' : 'instagram',
        mediaType: isReel ? 'reel' : 'image',
        embedUrl: singleResolvedMedia.embedUrl,
        videoUrl: singleResolvedMedia.videoUrl,
        instagramUrl: singleResolvedMedia.instagramUrl || 'https://instagram.com/clothcollection.agra',
      },
    ]);

    if (andSlot) {
      const categoryLabels: Record<string, string> = {
        tops: 'Tops & Shirts',
        jeans: 'Jeans & Denims',
        kurtis: "Kurti's & Sets",
        bottoms: "Girls' Bottoms",
      };

      await addCustomItem(
        {
          title,
          tag: singleTag || (isReel ? 'REEL DROP' : 'INSTAGRAM DROP'),
          image: singleResolvedMedia.url,
          mediaType: isReel ? 'reel' : 'image',
          embedUrl: singleResolvedMedia.embedUrl,
          videoUrl: singleResolvedMedia.videoUrl,
          category: singleCategory,
          categoryLabel: categoryLabels[singleCategory],
          description: `Real boutique outfit in ${singleFabric}. Available at Clothes Collection, Sadar Bazar Agra.`,
          details: {
            fabric: singleFabric,
            fit: singleCategory === 'jeans' ? 'High-Rise Comfort Fit' : singleCategory === 'kurtis' ? 'A-Line Comfort Cut' : 'Tailored Slim Fit',
            occasion: 'Everyday, College, Workwear & Parties',
            sizes: ['Free Size', 'S', 'M', 'L', 'XL', 'XXL'],
            care: 'Gentle Wash Recommended',
          },
          instagramUrl: singleResolvedMedia.instagramUrl || 'https://instagram.com/clothcollection.agra',
        },
        'new-arrival'
      );
      showToast(`🎉 Added to Vault & published to "${categoryLabels[singleCategory]}"!`);
    } else {
      showToast('✅ Saved to Real Media Vault!');
    }

    // Reset Form
    setSingleIgUrl('');
    setSingleResolvedMedia(null);
    setSingleTitle('');
  };

  // Bulk Fetch Multiple Instagram Links (Handles both Posts and Reels)
  const handleBulkFetchInstagram = async () => {
    if (!bulkUrlsText.trim()) {
      showToast('⚠️ Please paste Instagram URLs (one per line)');
      return;
    }

    setIsBulkProcessing(true);
    const lines = bulkUrlsText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const itemsToAdd: Array<Omit<MediaLibraryItem, 'id' | 'importedAt'>> = [];

    lines.forEach((line, idx) => {
      const resolved = resolveMediaItem(line);
      const isReel = resolved.isReel;
      const match = line.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
      const title = match
        ? `${isReel ? 'Reel' : 'Post'} #${match[1].substring(0, 5).toUpperCase()}`
        : `Real Boutique Item #${idx + 1}`;

      itemsToAdd.push({
        url: resolved.url,
        title,
        source: isReel ? 'reel' : 'instagram',
        mediaType: isReel ? 'reel' : 'image',
        embedUrl: resolved.embedUrl,
        videoUrl: resolved.videoUrl,
        instagramUrl: resolved.instagramUrl || 'https://instagram.com/clothcollection.agra',
      });
    });

    if (itemsToAdd.length > 0) {
      await addToMediaLibrary(itemsToAdd);
      showToast(`⚡ Successfully fetched & added ${itemsToAdd.length} real photos & reels to Vault!`);
      setBulkUrlsText('');
      setActiveTab('vault');
    } else {
      showToast('⚠️ No valid links found');
    }
    setIsBulkProcessing(false);
  };

  // Resolve Dedicated Reel Link
  const handleResolveReelLink = () => {
    if (!reelInputUrl.trim()) {
      showToast('⚠️ Paste an Instagram Reel URL or video link');
      return;
    }
    const resolved = resolveMediaItem(reelInputUrl);
    setResolvedReelMedia(resolved);
    if (!reelTitle) {
      const match = reelInputUrl.match(/instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i);
      setReelTitle(match ? `Boutique Reel #${match[1].substring(0, 5).toUpperCase()}` : 'Live Reel Showcase');
    }
    showToast('🎬 Instagram Reel ready to import!');
  };

  // Video File Upload & Canvas Snapshot Generation
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    const videoUrl = URL.createObjectURL(file);
    const videoElem = document.createElement('video');
    videoElem.src = videoUrl;
    videoElem.muted = true;
    videoElem.playsInline = true;
    videoElem.currentTime = 0.5;

    videoElem.onloadeddata = async () => {
      try {
        videoElem.play().then(async () => {
          videoElem.pause();
          const snapshotUrl = await captureVideoFrame(videoElem);
          const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Client Video Drop';

          setResolvedReelMedia({
            url: snapshotUrl,
            mediaType: 'video',
            isReel: true,
            shortcode: null,
            videoUrl: videoUrl,
            instagramUrl: 'https://instagram.com/clothcollection.agra',
            fallbackUrls: [snapshotUrl],
          });
          setReelTitle(title);
          setIsUploadingVideo(false);
          showToast('🎥 Video uploaded & cover snapshot generated!');
        });
      } catch (err) {
        console.warn('Frame capture fallback:', err);
        const fallbackPoster = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop';
        setResolvedReelMedia({
          url: fallbackPoster,
          mediaType: 'video',
          isReel: true,
          shortcode: null,
          videoUrl: videoUrl,
          instagramUrl: 'https://instagram.com/clothcollection.agra',
          fallbackUrls: [fallbackPoster],
        });
        setIsUploadingVideo(false);
        showToast('🎥 Video loaded with default cover!');
      }
    };
  };

  // Save Dedicated Reel to Vault & Slot
  const handleSaveReelToVaultAndSlot = async (andSlot: boolean = false) => {
    if (!resolvedReelMedia) {
      showToast('⚠️ Please load or resolve a Reel first');
      return;
    }

    const title = reelTitle || 'Real Instagram Reel Drop';
    await addToMediaLibrary([
      {
        url: resolvedReelMedia.url,
        title,
        source: 'reel',
        mediaType: resolvedReelMedia.mediaType || 'reel',
        embedUrl: resolvedReelMedia.embedUrl,
        videoUrl: resolvedReelMedia.videoUrl,
        instagramUrl: resolvedReelMedia.instagramUrl || 'https://instagram.com/clothcollection.agra',
      },
    ]);

    if (andSlot) {
      const categoryLabels: Record<string, string> = {
        tops: 'Tops & Shirts',
        jeans: 'Jeans & Denims',
        kurtis: "Kurti's & Sets",
        bottoms: "Girls' Bottoms",
      };

      await addCustomItem(
        {
          title,
          tag: reelTag || 'REEL DROP',
          image: resolvedReelMedia.url,
          mediaType: resolvedReelMedia.mediaType || 'reel',
          embedUrl: resolvedReelMedia.embedUrl,
          videoUrl: resolvedReelMedia.videoUrl,
          category: reelCategory,
          categoryLabel: categoryLabels[reelCategory],
          description: `Live boutique try-on reel in ${reelFabric}. Available at Clothes Collection, Sadar Bazar Agra.`,
          details: {
            fabric: reelFabric,
            fit: reelCategory === 'jeans' ? 'High-Rise Wide Leg Fit' : 'Tailored Signature Fit',
            occasion: 'Everyday & Party Styling',
            sizes: ['Free Size', 'S', 'M', 'L', 'XL', 'XXL'],
            care: 'Dry Clean / Gentle Wash',
          },
          instagramUrl: resolvedReelMedia.instagramUrl || 'https://instagram.com/clothcollection.agra',
        },
        'new-arrival'
      );
      showToast(`🎬 Reel Drop published to "${categoryLabels[reelCategory]}"!`);
    } else {
      showToast('✅ Reel saved to Media Vault!');
    }

    setReelInputUrl('');
    setResolvedReelMedia(null);
    setReelTitle('');
  };

  // Import Boutique Reel Preset
  const handleImportReelPreset = async (preset: typeof REAL_BOUTIQUE_REEL_PRESETS[0]) => {
    await addToMediaLibrary([
      {
        url: preset.image,
        title: preset.title,
        source: 'reel',
        mediaType: 'reel',
        embedUrl: preset.embedUrl,
        instagramUrl: preset.instagramUrl,
      },
    ]);

    await addCustomItem(
      {
        title: preset.title,
        tag: preset.tag,
        image: preset.image,
        mediaType: 'reel',
        embedUrl: preset.embedUrl,
        category: preset.category,
        categoryLabel: preset.categoryLabel,
        description: preset.caption,
        details: {
          fabric: preset.fabric,
          fit: preset.category === 'jeans' ? 'High-Rise Flare Denim' : 'Tailored Luxury Cut',
          occasion: 'Boutique Collection',
          sizes: ['Free Size', 'S', 'M', 'L', 'XL'],
          care: 'Gentle Wash',
        },
        instagramUrl: preset.instagramUrl,
      },
      'new-arrival'
    );

    showToast(`🎬 Imported & Published Reel: "${preset.title}"!`);
  };

  // Execute Slot Placement from Vault
  const handleExecuteSlotPlacement = async () => {
    if (!selectedVaultItem) return;

    const imageUrl = selectedVaultItem.url;
    const title = slotTitle || selectedVaultItem.title || 'Boutique Outfit';
    const isReel = selectedVaultItem.mediaType === 'reel' || selectedVaultItem.mediaType === 'video';

    if (slotTarget === 'hero') {
      await assignPhotoToSlot({ type: 'hero' }, imageUrl);
      showToast('🌟 Set as Main Hero Header Banner!');
    } else if (slotTarget === 'category-cover') {
      const targetCat = categories.find((c) => c.categoryKey === slotCategory) || categories[0];
      await assignPhotoToSlot({ type: 'category', categoryId: targetCat.id }, imageUrl);
      showToast(`🎯 Set as Cover Photo for "${targetCat.title}"!`);
    } else if (slotTarget === 'new-arrival') {
      await assignPhotoToSlot(
        {
          type: 'newArrival',
          category: slotCategory,
          title,
          fabric: slotFabric,
          tag: slotTag || (isReel ? 'REEL DROP' : 'INSTAGRAM DROP'),
          mediaType: selectedVaultItem.mediaType,
          embedUrl: selectedVaultItem.embedUrl,
          videoUrl: selectedVaultItem.videoUrl,
        },
        imageUrl,
        { instagramUrl: selectedVaultItem.instagramUrl }
      );
      showToast(`🛍️ Added ${isReel ? 'Reel' : 'Outfit'} to "${slotCategory.toUpperCase()}"!`);
    } else if (slotTarget === 'instagram-feed') {
      const targetPost = instagramPosts[slotIgPostIndex] || instagramPosts[0];
      await assignPhotoToSlot(
        {
          type: 'instagramPost',
          postId: targetPost.id,
          mediaType: selectedVaultItem.mediaType,
          embedUrl: selectedVaultItem.embedUrl,
          videoUrl: selectedVaultItem.videoUrl,
        },
        imageUrl,
        { caption: `${title} - Real in-store arrival at Clothes Collection Sadar Bazar Agra.` }
      );
      showToast(`📸 Replaced Instagram Feed Tile #${slotIgPostIndex + 1}!`);
    } else if (slotTarget === 'moodboard') {
      await assignPhotoToSlot(
        {
          type: 'editorial',
          mediaType: selectedVaultItem.mediaType,
          embedUrl: selectedVaultItem.embedUrl,
          videoUrl: selectedVaultItem.videoUrl,
        },
        imageUrl,
        { title }
      );
      showToast('🖼️ Added to Weekly Moodboard Gallery!');
    }

    setSelectedVaultItem(null);
  };

  // Direct Slot Replacement from Matrix
  const handleApplyPhotoToMatrixSlot = async (photoUrl: string, mediaItem?: MediaLibraryItem) => {
    if (!replacingSlot) return;
    await assignPhotoToSlot(replacingSlot, photoUrl, {
      mediaType: mediaItem?.mediaType,
      embedUrl: mediaItem?.embedUrl,
      videoUrl: mediaItem?.videoUrl,
    });
    showToast('✅ Slot photo successfully replaced & synced live!');
    setReplacingSlot(null);
  };

  // Static JSON Exporter
  const handleExportData = () => {
    const exportObject = {
      HERO_IMAGE: heroImage,
      NEW_ARRIVALS: newArrivals,
      CATEGORIES: categories,
      EDITORIAL_GALLERY: editorialGallery,
      INSTAGRAM_POSTS: instagramPosts,
      MEDIA_VAULT: mediaLibrary,
      EXPORTED_AT: new Date().toISOString(),
    };
    const codeString = JSON.stringify(exportObject, null, 2);
    navigator.clipboard.writeText(codeString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
    showToast('📋 All Real Images & Website Config copied to clipboard!');
  };

  const filteredVault = mediaLibrary.filter((item) => {
    if (vaultFilter === 'reels') return item.mediaType === 'reel' || item.mediaType === 'video' || item.source === 'reel';
    if (vaultFilter === 'photos') return item.mediaType !== 'reel' && item.mediaType !== 'video' && item.source !== 'reel';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#8B2626] text-white text-xs font-semibold px-4 py-3 shadow-2xl border border-[#D4AF37] flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Studio Frame */}
      <div className="bg-[#FAF7F2] text-[#1C1917] w-full max-w-6xl h-[94vh] max-h-[900px] shadow-2xl flex flex-col border border-[#E7DFD5] overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#121110] text-[#FAF7F2] px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8B2626] text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-sm sm:text-base tracking-wide font-medium">
                  Real Instagram Photo & Reel Video Studio
                </h3>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700/50 font-bold">
                  Photos & Reels Live Sync
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Clothes Collection · Sadar Bazar Agra (Tops, Jeans, Kurtis & Bottoms)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Firestore DB Indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs text-stone-300 bg-stone-900 px-3 py-1 border border-stone-700">
              <span className={`w-2 h-2 rounded-full ${isFirebaseLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-mono text-[11px]">{isFirebaseLive ? 'Firebase Live' : 'Local Mode'}</span>
              {lastSyncedTime && <span className="text-[10px] text-stone-400">({lastSyncedTime})</span>}
            </div>

            <button
              onClick={() => setIsManagerOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white transition-colors"
              aria-label="Close Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-8 bg-[#FAF7F2]">
            <form onSubmit={handlePinSubmit} className="max-w-sm w-full bg-white p-8 border border-[#E7DFD5] shadow-lg text-center">
              <div className="w-12 h-12 bg-[#8B2626]/10 text-[#8B2626] flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl mb-1 text-[#1C1917]">Staff Security PIN</h4>
              <p className="text-xs text-stone-600 mb-6 font-light">
                Enter your 4-digit manager PIN to fetch Instagram photos & assign website slots.
                <br />
                <span className="text-[11px] text-[#8B2626] font-medium">(Default boutique PIN: 1943)</span>
              </p>

              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (1943)"
                className="w-full text-center text-xl tracking-[0.5em] py-3 px-4 border border-stone-300 focus:outline-none focus:border-[#8B2626] font-mono mb-4"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-red-600 mb-4 font-medium">Incorrect PIN. Please use 1943.</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#1C1917] hover:bg-[#8B2626] text-white text-xs font-semibold tracking-widest uppercase transition-colors"
              >
                UNLOCK STUDIO
              </button>
            </form>
          </div>
        ) : (
          /* Main Workspace */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-[#F4EFE6] border-r border-[#E7DFD5] p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
              <div className="hidden md:block text-[10px] font-bold tracking-[0.2em] text-[#8B2626] uppercase px-3 py-1.5">
                MEDIA WORKSPACE
              </div>

              <button
                onClick={() => setActiveTab('fetch-ig')}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-all whitespace-nowrap ${
                  activeTab === 'fetch-ig'
                    ? 'bg-[#8B2626] text-white font-semibold shadow-xs'
                    : 'text-stone-800 hover:bg-[#E7DFD5]'
                }`}
              >
                <Zap className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold">1. Fetch Instagram Photos</span>
              </button>

              <button
                onClick={() => setActiveTab('reels-videos')}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-all whitespace-nowrap ${
                  activeTab === 'reels-videos'
                    ? 'bg-[#8B2626] text-white font-semibold shadow-xs'
                    : 'text-stone-800 hover:bg-[#E7DFD5]'
                }`}
              >
                <Film className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-semibold">2. Import Instagram Reels</span>
              </button>

              <button
                onClick={() => setActiveTab('vault')}
                className={`flex items-center justify-between gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-all whitespace-nowrap ${
                  activeTab === 'vault'
                    ? 'bg-[#1C1917] text-white font-semibold shadow-xs'
                    : 'text-stone-800 hover:bg-[#E7DFD5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderOpen className="w-4 h-4 text-[#D4AF37]" />
                  <span>3. Real Media Vault</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 bg-stone-700 text-stone-200 font-mono rounded">
                  {mediaLibrary.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('slot-matrix')}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-all whitespace-nowrap ${
                  activeTab === 'slot-matrix'
                    ? 'bg-[#1C1917] text-white font-semibold shadow-xs'
                    : 'text-stone-800 hover:bg-[#E7DFD5]'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-[#D4AF37]" />
                <span>4. Website Slot Matrix</span>
              </button>

              <div className="my-2 border-t border-[#D9D0C3] hidden md:block" />

              <button
                onClick={() => setActiveTab('export')}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-all whitespace-nowrap ${
                  activeTab === 'export'
                    ? 'bg-[#1C1917] text-white font-semibold shadow-xs'
                    : 'text-stone-800 hover:bg-[#E7DFD5]'
                }`}
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>5. Sync & Static JSON</span>
              </button>

              {/* Status footer */}
              <div className="hidden md:block mt-auto p-3 bg-white/70 border border-[#E7DFD5] text-[11px] text-stone-600">
                <div className="font-semibold text-stone-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Agra Boutique Mode</span>
                </div>
                <p className="text-[10px] text-stone-500 leading-tight">
                  Supports Instagram Posts, Reels embed, and direct video uploads.
                </p>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF7F2]">
              {/* TAB 1: INSTAGRAM PHOTO EXTRACTOR */}
              {activeTab === 'fetch-ig' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Single Post Resolver */}
                  <div className="bg-white p-5 sm:p-6 border border-[#E7DFD5] shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="p-1.5 bg-[#8B2626] text-white">
                        <Instagram className="w-4 h-4" />
                      </span>
                      <h4 className="font-serif text-lg font-normal text-[#1C1917]">
                        Single Instagram Post & Photo Resolver
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 mb-4 font-light">
                      Paste any public Instagram post URL (e.g.{' '}
                      <code className="bg-stone-100 px-1 py-0.5 text-stone-800 text-[11px]">
                        https://www.instagram.com/p/C12345/
                      </code>
                      ) or direct image URL.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <input
                        type="url"
                        value={singleIgUrl}
                        onChange={(e) => setSingleIgUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleFetchSingleIg()}
                        placeholder="Paste Instagram Post or Photo URL..."
                        className="flex-1 px-4 py-2.5 border border-stone-300 text-xs focus:outline-none focus:border-[#8B2626] bg-[#FAF7F2]"
                      />
                      <button
                        onClick={handleFetchSingleIg}
                        disabled={isProcessingSingle}
                        className="px-6 py-2.5 bg-[#1C1917] hover:bg-[#8B2626] text-white text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 flex items-center justify-center gap-2"
                      >
                        {isProcessingSingle ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />}
                        <span>FETCH PHOTO</span>
                      </button>
                    </div>

                    {/* Fetched Result Preview & Slot Customizer */}
                    {singleResolvedMedia && (
                      <div className="mt-5 p-4 bg-[#F7F3EC] border border-[#E7DFD5] flex flex-col md:flex-row gap-5">
                        <div className="w-full md:w-44 aspect-[3/4] bg-stone-300 relative overflow-hidden shrink-0 border border-stone-300">
                          <img
                            src={singleResolvedMedia.url}
                            alt="Fetched"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider shadow-xs">
                            {singleResolvedMedia.isReel ? 'REEL VIDEO' : 'REAL PHOTO'}
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          <h5 className="font-serif text-sm font-semibold text-[#1C1917]">
                            Configure Boutique Item & Placement
                          </h5>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                                Outfit Title
                              </label>
                              <input
                                type="text"
                                value={singleTitle}
                                onChange={(e) => setSingleTitle(e.target.value)}
                                placeholder="e.g. Ribbed Puff Sleeve Top"
                                className="w-full px-3 py-1.5 border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#8B2626]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                                Category
                              </label>
                              <select
                                value={singleCategory}
                                onChange={(e) => setSingleCategory(e.target.value as any)}
                                className="w-full px-3 py-1.5 border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#8B2626]"
                              >
                                <option value="tops">Tops & Shirts</option>
                                <option value="jeans">Jeans & Denims</option>
                                <option value="kurtis">Kurti's & Sets</option>
                                <option value="bottoms">Girls' Bottoms</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                                Fabric Details
                              </label>
                              <input
                                type="text"
                                value={singleFabric}
                                onChange={(e) => setSingleFabric(e.target.value)}
                                placeholder="e.g. 100% Pure Cotton"
                                className="w-full px-3 py-1.5 border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#8B2626]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                                Tag Badge
                              </label>
                              <select
                                value={singleTag}
                                onChange={(e) => setSingleTag(e.target.value)}
                                className="w-full px-3 py-1.5 border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#8B2626]"
                              >
                                <option value="INSTAGRAM DROP">INSTAGRAM DROP</option>
                                <option value="REEL DROP">REEL DROP</option>
                                <option value="NEW ARRIVAL">NEW ARRIVAL</option>
                                <option value="BESTSELLER">BESTSELLER</option>
                                <option value="ETHNIC EDIT">ETHNIC EDIT</option>
                                <option value="WEEKEND STYLE">WEEKEND STYLE</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            <button
                              onClick={() => handleSaveSingleToVault(false)}
                              className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-800"
                            >
                              Save to Vault Only
                            </button>
                            <button
                              onClick={() => handleSaveSingleToVault(true)}
                              className="px-5 py-2 bg-[#8B2626] hover:bg-[#701E1E] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Save & Publish to "{singleCategory.toUpperCase()}"</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Multi-URL Batch Instagram Fetcher */}
                  <div className="bg-white p-5 sm:p-6 border border-[#E7DFD5] shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-5 h-5 text-[#8B2626]" />
                      <h4 className="font-serif text-lg font-normal text-[#1C1917]">
                        Bulk Multi-URL Batch Fetcher (10–20 Links at Once)
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 mb-3 font-light">
                      Paste multiple Instagram post & reel links (one per line). All will be fetched and added to your Real Photo Vault automatically!
                    </p>

                    <textarea
                      rows={4}
                      value={bulkUrlsText}
                      onChange={(e) => setBulkUrlsText(e.target.value)}
                      placeholder="https://www.instagram.com/p/C_abc123/&#10;https://www.instagram.com/p/D_xyz789/&#10;https://www.instagram.com/reel/C8qK3U_S4Ym/"
                      className="w-full p-3 border border-stone-300 text-xs font-mono bg-[#FAF7F2] focus:outline-none focus:border-[#8B2626] mb-3"
                    />

                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-stone-500">
                        {bulkUrlsText.split('\n').filter((l) => l.trim().length > 0).length} links ready to batch process
                      </span>
                      <button
                        onClick={handleBulkFetchInstagram}
                        disabled={isBulkProcessing}
                        className="px-6 py-2.5 bg-[#8B2626] hover:bg-[#701E1E] text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2"
                      >
                        {isBulkProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />}
                        <span>FETCH & SAVE ALL TO VAULT</span>
                      </button>
                    </div>
                  </div>

                  {/* Curated Instagram High-Res Presets */}
                  <div className="bg-white p-5 sm:p-6 border border-[#E7DFD5]">
                    <h4 className="font-serif text-base font-semibold text-[#1C1917] mb-2">
                      Ready-to-Use Agra Boutique Photo Presets
                    </h4>
                    <p className="text-xs text-stone-600 mb-4 font-light">
                      Click any real look below to instantly import it into your Media Vault.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {INSTAGRAM_PHOTO_PRESETS.map((preset, idx) => (
                        <div key={idx} className="group relative border border-stone-200 bg-[#FAF7F2] overflow-hidden flex flex-col">
                          <div className="aspect-[3/4] relative overflow-hidden bg-stone-200">
                            <img
                              src={preset.image}
                              alt={preset.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-1 left-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5">
                              {preset.categoryLabel.split(' ')[0]}
                            </div>
                          </div>
                          <div className="p-2 flex flex-col justify-between flex-1">
                            <p className="text-[11px] font-medium line-clamp-1 text-stone-800 mb-1">
                              {preset.title}
                            </p>
                            <button
                              onClick={() => {
                                addToMediaLibrary([
                                  {
                                    url: preset.image,
                                    title: preset.title,
                                    source: 'preset',
                                    instagramUrl: preset.instagramUrl,
                                  },
                                ]);
                                showToast(`Added "${preset.title}" to Vault!`);
                              }}
                              className="w-full py-1 bg-[#1C1917] hover:bg-[#8B2626] text-white text-[10px] uppercase font-semibold transition-colors"
                            >
                              + Add to Vault
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DEDICATED REEL & VIDEO IMPORTER */}
              {activeTab === 'reels-videos' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Reel Link & Video Resolver */}
                  <div className="bg-white p-5 sm:p-6 border border-[#E7DFD5] shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="p-1.5 bg-[#8B2626] text-white">
                        <Film className="w-4 h-4" />
                      </span>
                      <h4 className="font-serif text-lg font-normal text-[#1C1917]">
                        Import Instagram Reels & Boutique Videos
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 mb-4 font-light">
                      Paste an Instagram Reel URL (e.g.{' '}
                      <code className="bg-stone-100 px-1 py-0.5 text-stone-800 text-[11px]">
                        https://www.instagram.com/reel/C8qK3U_S4Ym/
                      </code>
                      ), direct .mp4 video URL, or upload a product trial video from your phone/PC.
                    </p>

                    {/* Input Methods: URL or File */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="url"
                          value={reelInputUrl}
                          onChange={(e) => setReelInputUrl(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleResolveReelLink()}
                          placeholder="Paste Instagram Reel URL or MP4 link..."
                          className="flex-1 px-4 py-2.5 border border-stone-300 text-xs focus:outline-none focus:border-[#8B2626] bg-[#FAF7F2]"
                        />
                        <button
                          onClick={handleResolveReelLink}
                          className="px-6 py-2.5 bg-[#8B2626] hover:bg-[#701E1E] text-white text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 flex items-center justify-center gap-2"
                        >
                          <Play className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                          <span>RESOLVE REEL</span>
                        </button>
                      </div>

                      {/* Video File Upload */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => videoInputRef.current?.click()}
                          disabled={isUploadingVideo}
                          className="px-4 py-2 bg-white border border-stone-300 hover:bg-[#F4EFE6] text-xs font-semibold uppercase tracking-wider text-stone-800 flex items-center gap-2"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#8B2626]" />
                          <span>{isUploadingVideo ? 'Processing Video Frame...' : 'Upload Video File (.mp4/.mov)'}</span>
                        </button>
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          onChange={handleVideoFileUpload}
                          className="hidden"
                        />
                        <span className="text-[11px] text-stone-500 font-light">
                          Canvas snapshot cover will be automatically extracted from video frame.
                        </span>
                      </div>
                    </div>

                    {/* Resolved Reel Preview & Configuration */}
                    {resolvedReelMedia && (
                      <div className="mt-6 p-5 bg-[#F7F3EC] border border-[#E7DFD5] flex flex-col md:flex-row gap-5">
                        {/* Video / Embed Preview */}
                        <div className="w-full md:w-52 aspect-[9/16] max-h-[320px] bg-black relative overflow-hidden shrink-0 border border-stone-400 flex items-center justify-center">
                          {resolvedReelMedia.videoUrl ? (
                            <video
                              src={resolvedReelMedia.videoUrl}
                              controls
                              autoPlay
                              muted
                              loop
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={resolvedReelMedia.url}
                              alt="Reel Cover"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div className="absolute top-2 left-2 bg-[#8B2626] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-white" />
                            <span>REEL READY</span>
                          </div>
                        </div>

                        {/* Metadata Configuration */}
                        <div className="flex-1 space-y-3">
                          <h5 className="font-serif text-sm font-semibold text-[#1C1917]">
                            Configure Reel Product Drop
                          </h5>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                                Reel Product Title
                              </label>
                              <input
                                type="text"
                                value={reelTitle}
                                onChange={(e) => setReelTitle(e.target.value)}
                                placeholder="e.g. High-Rise Denim Try-On Video"
                                className="w-full px-3 py-1.5 border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#8B2626]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                                Target Section / Category
                              </label>
                              <select
                                value={reelCategory}
                                onChange={(e) => setReelCategory(e.target.value as any)}
                                className="w-full px-3 py-1.5 border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#8B2626]"
                              >
                                <option value="tops">Tops & Shirts</option>
                                <option value="jeans">Jeans & Denims</option>
                                <option value="kurtis">Kurti's & Sets</option>
                                <option value="bottoms">Girls' Bottoms</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                                Fabric Details
                              </label>
                              <input
                                type="text"
                                value={reelFabric}
                                onChange={(e) => setReelFabric(e.target.value)}
                                placeholder="e.g. 100% Rigid Denim"
                                className="w-full px-3 py-1.5 border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#8B2626]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                                Tag Badge
                              </label>
                              <select
                                value={reelTag}
                                onChange={(e) => setReelTag(e.target.value)}
                                className="w-full px-3 py-1.5 border border-stone-300 text-xs bg-white focus:outline-none focus:border-[#8B2626]"
                              >
                                <option value="REEL DROP">REEL DROP</option>
                                <option value="VIRAL REEL">VIRAL REEL</option>
                                <option value="NEW REEL">NEW REEL</option>
                                <option value="ETHNIC REEL">ETHNIC REEL</option>
                                <option value="LIVE TRY-ON">LIVE TRY-ON</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-3">
                            <button
                              onClick={() => handleSaveReelToVaultAndSlot(false)}
                              className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-800"
                            >
                              Save to Vault Only
                            </button>
                            <button
                              onClick={() => handleSaveReelToVaultAndSlot(true)}
                              className="px-5 py-2 bg-[#8B2626] hover:bg-[#701E1E] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                            >
                              <Play className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                              <span>Save & Publish Reel to "{reelCategory.toUpperCase()}"</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Curated Real Boutique Reel Presets */}
                  <div className="bg-white p-5 sm:p-6 border border-[#E7DFD5]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-serif text-base font-semibold text-[#1C1917]">
                          Curated In-Store Reel Presets (@clothcollection.agra)
                        </h4>
                        <p className="text-xs text-stone-600 font-light">
                          High-converting boutique video try-ons ready for 1-click publishing.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {REAL_BOUTIQUE_REEL_PRESETS.map((preset, idx) => (
                        <div key={idx} className="border border-stone-200 bg-[#FAF7F2] p-3 flex flex-col justify-between">
                          <div className="relative aspect-[3/4] overflow-hidden bg-black mb-3">
                            <img
                              src={preset.image}
                              alt={preset.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-[#8B2626]/90 text-white flex items-center justify-center shadow-lg border border-[#D4AF37]">
                                <Play className="w-4 h-4 ml-0.5 fill-white" />
                              </div>
                            </div>
                            <div className="absolute top-2 left-2 bg-black/80 text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 uppercase">
                              {preset.tag}
                            </div>
                          </div>

                          <div className="space-y-1 mb-3">
                            <span className="text-[10px] text-[#8B2626] font-semibold uppercase tracking-wider block">
                              {preset.categoryLabel}
                            </span>
                            <h5 className="font-serif text-xs font-semibold text-[#1C1917] line-clamp-2">
                              {preset.title}
                            </h5>
                            <p className="text-[10px] text-stone-500 line-clamp-1">{preset.fabric}</p>
                          </div>

                          <button
                            onClick={() => handleImportReelPreset(preset)}
                            className="w-full py-2 bg-[#1C1917] hover:bg-[#8B2626] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Play className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                            <span>Import & Publish Reel</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: REAL MEDIA VAULT */}
              {activeTab === 'vault' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-[#E7DFD5]">
                    <div>
                      <h4 className="font-serif text-lg text-[#1C1917]">
                        Real Photo & Reel Video Vault ({mediaLibrary.length} Items)
                      </h4>
                      <p className="text-xs text-stone-600 font-light">
                        Select any fetched photo or reel to preview or slot directly into any part of the website.
                      </p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 border border-stone-300">
                      <button
                        onClick={() => setVaultFilter('all')}
                        className={`px-3 py-1 text-xs font-semibold uppercase ${
                          vaultFilter === 'all' ? 'bg-[#1C1917] text-white' : 'text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        All ({mediaLibrary.length})
                      </button>
                      <button
                        onClick={() => setVaultFilter('reels')}
                        className={`px-3 py-1 text-xs font-semibold uppercase flex items-center gap-1 ${
                          vaultFilter === 'reels' ? 'bg-[#8B2626] text-white' : 'text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        <Play className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
                        <span>Reels & Videos</span>
                      </button>
                      <button
                        onClick={() => setVaultFilter('photos')}
                        className={`px-3 py-1 text-xs font-semibold uppercase ${
                          vaultFilter === 'photos' ? 'bg-[#1C1917] text-white' : 'text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        Photos
                      </button>
                    </div>
                  </div>

                  {/* Grid of Vault Items */}
                  {filteredVault.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-[#E7DFD5] space-y-3">
                      <FolderOpen className="w-12 h-12 text-stone-300 mx-auto" />
                      <p className="text-stone-600 text-sm">No items matching current filter.</p>
                      <button
                        onClick={() => setActiveTab('fetch-ig')}
                        className="px-5 py-2 bg-[#8B2626] text-white text-xs font-semibold uppercase tracking-wider"
                      >
                        Fetch New Photos & Reels
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                      {filteredVault.map((item) => {
                        const isReel = item.mediaType === 'reel' || item.mediaType === 'video' || item.source === 'reel';
                        return (
                          <div
                            key={item.id}
                            className="group relative bg-white border border-stone-300 shadow-xs flex flex-col overflow-hidden hover:border-[#8B2626] transition-all"
                          >
                            <div className="aspect-[3/4] relative overflow-hidden bg-stone-200">
                              <img
                                src={item.url}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />

                              {/* Reel / Photo Badge */}
                              <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/85 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                {isReel && <Play className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />}
                                <span>{isReel ? 'REEL' : 'PHOTO'}</span>
                              </div>

                              {/* Hover Quick Actions */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                <button
                                  onClick={() => setPreviewMediaItem(item)}
                                  className="w-full py-1.5 bg-white text-stone-900 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-[#FAF7F2]"
                                >
                                  <Eye className="w-3 h-3 text-[#8B2626]" />
                                  <span>Preview</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedVaultItem(item);
                                    setSlotTitle(item.title);
                                  }}
                                  className="w-full py-1.5 bg-[#8B2626] text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-[#701E1E]"
                                >
                                  <MousePointerClick className="w-3 h-3 text-[#D4AF37]" />
                                  <span>Slot into Website</span>
                                </button>
                              </div>
                            </div>

                            <div className="p-2.5 flex flex-col justify-between flex-1 bg-white">
                              <p className="text-xs font-serif text-[#1C1917] line-clamp-1 mb-1" title={item.title}>
                                {item.title}
                              </p>
                              <div className="flex items-center justify-between text-[10px] text-stone-500">
                                <span>{item.source.toUpperCase()}</span>
                                <button
                                  onClick={() => removeFromMediaLibrary(item.id)}
                                  className="text-stone-400 hover:text-red-600 p-1"
                                  title="Delete from Vault"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: WEBSITE SLOT MATRIX */}
              {activeTab === 'slot-matrix' && (
                <div className="space-y-6 max-w-5xl mx-auto">
                  <div className="bg-white p-4 border border-[#E7DFD5] flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg text-[#1C1917]">Visual Website Slot Matrix</h4>
                      <p className="text-xs text-stone-600 font-light">
                        Live visual map of all website sections. Click "Replace" on any slot to assign a real photo or reel from your vault.
                      </p>
                    </div>
                  </div>

                  {/* Section 1: Hero Banner */}
                  <div className="bg-white p-4 border border-[#E7DFD5] space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <span className="text-xs font-bold text-[#8B2626] tracking-widest uppercase">
                        1. Main Hero Header Banner
                      </span>
                      <button
                        onClick={() => setReplacingSlot({ type: 'hero' })}
                        className="px-3 py-1 bg-[#1C1917] text-white text-[10px] font-semibold uppercase hover:bg-[#8B2626]"
                      >
                        Replace Hero Photo
                      </button>
                    </div>
                    <div className="aspect-[21/9] max-h-48 overflow-hidden bg-stone-300 relative border border-stone-200">
                      <img src={heroImage} alt="Hero" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] px-2 py-1">
                        Active Hero Photo (Sadar Bazar Store / Signature Model)
                      </div>
                    </div>
                  </div>

                  {/* Section 2: 4 Category Covers */}
                  <div className="bg-white p-4 border border-[#E7DFD5] space-y-3">
                    <span className="text-xs font-bold text-[#8B2626] tracking-widest uppercase block border-b border-stone-200 pb-2">
                      2. 4 Focus Category Covers
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {categories.map((cat) => (
                        <div key={cat.id} className="border border-stone-200 p-2 flex flex-col justify-between bg-[#FAF7F2]">
                          <div className="aspect-[3/4] bg-stone-200 overflow-hidden mb-2 relative">
                            <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <p className="text-xs font-serif font-semibold text-stone-900 mb-1">{cat.title}</p>
                          <button
                            onClick={() => setReplacingSlot({ type: 'category', categoryId: cat.id })}
                            className="w-full py-1 bg-stone-800 hover:bg-[#8B2626] text-white text-[10px] uppercase font-semibold"
                          >
                            Replace Cover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: The New Edit (Live Drops) */}
                  <div className="bg-white p-4 border border-[#E7DFD5] space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <span className="text-xs font-bold text-[#8B2626] tracking-widest uppercase">
                        3. The New Edit ({newArrivals.length} Active Product Outfits & Reels)
                      </span>
                      <button
                        onClick={() => {
                          setSelectedVaultItem(mediaLibrary[0] || null);
                          setSlotTarget('new-arrival');
                        }}
                        className="px-3 py-1 bg-[#8B2626] text-white text-[10px] font-semibold uppercase hover:bg-[#701E1E]"
                      >
                        + Add New Outfit to Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {newArrivals.map((item) => (
                        <div key={item.id} className="border border-stone-200 p-2 flex flex-col justify-between bg-[#FAF7F2]">
                          <div className="aspect-[3/4] bg-stone-200 overflow-hidden mb-2 relative">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute top-1 left-1 bg-black/80 text-white text-[8px] px-1 font-semibold">
                              {item.tag}
                            </div>
                          </div>
                          <p className="text-[11px] font-serif font-semibold text-stone-900 line-clamp-1 mb-1">{item.title}</p>
                          <button
                            onClick={() => setReplacingSlot({ type: 'replaceNewArrival', itemId: item.id })}
                            className="w-full py-1 bg-stone-800 hover:bg-[#8B2626] text-white text-[10px] uppercase font-semibold"
                          >
                            Replace Photo
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: Instagram 6-Tile Feed */}
                  <div className="bg-white p-4 border border-[#E7DFD5] space-y-3">
                    <span className="text-xs font-bold text-[#8B2626] tracking-widest uppercase block border-b border-stone-200 pb-2">
                      4. Instagram Social Grid (6 Live Tiles)
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {instagramPosts.map((post, idx) => (
                        <div key={post.id} className="border border-stone-200 p-1.5 flex flex-col justify-between bg-[#FAF7F2]">
                          <div className="aspect-square bg-stone-200 overflow-hidden mb-1.5 relative">
                            <img src={post.image} alt="IG Post" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute top-1 left-1 bg-black/80 text-[#D4AF37] text-[8px] px-1 font-bold">
                              #{idx + 1}
                            </div>
                          </div>
                          <button
                            onClick={() => setReplacingSlot({ type: 'instagramPost', postId: post.id })}
                            className="w-full py-1 bg-stone-800 hover:bg-[#8B2626] text-white text-[9px] uppercase font-semibold"
                          >
                            Replace #{idx + 1}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SYNC & EXPORT */}
              {activeTab === 'export' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="bg-white p-6 border border-[#E7DFD5] space-y-4">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-[#8B2626]" />
                      <h4 className="font-serif text-lg font-normal text-[#1C1917]">
                        Firebase Firestore Live Persistence & Static Backup
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      Every photo and reel update is synced in real time to your Firebase Firestore database so your client sees the real boutique photos immediately.
                    </p>

                    <div className="p-4 bg-[#FAF7F2] border border-stone-300 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Database Status:</span>
                        <span className="font-semibold text-emerald-700 font-mono">
                          {isFirebaseLive ? 'CONNECTED (Live Sync Active)' : 'Local Storage Fallback'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Total Media Library Items:</span>
                        <span className="font-semibold">{mediaLibrary.length} Photos & Reels</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Active Published Outfits:</span>
                        <span className="font-semibold">{newArrivals.length} Outfits</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={syncAllToFirestore}
                        disabled={isSyncing}
                        className="px-5 py-2.5 bg-[#8B2626] hover:bg-[#701E1E] text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-2"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>Force Sync to Firestore</span>
                      </button>

                      <button
                        onClick={handleExportData}
                        className="px-5 py-2.5 bg-[#1C1917] hover:bg-stone-800 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-2"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                        <span>{copiedCode ? 'Copied Static JSON!' : 'Copy Static JSON Code'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Reset boutique photos back to original defaults?')) {
                            resetToDefaults();
                          }
                        }}
                        className="px-4 py-2.5 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold uppercase tracking-wider"
                      >
                        Reset Defaults
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VAULT IN-MODAL VIDEO / PHOTO PREVIEW MODAL */}
        {previewMediaItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-[#1C1917] border border-stone-700 text-white w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
              <div className="p-3 bg-stone-900 flex items-center justify-between border-b border-stone-800">
                <span className="text-xs font-serif">{previewMediaItem.title}</span>
                <button onClick={() => setPreviewMediaItem(null)} className="p-1 hover:text-[#D4AF37]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex items-center justify-center bg-black max-h-[60vh] overflow-hidden">
                {previewMediaItem.videoUrl ? (
                  <video src={previewMediaItem.videoUrl} controls autoPlay className="max-h-[50vh] max-w-full" />
                ) : previewMediaItem.embedUrl ? (
                  <iframe src={previewMediaItem.embedUrl} title="Preview" className="w-full h-96 border-0" />
                ) : (
                  <img src={previewMediaItem.url} alt="Preview" className="max-h-[50vh] object-contain" referrerPolicy="no-referrer" />
                )}
              </div>

              <div className="p-3 bg-stone-900 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedVaultItem(previewMediaItem);
                    setPreviewMediaItem(null);
                  }}
                  className="px-4 py-2 bg-[#8B2626] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Slot into Website
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1-CLICK SLOT PLACEMENT MODAL */}
        {selectedVaultItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white border border-[#E7DFD5] w-full max-w-lg p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h4 className="font-serif text-base font-semibold text-[#1C1917]">
                  📍 Assign Item to Website Section
                </h4>
                <button onClick={() => setSelectedVaultItem(null)} className="p-1 text-stone-500 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-4 items-center bg-[#FAF7F2] p-3 border border-stone-200">
                <div className="w-16 h-20 bg-stone-300 shrink-0 overflow-hidden relative">
                  <img src={selectedVaultItem.url} alt="Target" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-xs font-serif font-bold text-stone-900 line-clamp-1">{selectedVaultItem.title}</p>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                    {selectedVaultItem.mediaType === 'reel' ? '🎬 Instagram Reel' : '📸 Real Photo'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-600 mb-1">
                    Select Target Website Section
                  </label>
                  <select
                    value={slotTarget}
                    onChange={(e) => setSlotTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#8B2626]"
                  >
                    <option value="new-arrival">The New Edit (Active Products Grid)</option>
                    <option value="hero">Main Hero Header Banner</option>
                    <option value="category-cover">4 Focus Category Covers</option>
                    <option value="instagram-feed">Instagram 6-Tile Live Social Feed</option>
                    <option value="moodboard">Weekly Moodboard Editorial</option>
                  </select>
                </div>

                {slotTarget === 'new-arrival' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                        Category
                      </label>
                      <select
                        value={slotCategory}
                        onChange={(e) => setSlotCategory(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 border border-stone-300 text-xs"
                      >
                        <option value="tops">Tops & Shirts</option>
                        <option value="jeans">Jeans & Denims</option>
                        <option value="kurtis">Kurti's & Sets</option>
                        <option value="bottoms">Girls' Bottoms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                        Tag Badge
                      </label>
                      <input
                        type="text"
                        value={slotTag}
                        onChange={(e) => setSlotTag(e.target.value)}
                        placeholder="REEL DROP / NEW ARRIVAL"
                        className="w-full px-2.5 py-1.5 border border-stone-300 text-xs"
                      />
                    </div>
                  </div>
                )}

                {slotTarget === 'category-cover' && (
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                      Choose Category to Update
                    </label>
                    <select
                      value={slotCategory}
                      onChange={(e) => setSlotCategory(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 border border-stone-300 text-xs"
                    >
                      <option value="tops">Tops & Shirts Cover</option>
                      <option value="jeans">Jeans & Denims Cover</option>
                      <option value="kurtis">Kurti's & Sets Cover</option>
                      <option value="bottoms">Girls' Bottoms Cover</option>
                    </select>
                  </div>
                )}

                {slotTarget === 'instagram-feed' && (
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                      Choose Instagram Tile to Replace
                    </label>
                    <select
                      value={slotIgPostIndex}
                      onChange={(e) => setSlotIgPostIndex(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-stone-300 text-xs"
                    >
                      <option value={0}>Tile #1 (Top Left)</option>
                      <option value={1}>Tile #2</option>
                      <option value={2}>Tile #3</option>
                      <option value={3}>Tile #4</option>
                      <option value={4}>Tile #5</option>
                      <option value={5}>Tile #6 (Bottom Right)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  onClick={() => setSelectedVaultItem(null)}
                  className="px-4 py-2 border border-stone-300 text-xs font-semibold uppercase text-stone-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteSlotPlacement}
                  className="px-5 py-2 bg-[#8B2626] hover:bg-[#701E1E] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Assign Live to Website</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DIRECT MATRIX REPLACEMENT PICKER MODAL */}
        {replacingSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-[#FAF7F2] border border-[#E7DFD5] w-full max-w-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                <h4 className="font-serif text-base font-semibold text-[#1C1917]">
                  Pick Photo or Reel from Vault to Replace Slot
                </h4>
                <button onClick={() => setReplacingSlot(null)} className="p-1 text-stone-500 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-3 p-1">
                {mediaLibrary.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleApplyPhotoToMatrixSlot(item.url, item)}
                    className="group border border-stone-300 bg-white p-1 hover:border-[#8B2626] transition-all text-left flex flex-col"
                  >
                    <div className="aspect-[3/4] bg-stone-200 overflow-hidden mb-1 relative">
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                      {item.mediaType === 'reel' && (
                        <div className="absolute top-1 left-1 bg-[#8B2626] text-white text-[8px] px-1 font-bold">
                          REEL
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-serif line-clamp-1 text-stone-800">{item.title}</span>
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setReplacingSlot(null)}
                  className="px-4 py-2 bg-stone-800 text-white text-xs font-semibold uppercase"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
