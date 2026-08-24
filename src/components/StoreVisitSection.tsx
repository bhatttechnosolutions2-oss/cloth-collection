import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, MessageCircle, Navigation, Clock, Check, Copy, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../data/fashionData';

export const StoreVisitSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(STORE_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="visit-us" className="py-20 sm:py-32 bg-[#1C1917] text-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Store Visit Story & Direct CTAs (6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-[1.5px] bg-[#C5A880]" />
                <span className="text-xs font-semibold tracking-[0.28em] text-[#C5A880] uppercase">
                  EXPERIENCE THE BOUTIQUE
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#FAF7F2] tracking-tight leading-[1.1] mb-6">
                Your next favourite look is waiting.
              </h2>

              <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-light font-sans-clean">
                Visit Clothes Collection at Taj Road, Sadar Bazar, Agra and discover the
                latest collection in person. Feel the fabrics, try on fresh weekly cuts,
                and receive dedicated styling assistance from our team.
              </p>
            </div>

            {/* Address & Store Info Block */}
            <div className="bg-[#262320] border border-stone-800 p-6 sm:p-8 space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#C5A880] shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="text-xs tracking-[0.2em] uppercase font-semibold text-stone-400">
                    BOUTIQUE LOCATION
                  </div>
                  <div className="text-sm sm:text-base font-medium text-white">
                    11/1, Taj Road, Sadar Bazar, Agra Cantt,
                    <br />
                    Idgah Colony, Agra, Uttar Pradesh 282001
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] hover:text-[#e0c7a4] font-medium pt-1 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Address copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy full address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 border-t border-stone-800 pt-5">
                <Phone className="w-5 h-5 text-[#C5A880] shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="text-xs tracking-[0.2em] uppercase font-semibold text-stone-400">
                    DIRECT STORE TELEPHONE
                  </div>
                  <a
                    href={`tel:${STORE_INFO.phoneClean}`}
                    className="text-base sm:text-lg font-serif tracking-wider text-white hover:text-[#C5A880] transition-colors block"
                  >
                    {STORE_INFO.phone}
                  </a>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4 border-t border-stone-800 pt-5">
                <Clock className="w-5 h-5 text-[#C5A880] shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="text-xs tracking-[0.2em] uppercase font-semibold text-stone-400">
                    STORE TIMINGS
                  </div>
                  <div className="text-sm sm:text-base text-white font-medium">
                    11:00 AM – 10:00 PM
                  </div>
                  <div className="text-xs text-stone-400">
                    Open all 7 days a week (including Sundays)
                  </div>
                </div>
              </div>
            </div>

            {/* Three Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                id="btn-visit-call-now"
                href={`tel:${STORE_INFO.phoneClean}`}
                className="px-5 py-3.5 bg-[#FAF7F2] text-[#1C1917] hover:bg-[#8B2626] hover:text-white text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>CALL NOW</span>
              </a>

              <a
                id="btn-visit-whatsapp"
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-[#25D366] text-white hover:bg-[#20ba59] text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WHATSAPP US</span>
              </a>

              <a
                id="btn-visit-directions"
                href={STORE_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 border border-stone-600 text-white hover:bg-white/10 hover:border-white text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 text-center flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>GET DIRECTIONS</span>
              </a>
            </div>
          </div>

          {/* Right: Map & Landmark Location Showcase (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Embedded Google Map Frame */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-stone-900 border border-stone-800 overflow-hidden shadow-2xl">
              <iframe
                title="Clothes Collection Agra Location Map"
                src="https://maps.google.com/maps?q=Taj+Road,+Sadar+Bazar,+Agra+Cantt,+Agra,+Uttar+Pradesh+282001&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="border-0 filter grayscale-[0.35] invert-[0.9] contrast-[1.1]"
                loading="lazy"
                allowFullScreen
              />

              {/* Map Floating Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#1C1917]/95 border border-stone-700 p-4 backdrop-blur-md flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold tracking-wider text-[#C5A880] uppercase">
                    Clothes Collection Agra
                  </div>
                  <div className="text-stone-300 text-xs mt-0.5">
                    Taj Road, Sadar Bazar Cantonment
                  </div>
                </div>

                <a
                  href={STORE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#FAF7F2] text-[#1C1917] hover:bg-[#8B2626] hover:text-white text-[11px] font-semibold tracking-wider uppercase transition-colors"
                >
                  OPEN MAP
                </a>
              </div>
            </div>

            {/* Landmark Quick Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-300">
              {STORE_INFO.landmarks.map((lm, i) => (
                <div
                  key={i}
                  className="bg-[#262320] border border-stone-800 p-3.5 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                  <span className="leading-snug">{lm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
