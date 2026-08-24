import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, MapPin, CheckCircle2, Sparkles, Share2, Phone } from 'lucide-react';
import { FashionItem } from '../types';
import { STORE_INFO } from '../data/fashionData';

interface LookbookModalProps {
  item: FashionItem | null;
  onClose: () => void;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({ item, onClose }) => {
  if (!item) return null;

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
        // Fallback copy
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
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
          className="relative z-10 w-full max-w-4xl bg-[#FAF7F2] text-[#1C1917] border border-[#E7DFD5] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            id="btn-close-lookbook"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 text-[#1C1917] hover:bg-[#8B2626] hover:text-white flex items-center justify-center transition-colors shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: High-res Editorial Image */}
          <div className="md:w-1/2 relative bg-[#F2ECE4] min-h-[300px] md:min-h-[500px]">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover object-center max-h-[400px] md:max-h-full"
              referrerPolicy="no-referrer"
            />
            {/* Tag Badge */}
            <div className="absolute top-4 left-4 bg-[#1C1917]/90 text-white text-[11px] tracking-[0.2em] uppercase font-semibold px-3 py-1.5 backdrop-blur-sm">
              {item.tag}
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 text-white text-xs">
              <span className="font-serif italic text-sm text-[#E7DFD5]">Clothes Collection · Agra Edit</span>
            </div>
          </div>

          {/* Right: Curated Details & Direct Boutique Action */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
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
                  <strong>Weekly Fresh Arrival:</strong> New pieces available in-store at Sadar Bazar. Custom sizing available upon request.
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
