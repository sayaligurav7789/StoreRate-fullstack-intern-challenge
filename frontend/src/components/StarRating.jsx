import React, { useState } from 'react';

/**
 * Renders 5 stars. If `onChange` is provided, becomes an interactive picker;
 * otherwise renders as a read-only display of `value`.
 */
export default function StarRating({ value = 0, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const interactive = typeof onChange === 'function';
  const display = interactive && hovered ? hovered : Math.round(value || 0);

  const sizeClass = size === 'lg' ? 'w-7 h-7' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div
      className="inline-flex items-center gap-1"
      role={interactive ? 'radiogroup' : undefined}
      aria-label={interactive ? 'Select a rating from 1 to 5' : `Rated ${value || 0} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          aria-checked={interactive ? n === Math.round(value) : undefined}
          role={interactive ? 'radio' : undefined}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => interactive && setHovered(n)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onChange(n)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-transform duration-150 ${
            interactive ? 'hover:scale-[1.15] active:scale-95' : ''
          }`}
        >
          <svg
            viewBox="0 0 20 20"
            className={`${sizeClass} transition-colors duration-150 ${
              n <= display ? 'fill-amber-400 drop-shadow-[0_1px_2px_rgba(227,143,15,0.35)]' : 'fill-slate-200'
            }`}
          >
            <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.09.99 5.77L10 14.77l-5.18 2.68.99-5.77L1.62 7.59l5.79-.84L10 1.5z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
