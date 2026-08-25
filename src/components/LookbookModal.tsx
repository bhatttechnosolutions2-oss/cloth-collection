import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, MapPin, CheckCircle2, Sparkles, Share2, Phone, Play, Image as ImageIcon, Video, Instagram } from 'lucide-react';
import { FashionItem } from '../types';
import { STORE_INFO } from '../data/fashionData';

interface LookbookModalProps {
  item: FashionItem | null;
  onClose: () => void;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({ item, onClose }) => {
  const [activeMediaView, setActiveMediaView] = useState<'photo' | 'reel'>('photo');

  if (!item) return null;

  const hasReelOrVideo = Boolean(
    item.mediaType === 'reel' ||
    item.mediaType === 'video' ||
    item.videoUrl ||
    item.embedUrl ||
    item.instagramReelId ||
    item.tag?.includes('REEL')
  );

  const whatsappMessage = encodeURIComponent(
    `Hello Clothes Collection Agra, I am interested in "${item.title}" (${item.tag || item.categoryLabel}) featured on your website. Is this currently available at your Sadar Bazar store?`
  );
  const whatsappUrl = `https://wa.me/${STORE_INFO.phoneClean}?text=${whatsappMessage}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out ${item.title} at Clothes Collection Agra!`,
          url: window.location.href,
        });
      } catch {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#121110]/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl bg-[#FAF7F2] text-[#1C1917] border border-[#E7DFD5] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            id="btn-close-lookbook"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/90 text-[#1C1917] hover:bg-[#8B2626] hover:text-white flex items-center justify-center transition-colors shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: High-res Editorial Image or Reel Player */}
          <div className="md:w-1/2 relative bg-[#121110] min-h-[340px] md:min-h-[520px] flex flex-col justify-center overflow-hidden">
            {/* View Switcher if Reel Available */}
            {hasReelOrVideo && (
              <div className="absolute top-4 right-14 z-20 flex bg-black/75 backdrop-blur-md border border-white/20 p-0.5 rounded-none">
                <button
                  onClick={() => setActiveMediaView('photo')}
                  className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1 ${
                    activeMediaView === 'photo' ? 'bg-[#8B2626] text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Photo</span>
                </button>
                <button
                  onClick={() => setActiveMediaView('reel')}
                  className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1 ${
                    activeMediaView === 'reel' ? 'bg-[#8B2626] text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <Play className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                  <span>Reel Video</span>
                </button>
              </div>
            )}

            {/* Media Content */}
            {activeMediaView === 'reel' && hasReelOrVideo ? (
              <div className="w-full h-full min-h-[380px] md:min-h-[520px] flex items-center justify-center bg-black relative">
                {item.videoUrl ? (
                  <video
                    src={item.videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain max-h-[520px]"
                  />
                ) : item.embedUrl ? (
                  <iframe
                    src={item.embedUrl}
                    title={item.title}
                    className="w-full h-full min-h-[440px] md:min-h-[520px] border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-6 text-white space-y-3">
                    <Instagram className="w-12 h-12 text-[#D4AF37] mx-auto animate-pulse" />
                    <p className="text-sm font-medium">Instagram Reel Showcase</p>
                    <a
                      href={item.instagramUrl || STORE_INFO.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8B2626] text-white text-xs font-semibold uppercase tracking-wider"
                    >
                      <span>Watch Full Reel on Instagram ↗</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full min-h-[320px] md:min-h-[520px] bg-[#ECE5DB]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center max-h-[420px] md:max-h-full"
                  referrerPolicy="no-referrer"
                />

                {/* Click to play Reel overlay hint if has reel */}
                {hasReelOrVideo && (
                  <button
                    onClick={() => setActiveMediaView('reel')}
                    className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors flex items-center justify-center group"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#8B2626]/90 text-white flex items-center justify-center shadow-2xl border border-[#D4AF37] group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                    <span className="absolute bottom-12 bg-black/80 text-white text-[11px] font-semibold uppercase tracking-widest px-3 py-1 border border-white/20">
                      Watch Reel Video
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Tag Badge */}
            <div className="absolute top-4 left-4 bg-[#1C1917]/90 text-white text-[11px] tracking-[0.2em] uppercase font-semibold px-3 py-1.5 backdrop-blur-sm border border-white/10">
              {item.tag}
            </div>

            <div className="absolute bottom-3 left-4 right-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 text-white text-xs pointer-events-none">
              <span className="font-serif italic text-sm text-[#E7DFD5]">Clothes Collection · Agra Boutique Edit</span>
            </div>
          </div>

          {/* Right: Curated Details & Direct Boutique Action */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[#FAF7F2]">
            <div>
              <div className="flex items-center justify-between text-xs tracking-[0.2em] text-[#8B2626] uppercase font-semibold mb-2">
                <span>{item.categoryLabel}</span>
                <span className="text-stone-500 font-normal">Sadar Bazar, Agra</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-[#1C1917] leading-tight mb-3">
                {item.title}
              </h3>

              <p className="text-stone-700 text-sm leading-relaxed mb-6 font-light">
                {item.description}
              </p>

              {/* Technical Luxury Specs */}
              <div className="space-y-3 py-4 border-y border-[#E7DFD5] text-xs sm:text-sm">
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-500 font-medium uppercase tracking-wider text-[11px]">Fabric & Weave</span>
                  <span className="text-[#1C1917] font-semibold text-right">{item.details.fabric}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-500 font-medium uppercase tracking-wider text-[11px]">Silhouette</span>
                  <span className="text-[#1C1917] font-semibold text-right">{item.details.fit}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-500 font-medium uppercase tracking-wider text-[11px]">Occasion</span>
                  <span className="text-[#1C1917] font-semibold text-right">{item.details.occasion}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-500 font-medium uppercase tracking-wider text-[11px]">Care</span>
                  <span className="text-stone-600 text-right">{item.details.care}</span>
                </div>
              </div>

              {/* Sizing Indicator */}
              <div className="my-5">
                <span className="block text-[11px] font-semibold tracking-wider text-stone-500 uppercase mb-2">
                  Available Sizing & Fitting
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.details.sizes.map((sz, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-medium border border-[#D9D0C3] bg-white text-[#1C1917]"
                    >
                      {sz}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trust Callout */}
              <div className="flex items-center gap-2 text-xs text-stone-600 bg-[#F2ECE4] p-3 rounded-none mb-6">
                <Sparkles className="w-4 h-4 text-[#8B2626] shrink-0" />
                <span>
                  <strong>Weekly Fresh Arrival:</strong> New pieces available in-store at Sadar Bazar. Custom sizing & trials available in boutique.
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5 pt-2">
              <a
                id="btn-modal-whatsapp"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 bg-[#1C1917] text-white hover:bg-[#8B2626] py-3.5 px-6 font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-md group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors" />
                <span>Enquire On WhatsApp</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  id="btn-modal-call"
                  href={`tel:${STORE_INFO.phoneClean}`}
                  className="inline-flex items-center justify-center gap-2 border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white py-2.5 px-3 text-xs tracking-wider uppercase font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Store</span>
                </a>
                {item.instagramUrl ? (
                  <a
                    id="btn-modal-instagram-link"
                    href={item.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-[#8B2626] text-[#8B2626] hover:bg-[#8B2626] hover:text-white py-2.5 px-3 text-xs tracking-wider uppercase font-semibold transition-colors"
                  >
                    <span>View on IG ↗</span>
                  </a>
                ) : (
                  <button
                    id="btn-modal-share"
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 border border-[#D9D0C3] text-stone-700 hover:bg-[#EAE4DC] py-2.5 px-3 text-xs tracking-wider uppercase font-medium transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Style</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

