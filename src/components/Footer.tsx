import React from 'react';
import { Instagram, MessageCircle, MapPin, Phone, ArrowUp, Mail, Clock, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { STORE_INFO } from '../data/fashionData';
import { useFashion } from '../context/FashionContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { setIsManagerOpen } = useFashion();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Collections', id: 'collections' },
    { label: 'New Arrivals', id: 'new-arrivals' },
    { label: 'Our Story', id: 'our-story' },
    { label: 'Visit Us', id: 'visit-us' },
  ];

  return (
    <footer className="bg-[#121110] text-[#FAF7F2] border-t border-stone-800 pt-16 sm:pt-20 pb-28 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-14 border-b border-stone-800">
          {/* Brand Identity Column (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <BrandLogo variant="light" size="lg" showSubtitle={true} />

            <p className="font-serif italic text-lg sm:text-xl text-[#E7DFD5] max-w-md">
              "Five generations of fashion. One timeless destination."
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 text-xs text-[#C5A880] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A62828]" />
              <span>SINCE 1943 · AGRA</span>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-light max-w-sm">
              Rooted in Agra's rich textile heritage, Clothes Collection brings weekly fresh fast-fashion,
              bespoke ethnic wear, and contemporary ready-to-wear to modern Indian women.
            </p>
          </div>

          {/* Navigation Links Column (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold tracking-[0.25em] text-[#C5A880] uppercase">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    id={`footer-link-${link.id}`}
                    onClick={() => onNavigate(link.id)}
                    className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Store Location (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold tracking-[0.25em] text-[#C5A880] uppercase">
              VISIT & CONNECT
            </h4>

            <div className="space-y-3 text-xs sm:text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>
                  11/1, Taj Road, Sadar Bazar, Agra Cantt,
                  <br />
                  Agra, Uttar Pradesh 282001
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a
                  href={`tel:${STORE_INFO.phoneClean}`}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  {STORE_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>11:00 AM – 10:00 PM (Daily)</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                id="footer-social-instagram"
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-full border border-stone-700 text-stone-300 hover:text-white hover:border-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                id="footer-social-whatsapp"
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2.5 rounded-full border border-stone-700 text-stone-300 hover:text-[#25D366] hover:border-[#25D366] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                id="footer-social-facebook"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2.5 rounded-full border border-stone-700 text-stone-300 hover:text-blue-400 hover:border-blue-400 transition-colors"
              >
                <span className="text-xs font-bold font-serif">f</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} Clothes Collection Agra. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              id="btn-footer-admin-login"
              onClick={() => setIsManagerOpen(true)}
              className="inline-flex items-center gap-1.5 text-stone-300 hover:text-[#D4AF37] transition-colors cursor-pointer text-[11px] tracking-wider"
              title="Boutique Manager & Image Backend Portal"
            >
              <Lock className="w-3 h-3 text-stone-300 group-hover:text-[#D4AF37]" />
              <span>Admin Backend Portal</span>
            </button>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors cursor-pointer group"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 transform group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
