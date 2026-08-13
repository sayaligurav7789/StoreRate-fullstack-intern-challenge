import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import Alert from '../components/Alert';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load dashboard statistics.'));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 page-enter">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="stamp-label">Administration</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Platform overview</h1>
        </div>
        <div className="hidden gap-3 sm:flex">
          <Link to="/admin/users" className="btn-secondary">
            Manage users
          </Link>
          <Link to="/admin/stores" className="btn-primary">
            Manage stores
          </Link>
        </div>
      </div>

      <Alert type="error">{error}</Alert>

      {stats ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard index={1} label="Total registered users" value={stats.totalUsers} />
          <StatCard index={2} label="Total registered stores" value={stats.totalStores} />
          <StatCard index={3} label="Total ratings submitted" value={stats.totalRatings} />
        </div>
      ) : (
        !error && <p className="mt-6 stamp-label">Loading statistics…</p>
      )}

      <div className="mt-6 flex gap-3 sm:hidden">
        <Link to="/admin/users" className="btn-secondary flex-1">
          Manage users
        </Link>
        <Link to="/admin/stores" className="btn-primary flex-1">
          Manage stores
        </Link>
      </div>
    </div>
  );
}
