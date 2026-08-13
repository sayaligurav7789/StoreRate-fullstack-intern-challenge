import React from 'react';

export default function FormField({ label, error, children, hint }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink/40">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
