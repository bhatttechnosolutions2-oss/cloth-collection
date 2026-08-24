import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, MessageCircle, MapPin, Phone, Menu, X, ArrowUpRight, PlusCircle, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { STORE_INFO } from '../data/fashionData';
import { useFashion } from '../context/FashionContext';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsManagerOpen } = useFashion();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', id: 'hero' },
    { label: 'COLLECTIONS', id: 'collections' },
    { label: 'NEW ARRIVALS', id: 'new-arrivals' },
    { label: 'OUR STORY', id: 'our-story' },
    { label: 'VISIT US', id: 'visit-us' },
  ];

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DFD5] shadow-sm py-3 sm:py-3.5'
            : 'bg-gradient-to-b from-[#121110]/80 via-[#121110]/40 to-transparent py-4 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Monogram & Logo */}
          <button
            id="nav-brand-logo"
            onClick={() => handleLinkClick('hero')}
            className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2626]"
            aria-label="Clothes Collection Home"
          >
            <BrandLogo
              variant={isScrolled ? 'dark' : 'light'}
              size="md"
              showSubtitle={true}
            />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`text-xs tracking-[0.22em] font-medium transition-all duration-200 relative group py-1 ${
                  isScrolled
                    ? 'text-[#1C1917] hover:text-[#8B2626]'
                    : 'text-[#FAF7F2] hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full ${
                    isScrolled ? 'bg-[#8B2626]' : 'bg-[#E7DFD5]'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden sm:flex items-center gap-3 md:gap-4">
            {/* Add / Manage Client Photos Trigger */}
            <button
              id="btn-nav-manage-photos"
              onClick={() => setIsManagerOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-none text-xs font-semibold tracking-wider transition-all duration-200 border ${
                isScrolled
                  ? 'border-[#8B2626] text-[#8B2626] hover:bg-[#8B2626] hover:text-white bg-[#8B2626]/5'
                  : 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1C1917] bg-[#D4AF37]/15 backdrop-blur-xs'
              }`}
              title="Upload Client Instagram Photos & Update Collections"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">ADD CLIENT PHOTOS</span>
              <span className="md:hidden">PHOTOS</span>
            </button>

            {/* Instagram Icon */}
            <a
              id="nav-social-instagram"
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram @clothcollection.agra"
              className={`p-2.5 rounded-full border transition-all duration-200 ${
                isScrolled
                  ? 'border-[#D9D0C3] text-[#1C1917] hover:bg-[#1C1917] hover:text-white hover:border-[#1C1917]'
                  : 'border-white/30 text-white hover:bg-white hover:text-[#1C1917]'
              }`}
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* WhatsApp Icon */}
            <a
              id="nav-social-whatsapp"
              href={STORE_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className={`p-2.5 rounded-full border transition-all duration-200 ${
                isScrolled
                  ? 'border-[#D9D0C3] text-[#1C1917] hover:bg-[#25D366] hover:text-white hover:border-[#25D366]'
                  : 'border-white/30 text-white hover:bg-[#25D366] hover:text-white hover:border-[#25D366]'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Visit Store Button */}
            <button
              id="btn-nav-visit-store"
              onClick={() => handleLinkClick('visit-us')}
              className={`px-5 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 border ${
                isScrolled
                  ? 'bg-[#1C1917] text-white border-[#1C1917] hover:bg-[#8B2626] hover:border-[#8B2626] shadow-sm'
                  : 'bg-white/15 text-white border-white/50 backdrop-blur-sm hover:bg-white hover:text-[#1C1917]'
              }`}
            >
              VISIT STORE
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={STORE_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full border ${
                isScrolled ? 'border-[#D9D0C3] text-[#1C1917]' : 'border-white/30 text-white'
              }`}
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-none transition-colors ${
                isScrolled ? 'text-[#1C1917]' : 'text-white'
              }`}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-x-0 top-[60px] z-30 bg-[#FAF7F2] border-b border-[#E7DFD5] shadow-xl sm:hidden overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <div className="text-[11px] font-semibold tracking-[0.25em] text-[#8B2626] uppercase">
                Explore The Boutique
              </div>

              <div className="space-y-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    id={`mobile-nav-link-${link.id}`}
                    onClick={() => handleLinkClick(link.id)}
                    className="block w-full text-left font-serif text-2xl text-[#1C1917] hover:text-[#8B2626] transition-colors py-1 flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-stone-400" />
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-[#E7DFD5] space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsManagerOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#8B2626] text-white text-xs font-semibold tracking-widest uppercase shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Add / Manage Client Photos</span>
                </button>

                <a
                  href={`tel:${STORE_INFO.phoneClean}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#1C1917] text-white text-xs font-semibold tracking-widest uppercase"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Store · {STORE_INFO.phone}</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={STORE_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 border border-[#D9D0C3] text-xs font-semibold tracking-wider text-[#1C1917]"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={STORE_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 border border-[#D9D0C3] text-xs font-semibold tracking-wider text-[#1C1917]"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>Instagram</span>
                  </a>
                </div>

                <div className="text-center pt-2 text-[11px] text-stone-500">
                  Taj Road, Sadar Bazar, Agra · 11:00 AM – 10:00 PM
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
