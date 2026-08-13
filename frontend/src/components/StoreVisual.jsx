import React from 'react';

const STORE_IMAGES = {
  'Bloom & Petal Flower Boutique': '/store-images/bloom-petal.png',
  'Harborview Electronics Store': '/store-images/harborview.png',
  'The Golden Spoon Restaurant': '/store-images/golden-spoon.png',
  'Summit Peak Outdoor Gear': '/store-images/summit-peak.png',
};

const CATEGORIES = [
  {
    label: 'Restaurant & Dining',
    keywords: ['restaurant', 'kitchen', 'spoon', 'diner', 'bistro', 'eatery', 'grill'],
  },
  {
    label: 'Electronics & Tech',
    keywords: ['electronics', 'tech', 'gadget', 'computer', 'digital', 'device'],
  },
  {
    label: 'Flowers & Garden',
    keywords: ['flower', 'petal', 'garden', 'bloom', 'floral', 'botanic'],
  },
  {
    label: 'Outdoor & Recreation',
    keywords: ['outdoor', 'gear', 'peak', 'trail', 'summit', 'mountain', 'camp'],
  },
  {
    label: 'Books & Media',
    keywords: ['book', 'library', 'read', 'media', 'press'],
  },
  {
    label: 'Coffee & Café',
    keywords: ['coffee', 'roast', 'bean', 'cafe', 'espresso'],
  },
  {
    label: 'Fashion & Apparel',
    keywords: ['fashion', 'apparel', 'boutique', 'wear', 'style', 'thread'],
  },
  {
    label: 'Grocery & Market',
    keywords: ['grocery', 'market', 'mart', 'farm', 'provisions'],
  },
];

export function getCategoryLabel(name) {
  const lower = (name || '').toLowerCase();

  const match = CATEGORIES.find((category) =>
    category.keywords.some((keyword) => lower.includes(keyword))
  );

  return match ? match.label : 'General Store';
}

export function getStoreImage(name) {
  return STORE_IMAGES[name] || null;
}

export function getInitials(name) {
  const words = (name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return '?';

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export function StoreBanner({
  name,
  height = 170,
  className = '',
  onClick,
}) {
  const image = getStoreImage(name);

  return (
    <div
      style={{ height }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-t-2xl ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {image ? (
        <>
          <img
            src={image}
            alt={`${name} storefront`}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          <div className="absolute bottom-4 left-5">
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-lg backdrop-blur-sm">
              {getCategoryLabel(name)}
            </span>
          </div>

          {onClick && (
            <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              Click to view
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full items-center justify-center bg-brand-600 text-white">
          <span className="text-sm font-semibold">
            {name}
          </span>
        </div>
      )}
    </div>
  );
}
