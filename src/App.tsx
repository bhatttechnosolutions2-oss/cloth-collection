/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FashionProvider } from './context/FashionContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { NewEditSection } from './components/NewEditSection';
import { CollectionsSection } from './components/CollectionsSection';
import { HeritageSection } from './components/HeritageSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { WeeklyGallerySection } from './components/WeeklyGallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { StoreVisitSection } from './components/StoreVisitSection';
import { InstagramSection } from './components/InstagramSection';
import { Footer } from './components/Footer';
import { LookbookModal } from './components/LookbookModal';
import { CategoryModal } from './components/CategoryModal';
import { PhotoManagerModal } from './components/PhotoManagerModal';
import { StickyMobileBar } from './components/StickyMobileBar';
import { FashionItem } from './types';

function MainApp() {
  const [selectedItem, setSelectedItem] = useState<FashionItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleOpenCategory = (categoryKey: string) => {
    setActiveCategoryFilter(categoryKey);
    setIsCategoryModalOpen(true);
  };

  const handleSelectItemFromCatalog = (item: FashionItem) => {
    setIsCategoryModalOpen(false);
    setSelectedItem(item);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans-clean antialiased selection:bg-[#8B2626] selection:text-white">
      {/* Sticky Luxury Navbar */}
      <Navbar onNavigate={scrollToSection} />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          onExploreCollection={() => scrollToSection('new-arrivals')}
          onVisitStore={() => scrollToSection('visit-us')}
        />

        {/* Section 2: The New Edit */}
        <NewEditSection
          onSelectItem={(item) => setSelectedItem(item)}
          onExploreAll={() => {
            setActiveCategoryFilter('all');
            setIsCategoryModalOpen(true);
          }}
        />

        {/* Section 3: Shop By Collection */}
        <CollectionsSection
          onSelectCategory={(categoryKey) => handleOpenCategory(categoryKey)}
        />

        {/* Section 4: Our Legacy (1943 - 5 Generations) */}
        <HeritageSection />

        {/* Section 5: Why Clothes Collection */}
        <WhyChooseUs />

        {/* Section 6: This Week's Edit Gallery */}
        <WeeklyGallerySection onSelectItem={(item) => setSelectedItem(item)} />

        {/* Section 7: Customer Love (Google Reviews) */}
        <ReviewsSection />

        {/* Section 8: Store Visit CTA & Map */}
        <StoreVisitSection />

        {/* Section 9: Instagram Feed */}
        <InstagramSection />
      </main>

      {/* Luxury Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Interactive Lookbook Modal */}
      <LookbookModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Category Catalog Browser Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        initialCategory={activeCategoryFilter}
        onSelectItem={handleSelectItemFromCatalog}
      />

      {/* Client Photo & Instagram Media Manager Modal */}
      <PhotoManagerModal />

      {/* Mobile Bottom Quick Actions (Call, WhatsApp, Directions) */}
      <StickyMobileBar />
    </div>
  );
}

export default function App() {
  return (
    <FashionProvider>
      <MainApp />
    </FashionProvider>
  );
}
