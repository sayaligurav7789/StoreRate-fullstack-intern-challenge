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
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Welcome back</h1>
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
            <input
              type="password"
              required
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
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
