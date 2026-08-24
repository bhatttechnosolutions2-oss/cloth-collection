import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'auto',
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const isLight = variant === 'light';

  const sizeMap = {
    sm: { icon: 28, text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-base sm:text-lg', sub: 'text-[10px]' },
    lg: { icon: 52, text: 'text-xl sm:text-2xl', sub: 'text-xs' },
    hero: { icon: 70, text: 'text-2xl sm:text-3xl', sub: 'text-xs tracking-widest' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* SVG Monogram replica from uploaded brand identity */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        aria-label="Cloth Collection Monogram Logo"
      >
        {/* Outer Red Crescent Swirl */}
        <path
          d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C69.5 110 78.4 107.3 86 102.6C58 100 36 78 36 60C36 42 58 20 86 17.4C78.4 12.7 69.5 10 60 10Z"
          fill="#A62828"
        />
        {/* Charcoal Top Serif & Outer Arc Finial */}
        <path
          d="M86 17.4C80 21 72 26 65 33C80 34 94 45 96 60C98 75 88 88 75 96C80 94 85 90 90 85C98 75 100 63 97 50C95 40 92 28 86 17.4Z"
          fill={isLight ? '#E7DFD5' : '#23201E'}
        />
        {/* Inner Charcoal/Black C */}
        <path
          d="M66 40C54.954 40 46 48.954 46 60C46 71.046 54.954 80 66 80C73.8 80 80.5 75.5 83.8 69H71.5C69.3 71.2 66.8 72 64.5 72C57.9 72 52.8 66.8 52.8 60C52.8 53.2 57.9 48 64.5 48C67 48 69.5 48.9 71.6 51H84C80.6 44.4 73.9 40 66 40Z"
          fill={isLight ? '#FFFFFF' : '#1C1917'}
        />
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <span
          className={`font-semibold tracking-[0.18em] uppercase leading-tight transition-colors ${
            isLight ? 'text-white' : 'text-[#1C1917]'
          } ${currentSize.text}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          CLOTHES COLLECTION
        </span>
        {showSubtitle && (
          <span
            className={`tracking-[0.25em] uppercase font-medium transition-colors ${
              isLight ? 'text-stone-300' : 'text-[#8B2626]'
            } ${currentSize.sub}`}
          >
            AGRA · EST. 1943
          </span>
        )}
      </div>
    </div>
  );
};
