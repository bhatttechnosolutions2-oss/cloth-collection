import React from 'react';
import { motion } from 'motion/react';
import { Instagram, ArrowUpRight, MessageCircle, Sparkles, Heart } from 'lucide-react';
import { STORE_INFO } from '../data/fashionData';
import { FashionItem } from '../types';
import { useFashion } from '../context/FashionContext';

interface WeeklyGallerySectionProps {
  onSelectItem: (item: FashionItem) => void;
}

export const WeeklyGallerySection: React.FC<WeeklyGallerySectionProps> = ({ onSelectItem }) => {
  const { editorialGallery } = useFashion();
  const firstItem = editorialGallery[0];
  const remainingItems = editorialGallery.slice(1, 5);

  return (
    <section className="py-20 sm:py-28 bg-[#FAF7F2] text-[#1C1917] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[1.5px] bg-[#8B2626]" />
              <span className="text-xs font-semibold tracking-[0.25em] text-[#8B2626] uppercase">
                THIS WEEK'S EDIT
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1C1917] tracking-tight leading-[1.1] mb-3">
              What's New at Clothes Collection
            </h2>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
              A visual moodboard of our latest arrivals fresh on the racks in Sadar Bazar.
              Tap any look to inspect details or enquire directly.
            </p>
          </div>

          <a
            id="btn-gallery-instagram-header"
            href={STORE_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 border border-[#1C1917] text-xs font-semibold tracking-[0.2em] uppercase text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-all duration-300 self-start md:self-end"
          >
            <Instagram className="w-4 h-4" />
            <span>SEE MORE ON INSTAGRAM</span>
          </a>
        </div>

        {/* Asymmetric Editorial Pinterest-style Masonry Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Card 1: Large Featured Tall (5 cols) */}
          {firstItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onClick={() => onSelectItem(firstItem)}
              className="md:col-span-5 relative aspect-[3/4] overflow-hidden bg-[#ECE5DB] group cursor-pointer shadow-sm"
            >
              <img
                src={firstItem.image}
                alt={firstItem.title}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-[#1C1917]/90 text-white text-[10px] tracking-[0.2em] font-semibold px-3 py-1 uppercase">
                {firstItem.tag}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end text-white">
                <span className="text-xs text-[#C5A880] tracking-widest uppercase font-medium">
                  {firstItem.category}
                </span>
                <h3 className="font-serif text-2xl text-white mt-1">
                  {firstItem.title}
                </h3>
                <div className="mt-3 flex items-center justify-between text-xs text-stone-300 border-t border-white/20 pt-3">
                  <span>Tap to inspect & reserve</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C5A880]" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Right Column: 2x2 Grid Layout (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {remainingItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (idx + 1) * 0.1 }}
                onClick={() => onSelectItem(item)}
                className="relative aspect-[4/5] overflow-hidden bg-[#ECE5DB] group cursor-pointer shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Tag */}
                <div className="absolute top-3 left-3 bg-[#FAF7F2]/95 text-[#1C1917] text-[10px] tracking-[0.2em] font-semibold px-2.5 py-1 uppercase border border-[#E7DFD5]">
                  {item.tag}
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] text-[#C5A880] tracking-widest uppercase font-medium">
                    {item.category}
                  </span>
                  <h4 className="font-serif text-lg text-white leading-tight">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20 text-[11px] text-stone-200">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Quick WhatsApp Enquiry</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Social Handle Banner */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-stone-600 font-medium">
            <span>FOLLOW OUR DAILY LOOKS ON INSTAGRAM</span>
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B2626] font-bold hover:underline"
            >
              {STORE_INFO.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
