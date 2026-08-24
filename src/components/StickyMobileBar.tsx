import React from 'react';
import { Phone, MessageCircle, Navigation, MapPin } from 'lucide-react';
import { STORE_INFO } from '../data/fashionData';

export const StickyMobileBar: React.FC = () => {
  return (
    <aside
      aria-label="Mobile quick actions"
      className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#1C1917]/95 backdrop-blur-lg border-t border-stone-800 p-2 shadow-2xl"
    >
      <div className="grid grid-cols-3 gap-1.5 max-w-md mx-auto">
        {/* Call Button */}
        <a
          id="btn-mobile-sticky-call"
          href={`tel:${STORE_INFO.phoneClean}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-none bg-stone-900 text-stone-200 hover:text-white hover:bg-stone-800 transition-colors"
          aria-label={`Call Store at ${STORE_INFO.phone}`}
        >
          <Phone className="w-4 h-4 text-[#C5A880] mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase font-semibold">CALL</span>
        </a>

        {/* WhatsApp Button */}
        <a
          id="btn-mobile-sticky-whatsapp"
          href={STORE_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-none bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-white mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase font-semibold">WHATSAPP</span>
        </a>

        {/* Directions Button */}
        <a
          id="btn-mobile-sticky-directions"
          href={STORE_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-none bg-stone-900 text-stone-200 hover:text-white hover:bg-stone-800 transition-colors"
          aria-label="Get Directions to Sadar Bazar store"
        >
          <Navigation className="w-4 h-4 text-[#C5A880] mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase font-semibold">DIRECTIONS</span>
        </a>
      </div>
    </aside>
  );
};
