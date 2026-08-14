import React, { useState } from 'react';
import api from '../api/axios';
import FormField from '../components/FormField';
import Alert from '../components/Alert';
import { validatePassword, extractApiErrors } from '../utils/validation';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const pwError = validatePassword(form.newPassword);
    if (pwError) {
      setFieldErrors({ newPassword: pwError });
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    try {
      const res = await api.put('/auth/password', form);
      setSuccess(res.data.message || 'Password updated successfully');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      const { fieldErrors: apiErrs, message } = extractApiErrors(err);
      setFieldErrors(apiErrs);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-10 page-enter">
      <h1 className="font-display text-2xl font-semibold text-ink">Update password</h1>
      <p className="mt-1 text-sm text-ink/60">Keep your account secure with a strong password.</p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-7">
        <Alert type="error">{error}</Alert>
        <Alert type="success">{success}</Alert>

        <FormField label="Current password" error={fieldErrors.currentPassword}>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              className="input-field pr-10"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink/40 hover:text-ink/70"
              tabIndex={-1}
              aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
            >
              {showCurrentPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </FormField>

        <FormField
          label="New password"
          error={fieldErrors.newPassword}
          hint="8–16 characters, 1 uppercase letter, 1 special character"
        >
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              className="input-field pr-10"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink/40 hover:text-ink/70"
              tabIndex={-1}
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </FormField>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}