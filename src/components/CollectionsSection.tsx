import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../data/fashionData';
import { useFashion } from '../context/FashionContext';

interface CollectionsSectionProps {
  onSelectCategory: (categoryKey: string, categoryTitle: string) => void;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({ onSelectCategory }) => {
  const { categories } = useFashion();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  return (
    <section id="collections" className="py-20 sm:py-28 bg-[#F4EFE6] text-[#1C1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#8B2626]" />
            <span className="text-xs font-semibold tracking-[0.25em] text-[#8B2626] uppercase">
              CURATED CATEGORIES
            </span>
            <span className="w-6 h-[1.5px] bg-[#8B2626]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1C1917] tracking-tight leading-[1.1] mb-4">
            Find Your Style.
          </h2>

          <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
            From regal handcrafted ethnic wear to effortless modern western silhouettes,
            explore our comprehensive departments curated for discerning women.
          </p>
        </div>

        {/* Large Photographic Tiles (6 Major Categories) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              onClick={() => onSelectCategory(cat.categoryKey, cat.title)}
              className="group relative overflow-hidden bg-[#121110] aspect-[4/5] sm:aspect-[3/4] cursor-pointer shadow-md"
            >
              {/* Category Background Image */}
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-[0.82] group-hover:brightness-[0.72]"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121110]/95 via-[#121110]/30 to-black/10 transition-opacity duration-300" />

              {/* Inner Champagne Border */}
              <div className="absolute inset-3.5 border border-white/20 pointer-events-none transition-colors duration-300 group-hover:border-[#C5A880]/70" />

              {/* Badge */}
              <div className="absolute top-6 left-6 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#E7DFD5] bg-[#121110]/60 backdrop-blur-xs px-2.5 py-1">
                {cat.itemCount}
              </div>

              {/* Content Block */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-[11px] tracking-[0.2em] uppercase text-[#C5A880] font-medium mb-1">
                  COLLECTION
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-wide mb-1.5 group-hover:text-[#FAF7F2] transition-colors">
                  {cat.title}
                </h3>

                <p className="text-stone-300 text-xs sm:text-sm font-light line-clamp-1 mb-4 opacity-90">
                  {cat.subtitle}
                </p>

                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-white group-hover:text-[#C5A880] transition-colors">
                  <span>DISCOVER LOOKS</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tailored Assistance Prompt */}
        <div className="mt-14 p-6 sm:p-8 bg-[#FAF7F2] border border-[#E7DFD5] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-serif text-xl sm:text-2xl text-[#1C1917]">
              Looking for custom bridal or bulk festive styling?
            </h4>
            <p className="text-stone-600 text-xs sm:text-sm font-light">
              Our 5th-generation master consultants at Sadar Bazar assist with tailored fabric matching and group orders.
            </p>
          </div>

          <a
            id="btn-category-custom-whatsapp"
            href={`https://wa.me/${STORE_INFO.phoneClean}?text=${encodeURIComponent(
              'Hi Clothes Collection Agra, I would like personal styling consultation for my upcoming occasion.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#1C1917] text-white hover:bg-[#8B2626] text-xs font-semibold tracking-[0.2em] uppercase inline-flex items-center gap-2 transition-colors shrink-0 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>CONNECT WITH STYLIST</span>
          </a>
        </div>
      </div>
    </section>
  );
};
