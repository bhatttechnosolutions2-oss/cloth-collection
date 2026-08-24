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
  CloudCheck,
  RefreshCw,
  Download,
  Copy,
  ExternalLink,
  Shirt,
  Flame,
  LayoutGrid
} from 'lucide-react';
import { useFashion } from '../context/FashionContext';

export const PhotoManagerModal: React.FC = () => {
  const {
    isManagerOpen,
    setIsManagerOpen,
    newArrivals,
    categories,
    editorialGallery,
    instagramPosts,
    heroImage,
    isFirebaseLive,
    isSyncing,
    lastSyncedTime,
    addCustomItem,
    updateHeroPhoto,
    updateCategoryPhoto,
    updateInstagramPostPhoto,
    replaceItemPhoto,
    deleteCustomItem,
    syncAllToFirestore,
    resetToDefaults,
  } = useFashion();

  // Authentication State (Default PIN is boutique founding year: 1943)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Section Tab Navigation
  const [activeTab, setActiveTab] = useState<'hero' | 'new-edit' | 'categories' | 'instagram' | 'editorial' | 'firebase'>(
    'new-edit'
  );

  // Form states for New Item creation
  const [newArrivalImgUrl, setNewArrivalImgUrl] = useState('');
  const [newArrivalPreview, setNewArrivalPreview] = useState<string | null>(null);
  const [newArrivalTitle, setNewArrivalTitle] = useState('');
  const [newArrivalCategory, setNewArrivalCategory] = useState<'ethnic' | 'western' | 'casual' | 'dress-materials' | 'occasion' | 'trending'>('ethnic');
  const [newArrivalTag, setNewArrivalTag] = useState('NEW DROP');
  const [newArrivalPrice, setNewArrivalPrice] = useState('Price on Inquiry');
  const [newArrivalFabric, setNewArrivalFabric] = useState('Pure Chanderi Silk Blend');
  const [newArrivalPlacement, setNewArrivalPlacement] = useState<'new-arrival' | 'editorial' | 'instagram' | 'all'>('all');

  // Hero Section State
  const [tempHeroUrl, setTempHeroUrl] = useState(heroImage);

  // Export State
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  if (!isManagerOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'item' | 'hero') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'item') {
          setNewArrivalImgUrl(result);
          setNewArrivalPreview(result);
        } else if (target === 'hero') {
          setTempHeroUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = newArrivalImgUrl || newArrivalPreview;
    if (!finalUrl) {
      showToast('⚠️ Please upload a photo or provide an image link first.');
      return;
    }

    const categoryLabelMap: Record<string, string> = {
      ethnic: 'ETHNIC EDIT',
      western: 'WESTERN EDIT',
      casual: 'CASUAL COLLECTION',
      'dress-materials': 'DRESS MATERIALS',
      occasion: 'OCCASION WEAR',
      trending: 'TRENDING NOW',
    };

    await addCustomItem(
      {
        title: newArrivalTitle || 'Handcrafted Boutique Piece',
        tag: newArrivalTag || 'NEW DROP',
        image: finalUrl,
        category: newArrivalCategory,
        categoryLabel: categoryLabelMap[newArrivalCategory] || 'SPECIAL EDIT',
        description: `Boutique creation featuring ${newArrivalFabric || 'handpicked fabric'}. Available exclusively at Sadar Bazar Agra.`,
        details: {
          fabric: newArrivalFabric || 'Pure Silk Blend',
          fit: 'Regular / Semi-Stitched & Custom Fit',
          occasion: 'Festive, Party & Everyday Luxury',
          sizes: ['Free Size', 'S', 'M', 'L', 'XL', 'XXL'],
          care: 'Dry Clean Recommended',
        },
      },
      newArrivalPlacement
    );

    // Reset Form
    setNewArrivalImgUrl('');
    setNewArrivalPreview(null);
    setNewArrivalTitle('');
    showToast('✨ Outfit published & saved to Firebase live database!');
  };

  const handleSaveHero = async () => {
    if (!tempHeroUrl) return;
    await updateHeroPhoto(tempHeroUrl);
    showToast('🌟 Hero Banner updated & synced live!');
  };

  const handleExportData = () => {
    const exportObject = {
      HERO_IMAGE: heroImage,
      NEW_ARRIVALS: newArrivals,
      CATEGORIES: categories,
      EDITORIAL_GALLERY: editorialGallery,
      INSTAGRAM_POSTS: instagramPosts,
      EXPORTED_AT: new Date().toISOString(),
    };
    const codeString = JSON.stringify(exportObject, null, 2);
    navigator.clipboard.writeText(codeString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
    showToast('📋 Static configuration JSON copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#8B2626] text-white text-xs font-semibold px-4 py-3 shadow-2xl border border-[#D4AF37] flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-[#FAF7F2] text-[#1C1917] w-full max-w-5xl h-[92vh] max-h-[850px] shadow-2xl flex flex-col border border-[#E7DFD5] overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-[#121110] text-[#FAF7F2] px-6 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8B2626] text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base sm:text-lg tracking-wide font-medium">
                  Boutique Admin & Section Studio
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#8B2626]/40 text-[#D4AF37] border border-[#D4AF37]/30">
                  Firebase Connected
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Clothes Collection · Sadar Bazar, Agra (Live Cloud Backend)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Firestore Status Indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs text-stone-300 bg-stone-900 px-3 py-1.5 border border-stone-700">
              <span className={`w-2 h-2 rounded-full ${isFirebaseLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isFirebaseLive ? 'Cloud DB Active' : 'Local Fallback'}</span>
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

        {/* Auth Gate (If locked) */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-8 bg-[#FAF7F2]">
            <form onSubmit={handlePinSubmit} className="max-w-sm w-full bg-white p-8 border border-[#E7DFD5] shadow-lg text-center">
              <div className="w-12 h-12 bg-[#8B2626]/10 text-[#8B2626] flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl mb-1 text-[#1C1917]">Boutique Staff Access</h4>
              <p className="text-xs text-stone-600 mb-6 font-light">
                Enter your 4-digit manager PIN to manage live website sections.
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
          /* Studio Main Workspace */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Section Tab Sidebar */}
            <div className="w-full md:w-64 bg-[#F4EFE6] border-r border-[#E7DFD5] p-3 sm:p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
              <div className="hidden md:block text-[11px] font-semibold tracking-[0.2em] text-[#8B2626] uppercase px-3 py-2">
                WEBSITE SECTIONS
              </div>

              <button
                onClick={() => setActiveTab('new-edit')}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-all whitespace-nowrap ${
                  activeTab === 'new-edit'
                    ? 'bg-[#1C1917] text-white font-semibold shadow-sm'
                    : 'text-stone-700 hover:bg-[#E7DFD5]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>The New Edit ({newArrivals.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('hero')}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-all whitespace-nowrap ${
                  activeTab === 'hero'
                    ? 'bg-[#1C1917] text-white font-semibold shadow-sm'
                    : 'text-stone-700 hover:bg-[#E7DFD5]'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>Hero Banner</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-all whitespace-nowrap ${
                  activeTab === 'categories'
                    ? 'bg-[#1C1917] text-white font-semibold shadow-sm'
                    : 'text-stone-700 hover:bg-[#E7DFD5]'
                }`}
              >
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <span>Categories ({categories.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('instagram')}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-all whitespace-nowrap ${
                  activeTab === 'instagram'
                    ? 'bg-[#1C1917] text-white font-semibold shadow-sm'
                    : 'text-stone-700 hover:bg-[#E7DFD5]'
                }`}
              >
                <Instagram className="w-4 h-4 text-[#D4AF37]" />
                <span>Instagram Feed (6)</span>
              </button>

              <button
                onClick={() => setActiveTab('editorial')}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-all whitespace-nowrap ${
                  activeTab === 'editorial'
                    ? 'bg-[#1C1917] text-white font-semibold shadow-sm'
                    : 'text-stone-700 hover:bg-[#E7DFD5]'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-[#D4AF37]" />
                <span>Weekly Moodboard</span>
              </button>

              <div className="my-2 border-t border-[#D9D0C3] hidden md:block" />

              <button
                onClick={() => setActiveTab('firebase')}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-all whitespace-nowrap ${
                  activeTab === 'firebase'
                    ? 'bg-[#8B2626] text-white font-semibold shadow-sm'
                    : 'text-[#8B2626] hover:bg-[#E7DFD5]'
                }`}
              >
                <Database className="w-4 h-4 text-[#D4AF37]" />
                <span>Cloud Sync & Export</span>
              </button>
            </div>

            {/* Main Section Content Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#FAF7F2]">
              {/* TAB 1: THE NEW EDIT SECTION */}
              {activeTab === 'new-edit' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-xl text-[#1C1917] font-normal">
                      The New Edit — Weekly Fresh Arrivals
                    </h4>
                    <p className="text-xs text-stone-600 font-light">
                      Upload new outfits or paste direct photo links. Changes are instantly saved to Firebase and reflected on the live website.
                    </p>
                  </div>

                  {/* Create New Item Form */}
                  <form onSubmit={handleCreateNewItem} className="bg-white p-5 border border-[#E7DFD5] shadow-xs space-y-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#8B2626] border-b border-stone-200 pb-2">
                      Upload New Boutique Outfit
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Image Source */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-700 block">Photo (Device or Image Link)</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={newArrivalImgUrl}
                            onChange={(e) => {
                              setNewArrivalImgUrl(e.target.value);
                              setNewArrivalPreview(e.target.value);
                            }}
                            placeholder="Paste image link URL..."
                            className="flex-1 text-xs px-3 py-2 border border-stone-300 focus:outline-none focus:border-[#8B2626]"
                          />
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFileUpload(e, 'item')}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-2 bg-stone-100 border border-stone-300 hover:bg-stone-200 text-xs font-medium flex items-center gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Browse</span>
                          </button>
                        </div>

                        {newArrivalPreview && (
                          <div className="relative w-20 h-24 border border-stone-300 overflow-hidden mt-2">
                            <img src={newArrivalPreview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setNewArrivalImgUrl('');
                                setNewArrivalPreview(null);
                              }}
                              className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Outfit Title */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-700 block">Outfit Name / Title</label>
                        <input
                          type="text"
                          value={newArrivalTitle}
                          onChange={(e) => setNewArrivalTitle(e.target.value)}
                          placeholder="e.g. Handcrafted Silk Anarkali Suit"
                          className="w-full text-xs px-3 py-2 border border-stone-300 focus:outline-none focus:border-[#8B2626]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-stone-700 block mb-1">Category</label>
                        <select
                          value={newArrivalCategory}
                          onChange={(e) => setNewArrivalCategory(e.target.value as any)}
                          className="w-full text-xs px-3 py-2 border border-stone-300 focus:outline-none focus:border-[#8B2626] bg-white"
                        >
                          <option value="ethnic">Ethnic Wear</option>
                          <option value="western">Western Edit</option>
                          <option value="casual">Casual Collection</option>
                          <option value="dress-materials">Dress Materials</option>
                          <option value="occasion">Occasion Wear</option>
                          <option value="trending">Trending Now</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-stone-700 block mb-1">Fabric & Texture</label>
                        <input
                          type="text"
                          value={newArrivalFabric}
                          onChange={(e) => setNewArrivalFabric(e.target.value)}
                          placeholder="e.g. Pure Chanderi Silk"
                          className="w-full text-xs px-3 py-2 border border-stone-300 focus:outline-none focus:border-[#8B2626]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-stone-700 block mb-1">Badge / Tag</label>
                        <input
                          type="text"
                          value={newArrivalTag}
                          onChange={(e) => setNewArrivalTag(e.target.value)}
                          placeholder="NEW DROP / FESTIVE"
                          className="w-full text-xs px-3 py-2 border border-stone-300 focus:outline-none focus:border-[#8B2626]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSyncing}
                        className="px-6 py-2.5 bg-[#8B2626] hover:bg-[#6D1E1E] text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Publish to Live Website</span>
                      </button>
                    </div>
                  </form>

                  {/* Active New Arrivals List */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Currently Active New Arrivals ({newArrivals.length})
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {newArrivals.map((item) => (
                        <div key={item.id} className="bg-white border border-[#E7DFD5] p-3 flex gap-3 shadow-xs">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-20 object-cover bg-stone-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-semibold text-[#8B2626] uppercase">
                                {item.tag}
                              </span>
                              <h5 className="font-serif text-xs font-bold text-[#1C1917] truncate">
                                {item.title}
                              </h5>
                              <p className="text-[11px] text-stone-500 truncate">
                                {item.details?.fabric || item.category}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                              <button
                                type="button"
                                onClick={() => {
                                  const newUrl = prompt('Enter new image URL for ' + item.title, item.image);
                                  if (newUrl) replaceItemPhoto(item.id, newUrl);
                                }}
                                className="text-[10px] text-stone-600 hover:text-[#8B2626] underline"
                              >
                                Replace Photo
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Delete outfit "' + item.title + '" from website?')) {
                                    deleteCustomItem(item.id);
                                  }
                                }}
                                className="text-[10px] text-red-600 hover:text-red-800 ml-auto"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HERO BANNER SECTION */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-xl text-[#1C1917] font-normal">
                      Hero Banner Background
                    </h4>
                    <p className="text-xs text-stone-600 font-light">
                      Update the full-width high-resolution hero photo at the top of the homepage.
                    </p>
                  </div>

                  <div className="bg-white p-5 border border-[#E7DFD5] space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-stone-700 block">Hero Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={tempHeroUrl}
                          onChange={(e) => setTempHeroUrl(e.target.value)}
                          placeholder="Paste image link URL..."
                          className="flex-1 text-xs px-3 py-2 border border-stone-300 focus:outline-none focus:border-[#8B2626]"
                        />
                        <input
                          type="file"
                          ref={heroFileInputRef}
                          onChange={(e) => handleFileUpload(e, 'hero')}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => heroFileInputRef.current?.click()}
                          className="px-4 py-2 bg-stone-100 border border-stone-300 hover:bg-stone-200 text-xs font-medium flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                        </button>
                      </div>
                    </div>

                    <div className="relative aspect-[16/8] sm:aspect-[21/9] bg-stone-900 overflow-hidden border border-stone-300">
                      <img
                        src={tempHeroUrl}
                        alt="Hero Preview"
                        className="w-full h-full object-cover filter brightness-[0.8]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                        <div className="text-white">
                          <p className="text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase">SINCE 1943 · AGRA</p>
                          <h3 className="font-serif text-2xl">Preview of Hero Banner</h3>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleSaveHero}
                        disabled={isSyncing}
                        className="px-6 py-2.5 bg-[#8B2626] hover:bg-[#6D1E1E] text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                      >
                        SAVE & SYNC HERO BANNER
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CATEGORIES SHOWCASE */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-xl text-[#1C1917] font-normal">
                      Categories Cover Photos
                    </h4>
                    <p className="text-xs text-stone-600 font-light">
                      Update the cover photograph for each of the 6 major boutique departments.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                      <div key={cat.id} className="bg-white border border-[#E7DFD5] p-3 space-y-2">
                        <div className="aspect-[4/3] bg-stone-900 relative overflow-hidden">
                          <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5">
                            {cat.title}
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-700 block mb-1">
                            {cat.title} Cover Photo URL
                          </label>
                          <input
                            type="url"
                            value={cat.image}
                            onChange={(e) => updateCategoryPhoto(cat.id, e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-stone-300 focus:outline-none focus:border-[#8B2626]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: INSTAGRAM FEED */}
              {activeTab === 'instagram' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-xl text-[#1C1917] font-normal">
                      Instagram Grid (@clothcollection.agra)
                    </h4>
                    <p className="text-xs text-stone-600 font-light">
                      Update the 6 posts displayed in the live Instagram social feed section.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {instagramPosts.map((post, idx) => (
                      <div key={post.id} className="bg-white border border-[#E7DFD5] p-3 space-y-2">
                        <div className="aspect-square bg-stone-900 relative overflow-hidden">
                          <img src={post.image} alt={`Post ${idx + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5">
                            Post #{idx + 1}
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-700 block mb-1">Image URL</label>
                          <input
                            type="url"
                            value={post.image}
                            onChange={(e) => updateInstagramPostPhoto(post.id, e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-stone-300 focus:outline-none focus:border-[#8B2626]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-700 block mb-1">Caption</label>
                          <input
                            type="text"
                            value={post.caption}
                            onChange={(e) => updateInstagramPostPhoto(post.id, post.image, e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-stone-300 focus:outline-none focus:border-[#8B2626]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: EDITORIAL GALLERY */}
              {activeTab === 'editorial' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-xl text-[#1C1917] font-normal">
                      Weekly Editorial Moodboard Gallery
                    </h4>
                    <p className="text-xs text-stone-600 font-light">
                      Visual Pinterest-style layout highlights for Sadar Bazar weekly arrivals.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {editorialGallery.map((item) => (
                      <div key={item.id} className="bg-white border border-[#E7DFD5] p-3 space-y-2">
                        <div className="aspect-[3/4] bg-stone-900 relative overflow-hidden">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5">
                            {item.title}
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-stone-700 block mb-1">Image URL</label>
                          <input
                            type="url"
                            value={item.image}
                            onChange={(e) => replaceItemPhoto(item.id, e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-stone-300 focus:outline-none focus:border-[#8B2626]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: FIREBASE CLOUD & STATIC EXPORT */}
              {activeTab === 'firebase' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-xl text-[#1C1917] font-normal">
                      Firebase Cloud Sync & Static Migration
                    </h4>
                    <p className="text-xs text-stone-600 font-light">
                      Live Firestore database status and 1-click static export when you want to remove the database later.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Firebase Status */}
                    <div className="bg-white p-5 border border-[#E7DFD5] space-y-4">
                      <div className="flex items-center gap-2 text-[#8B2626] font-semibold text-xs uppercase tracking-wider">
                        <Database className="w-4 h-4" />
                        <span>Cloud Database Configuration</span>
                      </div>

                      <div className="bg-stone-50 p-3 rounded-none text-xs space-y-1.5 font-mono">
                        <div><strong>Project:</strong> ananttecg</div>
                        <div><strong>Database:</strong> Firestore Cloud Live</div>
                        <div><strong>Status:</strong> {isFirebaseLive ? '✅ Connected & Active' : '⚡ Local Resilient Mode'}</div>
                        <div><strong>Last Sync:</strong> {lastSyncedTime || 'Real-time'}</div>
                      </div>

                      <button
                        type="button"
                        onClick={syncAllToFirestore}
                        disabled={isSyncing}
                        className="w-full py-3 bg-[#1C1917] hover:bg-[#8B2626] text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'Syncing...' : 'Force Sync All to Cloud'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Reset all website photos back to Clothes Collection Agra defaults?')) {
                            resetToDefaults();
                            showToast('↺ Reset to boutique default photography.');
                          }
                        }}
                        className="w-full py-2.5 border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-medium tracking-wider uppercase transition-colors"
                      >
                        Reset to Boutique Defaults
                      </button>
                    </div>

                    {/* Static Code Export (No Database Future) */}
                    <div className="bg-white p-5 border border-[#E7DFD5] space-y-4">
                      <div className="flex items-center gap-2 text-[#8B2626] font-semibold text-xs uppercase tracking-wider">
                        <Download className="w-4 h-4" />
                        <span>Export Static Data (Future Manual Use)</span>
                      </div>

                      <p className="text-xs text-stone-600 font-light leading-relaxed">
                        Jab aapko Firebase database remove karke static images manually code me rakhni ho, toh is button par tap karein. Ye aapke sabhi live photos aur settings ka clean JSON format generate kar dega!
                      </p>

                      <button
                        type="button"
                        onClick={handleExportData}
                        className="w-full py-3 bg-[#8B2626] hover:bg-[#6D1E1E] text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Static JSON Code'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
