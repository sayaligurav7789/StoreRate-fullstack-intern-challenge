import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import Alert from '../components/Alert';
import {
  StoreBanner,
  getCategoryLabel,
  getStoreImage,
} from '../components/StoreVisual';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [openReviewId, setOpenReviewId] = useState(null);

  const fetchStores = async () => {
    setLoading(true);
    setError('');

    try {
      const params = { ...filters, sortBy, sortOrder };

      Object.keys(params).forEach((k) => {
        if (!params[k]) delete params[k];
      });

      const res = await api.get('/stores', { params });

      setStores(res.data.stores);

      setCommentDrafts((prev) => {
        const next = { ...prev };

        res.data.stores.forEach((s) => {
          if (next[s.id] === undefined) {
            next[s.id] = s.userSubmittedComment || '';
          }
        });

        return next;
      });
    } catch {
      setError('Could not load stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  const submitRating = async (storeId, value, comment) => {
    setSavingId(storeId);
    setError('');
    setSuccess('');

    try {
      await api.post(`/ratings/${storeId}`, {
        value,
        comment: comment || undefined,
      });

      setSuccess('Rating saved successfully!');

      setStores((prev) =>
        prev.map((s) => {
          if (s.id !== storeId) return s;

          const hadRating = s.userSubmittedRating !== null;
          const priorTotal = s.totalRatings;
          const priorSum = (s.overallRating || 0) * priorTotal;

          const newTotal = hadRating
            ? priorTotal
            : priorTotal + 1;

          const newSum = hadRating
            ? priorSum - s.userSubmittedRating + value
            : priorSum + value;

          return {
            ...s,
            userSubmittedRating: value,
            userSubmittedComment: comment || null,
            totalRatings: newTotal,
            overallRating: Number(
              (newSum / newTotal).toFixed(2)
            ),
          };
        })
      );
    } catch {
      setError('Could not save your rating. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  const handleRate = (storeId, value) => {
    submitRating(
      storeId,
      value,
      commentDrafts[storeId]
    );
  };

  const handleSaveComment = (storeId, currentValue) => {
    if (!currentValue) {
      setError(
        'Rate the store with stars before adding a written comment.'
      );
      return;
    }

    submitRating(
      storeId,
      currentValue,
      commentDrafts[storeId]
    );
  };

  const sortBtn = (key, label) => (
    <button
      onClick={() => {
        if (sortBy === key) {
          setSortOrder((o) =>
            o === 'asc' ? 'desc' : 'asc'
          );
        } else {
          setSortBy(key);
          setSortOrder('asc');
        }
      }}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
        sortBy === key
          ? 'bg-brand-600 text-white shadow-sm'
          : 'bg-white text-ink/60 hover:bg-brand-100 hover:text-ink'
      }`}
    >
      {label}{' '}
      {sortBy === key &&
        (sortOrder === 'asc' ? '↑' : '↓')}
    </button>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 page-enter">

      {/* Page Header */}
      <div className="mb-6">
        <p className="stamp-label">Browse</p>

        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
          Registered stores
        </h1>

        <p className="mt-1 text-sm text-ink/60">
          Search, sort, and rate any store on the platform.
        </p>
      </div>

      {/* Toast Notifications */}
      <Alert
        type="error"
        onClose={() => setError('')}
      >
        {error}
      </Alert>

      <Alert
        type="success"
        onClose={() => setSuccess('')}
      >
        {success}
      </Alert>

      {/* Search & Sort */}
      <div className="card mb-5 flex flex-wrap items-center gap-3 p-4">

        <input
          className="input-field min-w-[180px] flex-1"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) =>
            setFilters({
              ...filters,
              name: e.target.value,
            })
          }
          onKeyDown={(e) =>
            e.key === 'Enter' && fetchStores()
          }
        />

        <input
          className="input-field min-w-[180px] flex-1"
          placeholder="Search by address"
          value={filters.address}
          onChange={(e) =>
            setFilters({
              ...filters,
              address: e.target.value,
            })
          }
          onKeyDown={(e) =>
            e.key === 'Enter' && fetchStores()
          }
        />

        <button
          className="btn-secondary"
          onClick={fetchStores}
        >
          Search
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="stamp-label">
            Sort
          </span>

          {sortBtn('name', 'Name')}
          {sortBtn('rating', 'Rating')}
        </div>
      </div>

      {/* Store Loading / Empty / Cards */}
      {loading ? (
        <p className="stamp-label">
          Loading stores…
        </p>
      ) : stores.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink/50">
          No stores match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {stores.map((s) => (
            <div
              key={s.id}
              className="card card-hover overflow-hidden"
            >

              {/* Store Banner */}
              <StoreBanner
                name={s.name}
                height={170}
                onClick={() => window.open(getStoreImage(s.name), '_blank')}
              />
              

              <div className="px-5 pb-5">

                {/* Avatar + Rating */}
                <div className="flex items-center justify-end pt-2">

                  <div className="pb-0.5 text-right">

                    <StarRating
                      value={s.overallRating || 0}
                      size="sm"
                    />

                    <p className="mt-0.5 font-mono text-xs text-ink/50">
                      {s.overallRating !== null
                        ? `${s.overallRating} avg`
                        : 'No ratings'}{' '}
                      · {s.totalRatings}{' '}
                      {s.totalRatings === 1
                        ? 'rating'
                        : 'ratings'}
                    </p>

                  </div>
                </div>

                {/* Store Information */}
                <div className="mt-2">

                  <span className="stamp-label">
                    {getCategoryLabel(s.name)}
                  </span>

                  <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
                    {s.name}
                  </h3>

                  <p className="mt-0.5 text-sm text-ink/60">
                    {s.address}
                  </p>

                </div>

                {/* Rating Section */}
                <div className="mt-4 border-t border-brand-50 pt-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="stamp-label">
                        Your rating
                      </p>

                      <StarRating
                        value={
                          s.userSubmittedRating || 0
                        }
                        onChange={(v) =>
                          handleRate(s.id, v)
                        }
                        size="md"
                      />
                    </div>

                    {/* Saving */}
                    {savingId === s.id && (
                      <span className="flex items-center gap-1.5 text-xs text-ink/40">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
                        Saving…
                      </span>
                    )}

                    {/* Rated Badge */}
                    {s.userSubmittedRating &&
                      savingId !== s.id && (
                        <span className="badge animate-[fadeIn_0.25s_ease-out] bg-emerald-50 text-emerald-700">
                          You rated{' '}
                          {s.userSubmittedRating}
                        </span>
                      )}

                  </div>

                  {/* Comment */}
                  {s.userSubmittedRating ? (
                    <div className="mt-3">

                      <textarea
                        className="input-field min-h-[64px] resize-y text-sm"
                        placeholder="Add a short comment about your experience (optional)"
                        maxLength={500}
                        value={
                          commentDrafts[s.id] ?? ''
                        }
                        onChange={(e) =>
                          setCommentDrafts({
                            ...commentDrafts,
                            [s.id]: e.target.value,
                          })
                        }
                      />

                      <div className="mt-1.5 flex items-center justify-between">

                        <span className="text-xs text-ink/35">
                          {(commentDrafts[s.id] || '')
                            .length}
                          /500
                        </span>

                        <button
                          className="btn-secondary !px-3 !py-1.5 text-xs"
                          disabled={
                            savingId === s.id ||
                            (commentDrafts[s.id] || '') ===
                              (s.userSubmittedComment || '')
                          }
                          onClick={() =>
                            handleSaveComment(
                              s.id,
                              s.userSubmittedRating
                            )
                          }
                        >
                          Save comment
                        </button>

                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-ink/40">
                      Rate this store to leave a written
                      comment too.
                    </p>
                  )}

                </div>

                {/* Recent Reviews */}
                {s.reviews &&
                  s.reviews.length > 0 && (
                    <div className="mt-4 border-t border-brand-50 pt-3">

                      <button
                        className="flex w-full items-center justify-between text-left"
                        onClick={() =>
                          setOpenReviewId(
                            openReviewId === s.id
                              ? null
                              : s.id
                          )
                        }
                      >

                        <span className="stamp-label">
                          {s.reviews.length} recent{' '}
                          {s.reviews.length === 1
                            ? 'review'
                            : 'reviews'}
                        </span>

                        <svg
                          viewBox="0 0 20 20"
                          className={`h-4 w-4 fill-none stroke-current stroke-2 text-ink/40 transition-transform duration-200 ${
                            openReviewId === s.id
                              ? 'rotate-180'
                              : ''
                          }`}
                        >
                          <path
                            d="M5 7.5l5 5 5-5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                      </button>

                      {openReviewId === s.id && (
                        <ul className="mt-3 space-y-3 animate-[fadeInUp_0.2s_ease-out]">

                          {s.reviews.map((r) => (
                            <li
                              key={r.id}
                              className="rounded-xl bg-brand-50/60 p-3"
                            >

                              <div className="flex items-center justify-between">

                                <span className="text-xs font-semibold text-ink/80">
                                  {r.reviewerName}
                                </span>

                                <StarRating
                                  value={r.value}
                                  size="sm"
                                />

                              </div>

                              <p className="mt-1.5 text-sm text-ink/70">
                                {r.comment}
                              </p>

                            </li>
                          ))}

                        </ul>
                      )}

                    </div>
                  )}

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}
