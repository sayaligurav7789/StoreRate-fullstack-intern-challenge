import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_LABEL = {
  SYSTEM_ADMIN: 'Administrator',
  NORMAL_USER: 'Member',
  STORE_OWNER: 'Store Owner',
};

function linkClass({ isActive }) {
  return `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? 'bg-brand-600 text-white' : 'text-ink/70 hover:bg-brand-100/70 hover:text-ink'
  }`;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const links = [];
  if (user.role === 'SYSTEM_ADMIN') {
    links.push(
      { to: '/admin', label: 'Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/stores', label: 'Stores' }
    );
  }
  if (user.role === 'NORMAL_USER') {
    links.push({ to: '/stores', label: 'Browse Stores' });
  }
  if (user.role === 'STORE_OWNER') {
    links.push({ to: '/owner', label: 'My Store' });
  }
  links.push({ to: '/account/password', label: 'Password' });

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-brand-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-display text-base font-semibold text-white">
            S
          </span>
          <span className="font-display text-lg font-semibold text-ink">StoreRate</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-ink">{user.name}</p>
            <p className="stamp-label">{ROLE_LABEL[user.role]}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary !px-3 !py-2 text-xs">
            Log out
          </button>
        </div>

        <button
          className="rounded-lg p-2 text-ink md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-100 bg-white px-5 py-3 md:hidden">
          <div className="mb-2">
            <p className="text-sm font-semibold text-ink">{user.name}</p>
            <p className="stamp-label">{ROLE_LABEL[user.role]}</p>
          </div>
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} end onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="btn-secondary mt-2 !py-2 text-xs">
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
