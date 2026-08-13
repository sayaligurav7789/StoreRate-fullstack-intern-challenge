import React from 'react';

const STYLES = {
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  info: 'bg-brand-50 text-brand-800 border-brand-200',
};

export default function Alert({ type = 'info', children }) {
  if (!children) return null;
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${STYLES[type]}`} role="status">
      {children}
    </div>
  );
}
