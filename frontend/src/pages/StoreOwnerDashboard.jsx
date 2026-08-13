import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import StatCard from '../components/StatCard';
import Alert from '../components/Alert';

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/stores/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => {
        setError(err?.response?.data?.message || 'Could not load your store dashboard.');
      });
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10">
        <Alert type="error">{error}</Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10">
        <p className="stamp-label">Loading your store…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="stamp-label">Store owner</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">{data.store.name}</h1>
      <p className="mt-1 text-sm text-ink/60">{data.store.address}</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="card p-6">
          <span className="stamp-label">Average rating</span>
          <div className="mt-3 flex items-center gap-3">
            <p className="font-display text-4xl font-semibold text-ink">
              {data.averageRating !== null ? data.averageRating : '—'}
            </p>
            <StarRating value={data.averageRating || 0} />
          </div>
        </div>
        <StatCard index={2} label="Total ratings received" value={data.totalRatings} />
      </div>

      <h2 className="mt-10 mb-4 font-display text-xl font-semibold text-ink">Who rated your store</h2>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-100 bg-brand-50/60">
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-ink/60">Name</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-ink/60">Email</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-ink/60">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100/70">
            {data.raters.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-ink/50">
                  No one has rated your store yet.
                </td>
              </tr>
            )}
            {data.raters.map((r) => (
              <tr key={r.ratingId} className="hover:bg-brand-50/50">
                <td className="px-4 py-3 font-medium text-ink">{r.user.name}</td>
                <td className="px-4 py-3 text-ink/70">{r.user.email}</td>
                <td className="px-4 py-3">
                  <StarRating value={r.value} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
