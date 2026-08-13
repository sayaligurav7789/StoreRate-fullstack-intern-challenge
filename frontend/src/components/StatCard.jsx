import React from 'react';

export default function StatCard({ label, value, index }) {
  return (
    <div className="card relative overflow-hidden p-6">
      <span className="stamp-label">{String(index).padStart(2, '0')}</span>
      <p className="mt-3 font-display text-4xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink/60">{label}</p>
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-100/60" />
    </div>
  );
}
