import React from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle2, ArrowUpRight, MessageSquareQuote } from 'lucide-react';
import { TESTIMONIALS, STORE_INFO } from '../data/fashionData';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#F4EFE6] text-[#1C1917] border-y border-[#E7DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Google Rating Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-18 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[1.5px] bg-[#8B2626]" />
              <span className="text-xs font-semibold tracking-[0.25em] text-[#8B2626] uppercase">
                CUSTOMER LOVE
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1C1917] tracking-tight leading-[1.1] mb-3">
              Trusted by Agra.
            </h2>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
              Generations of patrons across Agra trust Clothes Collection for genuine quality,
              warm hospitality, and fresh weekly styles on Taj Road.
            </p>
          </div>

          {/* Google Rating Block */}
          <div className="bg-[#FAF7F2] p-6 border border-[#D9D0C3] flex items-center gap-5 shadow-xs shrink-0">
            <div className="text-center">
              <div className="font-serif text-4xl sm:text-5xl font-semibold text-[#1C1917] leading-none">
                4.0
              </div>
              <div className="flex items-center gap-0.5 justify-center mt-2 text-[#D4AF37]">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                ))}
                <Star className="w-4 h-4 fill-[#D4AF37]/30 text-[#D4AF37]" />
              </div>
            </div>

            <div className="h-10 w-[1px] bg-[#D9D0C3]" />

            <div>
              <div className="text-xs font-semibold tracking-[0.18em] uppercase text-[#1C1917]">
                GOOGLE RATING
              </div>
              <div className="text-xs text-stone-600 font-light mt-0.5">
                200+ Customer Reviews
              </div>
              <div className="text-[10px] text-stone-600 mt-1">
                Taj Road, Sadar Bazar
              </div>
            </div>
          </div>
        </div>

        {/* 3 Tasteful Review Excerpt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#FAF7F2] p-8 border border-[#E7DFD5] flex flex-col justify-between hover:border-[#8B2626] transition-colors shadow-xs"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(Math.floor(item.rating))].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    ))}
                    {item.rating % 1 !== 0 && (
                      <Star className="w-3.5 h-3.5 fill-[#D4AF37]/50 text-[#D4AF37]" />
                    )}
                  </div>
                  <MessageSquareQuote className="w-5 h-5 text-stone-400" />
                </div>

                {/* Excerpt */}
                <p className="text-stone-700 text-sm leading-relaxed font-light mb-6">
                  "{item.review}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 border-t border-[#E7DFD5] flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs tracking-wider uppercase text-[#1C1917]">
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-stone-600 font-light">
                    {item.location} · {item.context}
                  </div>
                </div>

                {item.verified && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Read Our Google Reviews CTA */}
        <div className="mt-12 text-center">
          <a
            id="btn-google-reviews"
            href={`https://www.google.com/search?q=Cloth+Collection+Agra+Taj+Road+Sadar+Bazar+reviews`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-[#1C1917] hover:text-[#8B2626] pb-1 border-b border-[#1C1917] hover:border-[#8B2626] transition-colors"
          >
            <span>READ OUR GOOGLE REVIEWS</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
