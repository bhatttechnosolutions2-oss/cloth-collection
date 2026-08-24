import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, MessageCircle, Eye, PlusCircle } from 'lucide-react';
import { STORE_INFO } from '../data/fashionData';
import { FashionItem } from '../types';
import { useFashion } from '../context/FashionContext';

interface NewEditSectionProps {
  onSelectItem: (item: FashionItem) => void;
  onExploreAll: () => void;
}

export const NewEditSection: React.FC<NewEditSectionProps> = ({
  onSelectItem,
  onExploreAll,
}) => {
  const { newArrivals, setIsManagerOpen } = useFashion();
  return (
    <section id="new-arrivals" className="py-20 sm:py-28 bg-[#FAF7F2] text-[#1C1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[1.5px] bg-[#8B2626]" />
              <span className="text-xs font-semibold tracking-[0.25em] text-[#8B2626] uppercase">
                THE NEW EDIT
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1C1917] tracking-tight leading-[1.1] mb-4">
              New styles. Every week.
            </h2>

            {/* Supporting Copy */}
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
              Fashion never stands still. Neither do we. Explore our latest arrivals
              and discover styles refreshed regularly for every mood, moment and occasion.
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => setIsManagerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#8B2626] text-[#8B2626] hover:bg-[#8B2626] hover:text-white text-xs font-semibold tracking-wider transition-colors"
              title="Add photos from Instagram or Device"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>ADD PHOTOS</span>
            </button>

            <button
              id="btn-explore-all-new"
              onClick={onExploreAll}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-[#1C1917] hover:text-[#8B2626] transition-colors group pb-1 border-b border-[#1C1917] hover:border-[#8B2626]"
            >
              <span>EXPLORE ALL ({newArrivals.length})</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Editorial Product Grid (4-6 Images with Asymmetric Luxury Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {newArrivals.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer flex flex-col"
              onClick={() => onSelectItem(item)}
            >
              {/* Image Container with Luxury Overlay */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE5DB] mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Tag Badge */}
                <div className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur-sm text-[#1C1917] text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase px-3 py-1 border border-[#E7DFD5] shadow-xs">
                  {item.tag}
                </div>

                {/* Hover Quick-Action Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121110]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <div className="text-white text-xs mb-3 space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-[11px] text-[#C5A880] tracking-widest uppercase font-medium">
                      {item.details.fabric}
                    </div>
                    <div className="text-stone-200 text-xs line-clamp-1">
                      {item.details.occasion}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="flex-1 py-2.5 bg-white text-[#1C1917] hover:bg-[#FAF7F2] text-[11px] font-semibold tracking-widest uppercase flex items-center justify-center gap-1.5 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW DETAILS</span>
                    </button>
                    <a
                      href={`https://wa.me/${STORE_INFO.phoneClean}?text=${encodeURIComponent(
                        `Hi Clothes Collection Agra, I'd like to ask about availability for: ${item.title}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Enquire on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="flex flex-col justify-between flex-grow">
                <div className="flex items-center justify-between text-[11px] tracking-[0.2em] text-[#8B2626] uppercase font-semibold mb-1">
                  <span>{item.categoryLabel}</span>
                  <span className="text-stone-400 font-normal">Agra Edit</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-[#1C1917] group-hover:text-[#8B2626] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 mt-1.5 font-light">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Editorial Callout */}
        <div className="mt-14 sm:mt-18 pt-8 border-t border-[#E7DFD5] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#8B2626]" />
            <p className="text-xs sm:text-sm text-stone-700">
              <strong>Boutique Freshness:</strong> Over 40+ brand new styles arrive in our Sadar Bazar store every Friday.
            </p>
          </div>

          <button
            id="btn-bottom-explore-latest"
            onClick={onExploreAll}
            className="px-6 py-3 bg-[#1C1917] text-white hover:bg-[#8B2626] text-xs font-semibold tracking-[0.2em] uppercase transition-colors"
          >
            EXPLORE THE LATEST
          </button>
        </div>
      </div>
    </section>
  );
};
