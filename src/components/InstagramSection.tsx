import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Heart, MessageCircle, ArrowUpRight, PlusCircle } from 'lucide-react';
import { STORE_INFO } from '../data/fashionData';
import { useFashion } from '../context/FashionContext';

export const InstagramSection: React.FC = () => {
  const { instagramPosts, setIsManagerOpen } = useFashion();

  return (
    <section className="py-20 sm:py-28 bg-[#FAF7F2] text-[#1C1917] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[1.5px] bg-[#8B2626]" />
              <span className="text-xs font-semibold tracking-[0.25em] text-[#8B2626] uppercase">
                SOCIAL EDIT
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1C1917] tracking-tight leading-[1.1] mb-2">
              Follow the latest.
            </h2>

            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base sm:text-lg font-serif italic text-[#8B2626] hover:underline"
            >
              {STORE_INFO.instagramHandle}
            </a>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => setIsManagerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-3.5 border border-[#8B2626] text-[#8B2626] hover:bg-[#8B2626] hover:text-white text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300"
              title="Add or update Instagram photos"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ADD POST PHOTOS</span>
            </button>

            <a
              id="btn-instagram-feed-cta"
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#1C1917] text-white hover:bg-[#8B2626] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-sm"
            >
              <Instagram className="w-4 h-4" />
              <span>FOLLOW ON INSTAGRAM</span>
            </a>
          </div>
        </div>

        {/* 6-Image Fashion Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="group relative aspect-square overflow-hidden bg-stone-200 block"
            >
              <img
                src={post.image}
                alt={post.caption}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />

              {/* Instagram Hover Overlay with Stats and Caption */}
              <div className="absolute inset-0 bg-[#121110]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-white text-center">
                <div className="flex items-center gap-3 text-xs mb-2">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-stone-300" />
                    {post.comments}
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 line-clamp-2 font-light px-1">
                  {post.caption}
                </p>
                <div className="mt-2 text-[10px] text-[#C5A880] tracking-wider uppercase font-semibold">
                  View On Instagram
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
