import React from 'react';
import { motion } from 'motion/react';
import { REFINED_BENEFITS } from '../data/fashionData';

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF7F2] text-[#1C1917] border-b border-[#E7DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#8B2626]" />
            <span className="text-xs font-semibold tracking-[0.25em] text-[#8B2626] uppercase">
              THE CLOTHES COLLECTION PROMISE
            </span>
            <span className="w-6 h-[1.5px] bg-[#8B2626]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1C1917] tracking-tight leading-[1.1] mb-4">
            Fashion with a little more meaning.
          </h2>

          <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
            We believe you shouldn't have to choose between enduring legacy, current trends,
            and honest value. That philosophy has shaped our boutique since 1943.
          </p>
        </div>

        {/* 4 Refined Pillars with Minimal Typography & Generous Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {REFINED_BENEFITS.map((benefit, index) => (
            <motion.div
              key={benefit.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-t border-[#D9D0C3] pt-6 flex flex-col justify-between group hover:border-[#8B2626] transition-colors duration-300"
            >
              <div>
                {/* Large Subtle Editorial Number */}
                <div className="font-serif text-3xl sm:text-4xl text-[#8B2626]/70 group-hover:text-[#8B2626] font-light mb-3 transition-colors">
                  {benefit.number}
                </div>

                {/* Pillar Title */}
                <h3 className="font-sans-clean text-sm sm:text-base font-semibold tracking-[0.15em] text-[#1C1917] uppercase mb-3">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
                  {benefit.desc}
                </p>
              </div>

              {/* Minimal Accent Line */}
              <div className="w-8 h-[1px] bg-[#E7DFD5] group-hover:w-16 group-hover:bg-[#8B2626] transition-all duration-300 mt-6" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
