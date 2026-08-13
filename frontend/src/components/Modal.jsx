import React from 'react';

export default function Modal({ title, onClose, children, wide }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className={`card w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto p-6 shadow-elevated animate-[fadeInUp_0.25s_cubic-bezier(0.16,1,0.3,1)]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-ink/50 transition-colors duration-150 hover:bg-brand-50 hover:text-ink"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-current stroke-2">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
