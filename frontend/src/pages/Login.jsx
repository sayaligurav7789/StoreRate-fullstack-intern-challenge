import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import Alert from '../components/Alert';
import { extractApiErrors } from '../utils/validation';

const HOME_BY_ROLE = {
  SYSTEM_ADMIN: '/admin',
  NORMAL_USER: '/stores',
  STORE_OWNER: '/owner',
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      navigate(HOME_BY_ROLE[user.role] || '/');
    } catch (err) {
      setError(extractApiErrors(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 font-display text-lg font-semibold text-white">
            S
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink/60">Sign in to rate and manage stores.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-7">
          <Alert type="error">{error}</Alert>

          <FormField label="Email address">
            <input
              type="email"
              required
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </FormField>

          <FormField label="Password">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="input-field pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink/40 hover:text-ink/70"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  // eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  // eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </FormField>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-brand-700 hover:underline">
            Create a normal user account
          </Link>
        </p>
      </div>
    </div>
  );
}