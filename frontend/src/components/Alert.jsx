import React, { useEffect } from 'react';

const CONFIG = {
  success: {
    icon: '✓',
    iconClass: 'bg-emerald-100 text-emerald-600',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-700',
  },
  error: {
    icon: '!',
    iconClass: 'bg-red-100 text-red-600',
    borderClass: 'border-red-200',
    textClass: 'text-red-700',
  },
  info: {
    icon: 'i',
    iconClass: 'bg-blue-100 text-blue-600',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-700',
  },
};

export default function Alert({
  type = 'info',
  children,
  onClose,
  duration = 3500,
}) {
  useEffect(() => {
    if (!children || !onClose) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [children, onClose, duration]);

  if (!children) return null;

  const config = CONFIG[type] || CONFIG.info;

  return (
    <>
      <style>
        {`
          @keyframes storeRateToastIn {
            from {
              opacity: 0;
              transform: translateX(30px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
        `}
      </style>

      <div
        role="status"
        aria-live="polite"
        style={{
          animation: 'storeRateToastIn 0.3s ease-out',
        }}
        className={`fixed right-5 top-5 z-[9999] flex w-[calc(100%-2.5rem)] max-w-[390px] items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-2xl ${config.borderClass}`}
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${config.iconClass}`}
        >
          {config.icon}
        </div>

        <p
          className={`flex-1 text-sm font-semibold ${config.textClass}`}
        >
          {children}
        </p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </>
  );
}