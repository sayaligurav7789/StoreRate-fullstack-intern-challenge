import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import Alert from '../components/Alert';
import StarRating from '../components/StarRating';
import { getInitials } from '../components/StoreVisual';

const ROLE_META = {
  SYSTEM_ADMIN: { label: 'Admins', bar: 'bg-brand-600', badge: 'bg-brand-600 text-white' },
  NORMAL_USER: { label: 'Normal users', bar: 'bg-brand-400', badge: 'bg-brand-100 text-brand-800' },
  STORE_OWNER: { label: 'Store owners', bar: 'bg-amber-400', badge: 'bg-amber-400/20 text-amber-600' },
};

function StatCardSkeleton({ index }) {
  return (
    <div className="card relative overflow-hidden p-6">
      <span className="stamp-label">{String(index).padStart(2, '0')}</span>
      <div className="mt-3 h-9 w-16 animate-pulse rounded-lg bg-brand-100/80" />
      <div className="mt-2 h-3.5 w-32 animate-pulse rounded bg-brand-100/60" />
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="card p-6">
      <div className="h-4 w-36 animate-pulse rounded bg-brand-100/80" />
      <div className="mt-5 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-brand-50" />
        ))}
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState(null);
  const [stores, setStores] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/admin/dashboard'), api.get('/admin/users'), api.get('/admin/stores')])
      .then(([dashboardRes, usersRes, storesRes]) => {
        setStats(dashboardRes.data);
        setUsers(usersRes.data.users);
        setStores(storesRes.data.stores);
      })
      .catch(() => setError('Could not load dashboard statistics.'));
  }, []);

  const roleCounts = users
    ? users.reduce((acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
      }, {})
    : null;

  const topStores = stores
    ? [...stores]
        .filter((s) => s.rating !== null)
        .sort((a, b) => b.rating - a.rating || b.totalRatings - a.totalRatings)
        .slice(0, 5)
    : null;

  const recentUsers = users
    ? [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 page-enter">
      <div className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="stamp-label">Administration</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Platform overview
          </h1>
          <p className="mt-1 text-sm text-ink/55">A snapshot of everything happening on StoreRate right now.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/users" className="btn-secondary flex-1 sm:flex-initial">
            Manage users
          </Link>
          <Link to="/admin/stores" className="btn-primary flex-1 sm:flex-initial">
            Manage stores
          </Link>
        </div>
      </div>

      <Alert type="error">{error}</Alert>

      {/* Top-line stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {stats ? (
          <>
            <StatCard index={1} label="Total registered users" value={stats.totalUsers} />
            <StatCard index={2} label="Total registered stores" value={stats.totalStores} />
            <StatCard index={3} label="Total ratings submitted" value={stats.totalRatings} />
          </>
        ) : (
          !error && (
            <>
              <StatCardSkeleton index={1} />
              <StatCardSkeleton index={2} />
              <StatCardSkeleton index={3} />
            </>
          )
        )}
      </div>

      {/* Deeper insights, derived from the same data admin already has access to */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Top rated stores */}
        {topStores ? (
          <div className="card p-6 lg:col-span-1">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink">Top rated stores</h2>
              <Link to="/admin/stores" className="text-xs font-semibold text-brand-700 hover:underline">
                View all
              </Link>
            </div>
            {topStores.length === 0 ? (
              <p className="mt-6 text-sm text-ink/45">No ratings have been submitted yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {topStores.map((s, i) => (
                  <li key={s.id} className="flex items-center gap-3">
                    <span className="w-4 shrink-0 font-mono text-xs text-ink/35">{i + 1}</span>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-xs font-semibold text-white">
                      {getInitials(s.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{s.name}</p>
                      <StarRating value={s.rating} size="sm" />
                    </div>
                    <span className="shrink-0 font-mono text-xs text-ink/50">{s.rating}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          !error && <PanelSkeleton />
        )}

        {/* Role breakdown */}
        {roleCounts ? (
          <div className="card p-6 lg:col-span-1">
            <h2 className="font-display text-base font-semibold text-ink">User roles</h2>
            <ul className="mt-5 space-y-4">
              {Object.entries(ROLE_META).map(([role, meta]) => {
                const count = roleCounts[role] || 0;
                const pct = users.length ? Math.round((count / users.length) * 100) : 0;
                return (
                  <li key={role}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink/70">{meta.label}</span>
                      <span className="font-mono text-xs text-ink/50">{count}</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-brand-50">
                      <div
                        className={`h-full rounded-full ${meta.bar} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          !error && <PanelSkeleton />
        )}

        {/* Recently joined */}
        {recentUsers ? (
          <div className="card p-6 lg:col-span-1">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink">Recently joined</h2>
              <Link to="/admin/users" className="text-xs font-semibold text-brand-700 hover:underline">
                View all
              </Link>
            </div>
            {recentUsers.length === 0 ? (
              <p className="mt-6 text-sm text-ink/45">No users yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {recentUsers.map((u) => (
                  <li key={u.id} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800">
                      {getInitials(u.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{u.name}</p>
                      <span
                        className={`badge mt-0.5 ${ROLE_META[u.role]?.badge || 'bg-brand-100 text-brand-800'}`}
                      >
                        {ROLE_META[u.role]?.label.replace(/s$/, '') || u.role}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs text-ink/40">{timeAgo(u.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          !error && <PanelSkeleton />
        )}
      </div>
    </div>
  );
}
