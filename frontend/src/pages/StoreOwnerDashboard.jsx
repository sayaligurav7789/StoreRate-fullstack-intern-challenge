import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import StatCard from '../components/StatCard';
import Alert from '../components/Alert';
import {
  StoreBanner,
  getCategoryLabel,
  getStoreImage,
} from '../components/StoreVisual';

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/stores/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
            'Could not load your store dashboard.'
        );
      });
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10 page-enter">
        <Alert type="error">{error}</Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10 page-enter">
        <p className="stamp-label">Loading your store…</p>
      </div>
    );
  }

  const storeImage = getStoreImage(data.store.name);

  const openStoreImage = () => {
    if (!storeImage) return;

    window.open(storeImage, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 page-enter">

      {/* Store Header */}
      <div className="card overflow-hidden">

        <StoreBanner
          name={data.store.name}
          height={180}
          onClick={storeImage ? openStoreImage : undefined}
        />

        <div className="px-6 pb-6">

          {/* Store Information */}
          <div className="mt-3">

            <span className="stamp-label">
              {getCategoryLabel(data.store.name)}
            </span>

            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
              {data.store.name}
            </h1>

            <p className="mt-1 text-sm text-ink/60">
              {data.store.address}
            </p>

          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

        {/* Average Rating */}
        <div className="card p-6">

          <span className="stamp-label">
            Average rating
          </span>

          <div className="mt-3 flex items-center gap-3">

            <p className="font-display text-4xl font-semibold text-ink">
              {data.averageRating !== null
                ? data.averageRating
                : '—'}
            </p>

            <StarRating
              value={data.averageRating || 0}
            />

          </div>
        </div>

        {/* Total Ratings */}
        <StatCard
          index={2}
          label="Total ratings received"
          value={data.totalRatings}
        />

      </div>

      {/* Ratings */}
      <h2 className="mt-10 mb-4 font-display text-xl font-semibold text-ink">
        Who rated your store
      </h2>

      <div className="card overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead>
              <tr className="border-b border-brand-100 bg-brand-50/70">

                <th className="px-4 py-3.5 font-mono text-[11px] uppercase tracking-wider text-ink/55">
                  Name
                </th>

                <th className="px-4 py-3.5 font-mono text-[11px] uppercase tracking-wider text-ink/55">
                  Email
                </th>

                <th className="px-4 py-3.5 font-mono text-[11px] uppercase tracking-wider text-ink/55">
                  Rating
                </th>

                <th className="px-4 py-3.5 font-mono text-[11px] uppercase tracking-wider text-ink/55">
                  Comment
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-brand-100/70">

              {data.raters.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-sm text-ink/50"
                  >
                    No one has rated your store yet.
                  </td>
                </tr>
              )}

              {data.raters.map((r) => (
                <tr
                  key={r.ratingId}
                  className="table-row"
                >

                  <td className="px-4 py-3 font-medium text-ink">
                    {r.user.name}
                  </td>

                  <td className="px-4 py-3 text-ink/70">
                    {r.user.email}
                  </td>

                  <td className="px-4 py-3">
                    <StarRating
                      value={r.value}
                      size="sm"
                    />
                  </td>

                  <td className="max-w-xs px-4 py-3 text-ink/60">
                    {r.comment ? (
                      r.comment
                    ) : (
                      <span className="text-ink/30">
                        No comment
                      </span>
                    )}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}