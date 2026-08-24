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
  ArrowRight
} from 'lucide-react';
import { useFashion } from '../context/FashionContext';

// Preset high-fashion boutique photo samples for quick selection if needed
const PRESET_COLLECTIONS = [
  {
    title: 'Ivory Hand-Embroidered Anarkali',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=85&w=1200&auto=format&fit=crop',
    category: 'ethnic',
    tag: 'Bridal & Festive',
    price: '₹4,890',
  },
  {
    title: 'Emerald Chanderi Kurta Suit Set',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=85&w=1200&auto=format&fit=crop',
    category: 'ethnic',
    tag: 'Occasion Edit',
    price: '₹3,450',
  },
  {
    title: 'Pastel Linen Blazer Co-ord Set',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=85&w=1200&auto=format&fit=crop',
    category: 'western',
    tag: 'Western Elegance',
    price: '₹2,690',
  },
  {
    title: 'Mustard Cotton Silk Festive Dupatta Suit',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=85&w=1200&auto=format&fit=crop',
    category: 'dress-material',
    tag: 'Pure Fabric',
    price: '₹2,190',
  },
  {
    title: 'Crimson Georgette Flowy Anarkali',
    url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=85&w=1200&auto=format&fit=crop',
    category: 'ethnic',
    tag: 'New Drop',
    price: '₹3,850',
  },
  {
    title: 'Contemporary Minimalist Trench & Trousers',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=85&w=1200&auto=format&fit=crop',
    category: 'western',
    tag: 'Modern Classic',
    price: '₹3,200',
  },
];

export const PhotoManagerModal: React.FC = () => {
  const {
    isManagerOpen,
    setIsManagerOpen,
    newArrivals,
    categories,
    instagramPosts,
    heroImage,
    addCustomItem,
    updateHeroPhoto,
    updateCategoryPhoto,
    updateInstagramPostPhoto,
    deleteCustomItem,
    resetToDefaults,
  } = useFashion();

  const [activeTab, setActiveTab] = useState<'upload' | 'hero' | 'categories' | 'instagram' | 'manage'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'ethnic' | 'western' | 'casual' | 'dress-material' | 'occasion' | 'trending'>('ethnic');
  const [tag, setTag] = useState('New Drop');
  const [price, setPrice] = useState('₹2,450');
  const [fabric, setFabric] = useState('Pure Chanderi Silk');
  const [placement, setPlacement] = useState<'new-arrival' | 'editorial' | 'instagram' | 'all'>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isManagerOpen) return null;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_COLLECTIONS[0]) => {
    setImageUrl(preset.url);
    setImagePreview(preset.url);
    setTitle(preset.title);
    setTag(preset.tag);
    setPrice(preset.price);
    setCategory(preset.category as any);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Kripya ek photo select karein ya Instagram/Image URL dalein');
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

    addCustomItem(
      {
        title: title || 'Curated Boutique Piece',
        tag: tag || 'NEW DROP',
        image: imageUrl,
        category: (category === 'dress-material' ? 'dress-materials' : category) as any,
        categoryLabel: categoryLabelMap[category] || 'SPECIAL EDIT',
        description: `Handcrafted boutique creation featuring ${fabric || 'pure fabric'}. Available exclusively at our Sadar Bazar, Agra showroom.`,
        details: {
          fabric: fabric || 'Pure Silk Blend',
          fit: 'Regular / Semi-Stitched & Custom Fit',
          occasion: 'Festive, Party & Everyday Luxury',
          sizes: ['Free Size', 'S', 'M', 'L', 'XL', 'XXL'],
          care: 'Dry Clean Recommended',
        },
      },
      placement
    );

    showToast('Photo successfully added to website collection!');
    // Reset form
    setImagePreview(null);
    setImageUrl('');
    setTitle('');
    setPrice('₹2,450');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] text-[#1C1917] w-full max-w-4xl max-h-[90vh] rounded-none shadow-2xl flex flex-col border border-[#E7E2D8] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E2D8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1C1917] text-white flex items-center justify-center">
              <Instagram className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-[#1C1917] tracking-tight">
                  Client Photo & Instagram Media Manager
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-[#8B2626]/10 text-[#8B2626]">
                  Live Visual Editor
                </span>
              </div>
              <p className="text-xs text-[#78716C]">
                Apne client ke Instagram se download kiye huye photos ya direct links yahan upload karein.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsManagerOpen(false)}
            className="p-2 hover:bg-[#F5F2EB] text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Notification */}
        {successToast && (
          <div className="bg-[#1C1917] text-[#FAF7F2] px-6 py-2.5 text-xs flex items-center justify-between animate-fadeIn border-b border-[#D4AF37]">
            <div className="flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>{successToast}</span>
            </div>
            <span className="text-[10px] text-[#A8A29E]">Website updated instantly</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center border-b border-[#E7E2D8] bg-[#F5F2EB] px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-3 text-xs uppercase tracking-wider font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'upload'
                ? 'border-[#8B2626] text-[#8B2626] bg-white font-bold'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Add New Photos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-3 text-xs uppercase tracking-wider font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-[#8B2626] text-[#8B2626] bg-white font-bold'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Category Photos
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`py-3 px-3 text-xs uppercase tracking-wider font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'instagram'
                ? 'border-[#8B2626] text-[#8B2626] bg-white font-bold'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            Instagram Feed Posts
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-3 px-3 text-xs uppercase tracking-wider font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'hero'
                ? 'border-[#8B2626] text-[#8B2626] bg-white font-bold'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Hero Banner Image
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-3 px-3 text-xs uppercase tracking-wider font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'manage'
                ? 'border-[#8B2626] text-[#8B2626] bg-white font-bold'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            View Active Items ({newArrivals.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* TAB 1: UPLOAD NEW PHOTO */}
          {activeTab === 'upload' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form & Inputs */}
              <div className="lg:col-span-7 space-y-5">
                <form onSubmit={handleAddNewItem} className="space-y-4">
                  {/* Photo Input Source */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C1917] mb-2">
                      1. Choose Image Source (Instagram Download or URL)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Local File Upload Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="border border-dashed border-[#A8A29E] hover:border-[#8B2626] p-4 text-center bg-white flex flex-col items-center justify-center gap-1.5 transition-all group"
                      >
                        <Upload className="w-5 h-5 text-[#78716C] group-hover:text-[#8B2626]" />
                        <span className="text-xs font-semibold text-[#1C1917]">Upload from Device</span>
                        <span className="text-[10px] text-[#78716C]">Phone/PC se photo chunein</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      {/* Image URL Box */}
                      <div className="border border-[#E7E2D8] p-3 bg-white flex flex-col justify-center">
                        <span className="text-[11px] font-semibold text-[#1C1917] mb-1 flex items-center gap-1">
                          <LinkIcon className="w-3 h-3 text-[#8B2626]" /> Or Paste Image Link:
                        </span>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={imageUrl}
                          onChange={(e) => {
                            setImageUrl(e.target.value);
                            setImagePreview(e.target.value);
                          }}
                          className="w-full text-xs p-1.5 border border-[#E7E2D8] bg-[#FAF7F2] focus:border-[#8B2626] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Title & Tag */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#78716C] mb-1">
                        Outfit Title / Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ivory Organza Anarkali Set"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-xs p-2 border border-[#E7E2D8] bg-white focus:border-[#8B2626] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#78716C] mb-1">
                        Badge Tag
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. New Drop, Instagram Trend"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="w-full text-xs p-2 border border-[#E7E2D8] bg-white focus:border-[#8B2626] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Category & Placement */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#78716C] mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full text-xs p-2 border border-[#E7E2D8] bg-white focus:border-[#8B2626] focus:outline-none"
                      >
                        <option value="ethnic">Ethnic Wear (Suits, Sarees, Kurta)</option>
                        <option value="western">Western Edit (Co-ords, Dresses)</option>
                        <option value="casual">Casual Collection</option>
                        <option value="dress-material">Unstitched Dress Materials</option>
                        <option value="occasion">Occasion & Wedding</option>
                        <option value="trending">Trending Styles</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#78716C] mb-1">
                        Where to display on website
                      </label>
                      <select
                        value={placement}
                        onChange={(e) => setPlacement(e.target.value as any)}
                        className="w-full text-xs p-2 border border-[#E7E2D8] bg-white focus:border-[#8B2626] focus:outline-none"
                      >
                        <option value="all">Everywhere (New Arrivals + Moodboard)</option>
                        <option value="new-arrival">The New Edit (Homepage Top)</option>
                        <option value="editorial">Weekly Moodboard Gallery</option>
                        <option value="instagram">Instagram Social Feed</option>
                      </select>
                    </div>
                  </div>

                  {/* Fabric & Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#78716C] mb-1">
                        Fabric / Work
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pure Georgette Zari Work"
                        value={fabric}
                        onChange={(e) => setFabric(e.target.value)}
                        className="w-full text-xs p-2 border border-[#E7E2D8] bg-white focus:border-[#8B2626] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#78716C] mb-1">
                        Estimated Price or Note
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹3,250 or Inquire at Store"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full text-xs p-2 border border-[#E7E2D8] bg-white focus:border-[#8B2626] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#8B2626] hover:bg-[#6D1E1E] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-md mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    Publish Photo To Live Website
                  </button>
                </form>
              </div>

              {/* Right Column: Live Photo Preview & Quick Presets */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-4 border border-[#E7E2D8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-semibold tracking-wider text-[#1C1917]">
                      Live Card Preview
                    </span>
                    {imagePreview && (
                      <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 font-bold">
                        Ready to Add
                      </span>
                    )}
                  </div>

                  <div className="aspect-[3/4] bg-[#F5F2EB] relative overflow-hidden border border-[#E7E2D8]">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#A8A29E]">
                        <ImageIcon className="w-10 h-10 mb-2 stroke-[1.2]" />
                        <p className="text-xs font-medium">No photo selected yet</p>
                        <p className="text-[11px] text-[#78716C] mt-1">
                          Upload a photo from your client's Instagram or choose one of the boutique presets below.
                        </p>
                      </div>
                    )}

                    {imagePreview && (
                      <div className="absolute top-2 left-2 bg-[#1C1917]/90 backdrop-blur-xs text-white text-[9px] uppercase font-bold tracking-widest px-2 py-1">
                        {tag || 'New Drop'}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <h4 className="font-serif font-bold text-sm text-[#1C1917] truncate">
                      {title || 'Sample Outfit Title'}
                    </h4>
                    <p className="text-xs text-[#8B2626] font-medium">{price || '₹2,450'}</p>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="bg-[#F5F2EB] p-3 border border-[#E7E2D8]">
                  <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Quick Boutique Presets</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_COLLECTIONS.slice(0, 3).map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(p)}
                        className="group text-left border border-[#E7E2D8] bg-white p-1 hover:border-[#8B2626] transition-all"
                      >
                        <div className="aspect-[3/4] bg-[#FAF7F2] overflow-hidden mb-1">
                          <img
                            src={p.url}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <p className="text-[9px] font-semibold text-[#1C1917] truncate leading-tight">
                          {p.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORY TILES MANAGER */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="bg-white p-4 border border-[#E7E2D8] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#1C1917]">
                    Shop By Collection Category Cover Photos
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    Change the main cover photos of Ethnic, Western, Casual, and Dress Material sections.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white p-3 border border-[#E7E2D8] flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs text-[#1C1917]">
                        {cat.title}
                      </span>
                      <span className="text-[10px] text-[#78716C] uppercase tracking-wider">
                        {cat.itemCount}
                      </span>
                    </div>

                    <div className="aspect-[4/5] bg-[#F5F2EB] overflow-hidden relative">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-semibold text-[#78716C]">
                        Replace Image URL:
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="url"
                          defaultValue={cat.image}
                          onBlur={(e) => {
                            if (e.target.value && e.target.value !== cat.image) {
                              updateCategoryPhoto(cat.id, e.target.value);
                              showToast(`Updated ${cat.title} category photo!`);
                            }
                          }}
                          placeholder="Paste new photo URL..."
                          className="flex-grow text-[11px] p-1.5 border border-[#E7E2D8] bg-[#FAF7F2] focus:outline-none focus:border-[#8B2626]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INSTAGRAM POSTS MANAGER */}
          {activeTab === 'instagram' && (
            <div className="space-y-4">
              <div className="bg-white p-4 border border-[#E7E2D8] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#1C1917]">
                    Instagram Section Photos (@clothcollection.agra)
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    Update the 6 Instagram preview tiles displayed in the social feed section.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {instagramPosts.map((post, idx) => (
                  <div key={post.id} className="bg-white p-3 border border-[#E7E2D8] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#78716C]">
                      <span>Post #{idx + 1}</span>
                      <span>❤️ {post.likes}</span>
                    </div>

                    <div className="aspect-square bg-[#F5F2EB] overflow-hidden">
                      <img
                        src={post.image}
                        alt="Instagram"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <input
                      type="url"
                      defaultValue={post.image}
                      onBlur={(e) => {
                        if (e.target.value && e.target.value !== post.image) {
                          updateInstagramPostPhoto(post.id, e.target.value);
                          showToast(`Updated Instagram Post #${idx + 1}`);
                        }
                      }}
                      placeholder="New Instagram Image URL..."
                      className="w-full text-[11px] p-1.5 border border-[#E7E2D8] bg-[#FAF7F2] focus:outline-none focus:border-[#8B2626]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HERO BANNER IMAGE */}
          {activeTab === 'hero' && (
            <div className="bg-white p-6 border border-[#E7E2D8] space-y-5">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1C1917]">
                  Main Hero Banner Photo
                </h3>
                <p className="text-xs text-[#78716C]">
                  The prominent full-width background photo at the top of the homepage.
                </p>
              </div>

              <div className="aspect-[16/9] max-h-[300px] w-full bg-[#1C1917] overflow-hidden relative border border-[#E7E2D8]">
                <img
                  src={heroImage}
                  alt="Hero Background"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center p-6 text-white">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37]">
                      Hero Preview
                    </span>
                    <h4 className="font-serif text-xl font-bold tracking-tight">
                      FASHION THAT MOVES WITH YOU
                    </h4>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-[#1C1917]">
                  Replace Hero Background Image URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    defaultValue={heroImage}
                    id="hero-input"
                    placeholder="https://..."
                    className="flex-grow text-xs p-2.5 border border-[#E7E2D8] bg-[#FAF7F2] focus:outline-none focus:border-[#8B2626]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('hero-input') as HTMLInputElement;
                      if (input && input.value) {
                        updateHeroPhoto(input.value);
                        showToast('Hero photo updated!');
                      }
                    }}
                    className="px-5 py-2.5 bg-[#8B2626] text-white text-xs uppercase font-semibold tracking-wider hover:bg-[#6D1E1E]"
                  >
                    Apply Hero Photo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MANAGE ACTIVE ITEMS */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 border border-[#E7E2D8]">
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#1C1917]">
                    Active Outfits in Catalogue ({newArrivals.length})
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    Manage, edit, or delete any outfit cards currently shown on the website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all photos to default boutique collection?')) {
                      resetToDefaults();
                      showToast('Reset to default photos successfully.');
                    }
                  }}
                  className="px-3 py-1.5 text-xs text-[#78716C] hover:text-[#8B2626] border border-[#E7E2D8] hover:border-[#8B2626] flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Default
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {newArrivals.map((item) => (
                  <div key={item.id} className="bg-white p-3 border border-[#E7E2D8] flex gap-3 items-center">
                    <div className="w-16 h-20 bg-[#F5F2EB] flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <span className="text-[9px] uppercase font-bold text-[#8B2626] bg-[#8B2626]/10 px-1.5 py-0.5">
                        {item.tag}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-[#1C1917] truncate mt-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#78716C] truncate">{item.details?.fabric || 'Pure Fabric'}</p>
                      <p className="text-xs font-semibold text-[#8B2626]">{item.details?.occasion || 'Available in store'}</p>
                    </div>
                    {item.id.startsWith('custom-') && (
                      <button
                        type="button"
                        onClick={() => {
                          deleteCustomItem(item.id);
                          showToast(`Removed ${item.title}`);
                        }}
                        className="p-2 text-[#A8A29E] hover:text-red-600 transition-colors"
                        title="Delete custom outfit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E7E2D8] flex items-center justify-between">
          <div className="text-xs text-[#78716C] flex items-center gap-1.5">
            <Check className="w-4 h-4 text-green-600" />
            <span>All uploads & edits are automatically saved to your session and live preview.</span>
          </div>

          <button
            type="button"
            onClick={() => setIsManagerOpen(false)}
            className="px-6 py-2.5 bg-[#1C1917] text-white hover:bg-[#8B2626] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
          >
            <span>Done & View Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
