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
    <div className="mx-auto max-w-lg px-5 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Update password</h1>
      <p className="mt-1 text-sm text-ink/60">Keep your account secure with a strong password.</p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-7">
        <Alert type="error">{error}</Alert>
        <Alert type="success">{success}</Alert>

        <FormField label="Current password" error={fieldErrors.currentPassword}>
          <input
            type="password"
            className="input-field"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          />
        </FormField>

        <FormField
          label="New password"
          error={fieldErrors.newPassword}
          hint="8–16 characters, 1 uppercase letter, 1 special character"
        >
          <input
            type="password"
            className="input-field"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
        </FormField>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
