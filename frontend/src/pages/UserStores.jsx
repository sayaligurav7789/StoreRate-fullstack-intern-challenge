import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import Alert from '../components/Alert';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingId, setSavingId] = useState(null);

  const fetchStores = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters, sortBy, sortOrder };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/stores', { params });
      setStores(res.data.stores);
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

  const handleRate = async (storeId, value) => {
    setSavingId(storeId);
    setError('');
    setSuccess('');
    try {
      await api.post(`/ratings/${storeId}`, { value });
      setSuccess('Rating saved.');
      setStores((prev) =>
        prev.map((s) => {
          if (s.id !== storeId) return s;
          const hadRating = s.userSubmittedRating !== null;
          const priorTotal = s.totalRatings;
          const priorSum = (s.overallRating || 0) * priorTotal;
          const newTotal = hadRating ? priorTotal : priorTotal + 1;
          const newSum = hadRating ? priorSum - s.userSubmittedRating + value : priorSum + value;
          return {
            ...s,
            userSubmittedRating: value,
            totalRatings: newTotal,
            overallRating: Number((newSum / newTotal).toFixed(2)),
          };
        })
      );
    } catch {
      setError('Could not save your rating. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  const sortBtn = (key, label) => (
    <button
      onClick={() => {
        if (sortBy === key) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
        else {
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
      {label} {sortBy === key && (sortOrder === 'asc' ? '↑' : '↓')}
    </button>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 page-enter">
      <div className="mb-6">
        <p className="stamp-label">Browse</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Registered stores</h1>
        <p className="mt-1 text-sm text-ink/60">Search, sort, and rate any store on the platform.</p>
      </div>

      <Alert type="error">{error}</Alert>
      <Alert type="success">{success}</Alert>

      <div className="card mb-5 flex flex-wrap items-center gap-3 p-4">
        <input
          className="input-field flex-1 min-w-[180px]"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && fetchStores()}
        />
        <input
          className="input-field flex-1 min-w-[180px]"
          placeholder="Search by address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && fetchStores()}
        />
        <button className="btn-secondary" onClick={fetchStores}>
          Search
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="stamp-label">Sort</span>
          {sortBtn('name', 'Name')}
          {sortBtn('rating', 'Rating')}
        </div>
      </div>

      {loading ? (
        <p className="stamp-label">Loading stores…</p>
      ) : stores.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink/50">No stores match your search.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stores.map((s) => (
            <div key={s.id} className="card card-hover p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{s.name}</h3>
                  <p className="mt-0.5 text-sm text-ink/60">{s.address}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <StarRating value={s.overallRating || 0} size="sm" />
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-ink/50">
                    {s.overallRating !== null ? `${s.overallRating} avg` : 'No ratings'} · {s.totalRatings} ratings
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-brand-50 pt-4">
                <div>
                  <p className="stamp-label">Your rating</p>
                  <StarRating
                    value={s.userSubmittedRating || 0}
                    onChange={(v) => handleRate(s.id, v)}
                    size="md"
                  />
                </div>
                {savingId === s.id && (
                  <span className="flex items-center gap-1.5 text-xs text-ink/40">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
                    Saving…
                  </span>
                )}
                {s.userSubmittedRating && savingId !== s.id && (
                  <span className="badge animate-[fadeIn_0.25s_ease-out] bg-emerald-50 text-emerald-700">
                    You rated {s.userSubmittedRating}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
