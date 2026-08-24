import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, MapPin, Sparkles, Compass } from 'lucide-react';
import { STORE_INFO } from '../data/fashionData';
import { useFashion } from '../context/FashionContext';

interface HeroSectionProps {
  onExploreCollection: () => void;
  onVisitStore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCollection,
  onVisitStore,
}) => {
  const { heroImage } = useFashion();

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full flex items-center justify-center bg-[#121110] text-white overflow-hidden"
    >
      {/* Background Editorial Image with subtle zoom */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Clothes Collection Luxury Indian Fashion"
          className="w-full h-full object-cover object-[center_35%] scale-105 filter brightness-[0.78] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Subtle Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/40 to-[#121110]/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#121110]/20 to-[#121110]/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 pt-24 sm:pt-28 pb-16 text-center flex flex-col items-center">
        {/* Heritage Label / Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#E7DFD5]/40 bg-[#121110]/60 backdrop-blur-md mb-6 sm:mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#A62828]" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] text-[#E7DFD5] uppercase">
            EST. 1943 · AGRA
          </span>
          <span className="text-stone-400 text-xs">|</span>
          <span className="text-[11px] sm:text-xs tracking-[0.18em] text-stone-300 font-light">
            5TH GENERATION LEGACY
          </span>
        </motion.div>

        {/* Major Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-[-0.02em] leading-[1.05] sm:leading-[1.08] text-[#FAF7F2] max-w-4xl mb-6"
        >
          FASHION THAT MOVES WITH YOU.
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-stone-300 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mb-10 sm:mb-12 font-sans-clean"
        >
          Discover the latest styles, curated for the modern woman. Premium fashion,
          fresh collections and timeless quality, right in the heart of Agra.
        </motion.p>

        {/* Dual Primary Call-To-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            id="btn-hero-explore"
            onClick={onExploreCollection}
            className="w-full sm:w-auto min-w-[210px] px-8 py-4 bg-[#FAF7F2] text-[#1C1917] hover:bg-[#8B2626] hover:text-white text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase transition-all duration-300 shadow-lg cursor-pointer"
          >
            EXPLORE COLLECTION
          </button>

          <button
            id="btn-hero-visit"
            onClick={onVisitStore}
            className="w-full sm:w-auto min-w-[210px] px-8 py-4 border border-white/60 text-white hover:bg-white/10 hover:border-white text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase backdrop-blur-sm transition-all duration-300 cursor-pointer"
          >
            VISIT OUR STORE
          </button>
        </motion.div>

        {/* Quick Heritage & Location Micro-Pillars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-14 sm:mt-16 pt-8 border-t border-white/15 w-full max-w-3xl text-stone-300 text-xs sm:text-sm"
        >
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span className="tracking-wide">Fresh Collections Every Week</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
            <span className="tracking-wide">Since 1943 · Taj Road, Agra</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <MapPin className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span className="tracking-wide">Sadar Bazar Cantonment</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={onExploreCollection}
        aria-label="Scroll to new arrivals"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-stone-400 hover:text-white transition-colors cursor-pointer group"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase font-medium mb-1 group-hover:text-stone-200">
          SCROLL
        </span>
        <ArrowDown className="w-4 h-4 animate-bounce text-[#C5A880]" />
      </button>
    </section>
  );
};
