import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Award, History, Heart, ShieldCheck } from 'lucide-react';
import { TIMELINE, STORE_INFO } from '../data/fashionData';

export const HeritageSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section id="our-story" className="py-20 sm:py-32 bg-[#1C1917] text-[#FAF7F2] relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#C5A880]" />
            <span className="text-xs font-semibold tracking-[0.28em] text-[#C5A880] uppercase">
              OUR LEGACY
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#FAF7F2] tracking-tight leading-[1.1] mb-6">
            Five generations. One passion for fashion.
          </h2>

          <p className="text-stone-300 text-lg sm:text-xl font-serif italic text-[#E7DFD5]">
            "Generations change. Our commitment to quality doesn't."
          </p>
        </div>

        {/* Dual Visual Showcase: Heritage Roots & Modern Runway */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Interactive Timeline (5 Columns on Desktop) */}
          <div className="lg:col-span-6 space-y-8">
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light font-sans-clean">
              In 1943, within the historic bazaars of Agra, our family set out with a simple
              conviction: that fashion must celebrate both timeless Indian craftsmanship and everyday wearability.
              Today, eight decades later, Clothes Collection on Taj Road carries forward that sacred bond of trust.
            </p>

            {/* Timeline Milestones */}
            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-stone-800">
              {TIMELINE.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  onClick={() => setActiveTab(index)}
                  className={`relative pl-12 cursor-pointer group transition-all duration-300 ${
                    activeTab === index ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-2.5 top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      activeTab === index
                        ? 'bg-[#A62828] border-[#E7DFD5] scale-125'
                        : 'bg-[#2D2A26] border-stone-600 group-hover:border-[#C5A880]'
                    }`}
                  />

                  {/* Year Tag */}
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#C5A880] tracking-wider">
                      {item.year}
                    </span>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-400 border border-stone-700 px-2 py-0.5">
                      {item.legacyNote}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-serif text-[#FAF7F2] mb-1 font-medium">
                    {item.title}
                  </h3>
                  <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Legacy Trust Seals */}
            <div className="pt-6 border-t border-stone-800 grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#C5A880] shrink-0" />
                <div>
                  <div className="font-semibold text-white">80+ Years in Agra</div>
                  <div className="text-stone-400 text-[11px]">Unbroken family heritage</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-[#C5A880] shrink-0" />
                <div>
                  <div className="font-semibold text-white">Taj Road Landmark</div>
                  <div className="text-stone-400 text-[11px]">Sadar Bazar, Agra Cantt</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Emotional Split Photography (Vintage Heritage vs Modern Editorial) */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-12 gap-4 sm:gap-6">
              {/* Vintage / Archival Aesthetic Tile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="col-span-6 relative aspect-[3/4] bg-stone-900 overflow-hidden shadow-2xl border border-stone-800"
              >
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
                  alt="Heritage Textile Tradition"
                  className="w-full h-full object-cover filter sepia-[0.35] contrast-[1.1] brightness-[0.85] grayscale-[0.2]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-[#C5A880] font-semibold">
                    ORIGINS · 1943
                  </div>
                  <div className="font-serif text-sm text-[#FAF7F2]">
                    Narain Singh & Sons Textile Heritage
                  </div>
                </div>
              </motion.div>

              {/* Modern Fast-Fashion Editorial Tile */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="col-span-6 relative aspect-[3/4] bg-stone-900 overflow-hidden shadow-2xl border border-stone-800 sm:translate-y-6"
              >
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop"
                  alt="Modern Clothes Collection Agra Store"
                  className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-[#A62828] font-semibold">
                    TODAY · 5TH GEN
                  </div>
                  <div className="font-serif text-sm text-[#FAF7F2]">
                    Clothes Collection Sadar Bazar
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
