import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, MessageCircle, Sparkles, Filter, PlusCircle } from 'lucide-react';
import { STORE_INFO } from '../data/fashionData';
import { FashionItem } from '../types';
import { useFashion } from '../context/FashionContext';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  onSelectItem: (item: FashionItem) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'all',
  onSelectItem,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(initialCategory);
  const { newArrivals, editorialGallery, setIsManagerOpen } = useFashion();

  if (!isOpen) return null;

  // Combine all items
  const allItems: FashionItem[] = [...newArrivals, ...editorialGallery];
  // Deduplicate by ID
  const uniqueItems = Array.from(new Map(allItems.map((item) => [item.id, item])).values());

  const filteredItems =
    selectedFilter === 'all'
      ? uniqueItems
      : uniqueItems.filter((item) => item.category === selectedFilter);

  const filterOptions = [
    { key: 'all', label: 'ALL COLLECTIONS' },
    { key: 'tops', label: 'TOPS & SHIRTS' },
    { key: 'jeans', label: 'JEANS & DENIMS' },
    { key: 'kurtis', label: "KURTI'S & TUNICS" },
    { key: 'bottoms', label: "GIRLS' BOTTOMS" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#121110]/85 backdrop-blur-md transition-opacity"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-6xl bg-[#FAF7F2] text-[#1C1917] border border-[#E7DFD5] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-7 border-b border-[#E7DFD5] flex items-center justify-between bg-[#F4EFE6]">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.25em] text-[#8B2626] uppercase mb-1">
                CLOTHES COLLECTION · AGRA
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
                Curated Fashion Catalog
              </h3>
            </div>

            <button
              id="btn-close-category-modal"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white border border-[#D9D0C3] hover:bg-[#8B2626] hover:text-white flex items-center justify-center transition-colors shadow-xs"
              aria-label="Close catalog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="px-5 sm:px-7 py-3.5 border-b border-[#E7DFD5] bg-[#FAF7F2] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Filter className="w-4 h-4 text-stone-400 shrink-0 mr-1" />
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSelectedFilter(opt.key)}
                className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-colors border ${
                  selectedFilter === opt.key
                    ? 'bg-[#1C1917] text-white border-[#1C1917]'
                    : 'bg-white text-stone-700 border-[#D9D0C3] hover:border-[#1C1917]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Catalog Grid */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                  }}
                  className="group cursor-pointer bg-white border border-[#E7DFD5] p-3 hover:border-[#8B2626] transition-all shadow-xs flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE5DB] mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#1C1917]/90 text-white text-[10px] tracking-wider uppercase px-2.5 py-0.5">
                      {item.tag}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] tracking-widest text-[#8B2626] uppercase font-semibold">
                      {item.categoryLabel}
                    </div>
                    <h4 className="font-serif text-lg text-[#1C1917] group-hover:text-[#8B2626] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-stone-500 text-xs mt-1 line-clamp-1">
                      {item.details.fabric} · {item.details.fit}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-400 font-medium">Available in store</span>
                    <span className="text-[#8B2626] font-semibold group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Store visit reminder */}
          <div className="p-4 bg-[#F4EFE6] border-t border-[#E7DFD5] text-center text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>
              Fresh collections arrive every week at <strong>Taj Road, Sadar Bazar, Agra</strong>.
            </span>
            <a
              href={`https://wa.me/${STORE_INFO.phoneClean}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#1C1917] hover:text-[#8B2626] uppercase"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Ask about stock on WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
