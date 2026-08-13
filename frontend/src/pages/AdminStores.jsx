import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import Alert from '../components/Alert';
import StarRating from '../components/StarRating';
import { validateName, validateAddress, validateEmail, extractApiErrors } from '../utils/validation';

const emptyForm = { name: '', email: '', address: '', ownerId: '' };

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters, sortBy, sortOrder };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/admin/stores', { params });
      setStores(res.data.stores);
    } catch {
      setError('Could not load stores.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await api.get('/admin/users', { params: { role: 'STORE_OWNER' } });
      setOwners(res.data.users);
    } catch {
      // non-fatal
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const openAdd = () => {
    fetchOwners();
    setForm(emptyForm);
    setFieldErrors({});
    setFormError('');
    setShowAdd(true);
  };

  const validateAll = () => {
    const errs = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
    };
    Object.keys(errs).forEach((k) => !errs[k] && delete errs[k]);
    return errs;
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setFormError('');
    const errs = validateAll();
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.ownerId) delete payload.ownerId;
      await api.post('/admin/stores', payload);
      setShowAdd(false);
      fetchStores();
    } catch (err) {
      const { fieldErrors: apiErrs, message } = extractApiErrors(err);
      setFieldErrors(apiErrs);
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="stamp-label">Administration</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Stores</h1>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          + Add store
        </button>
      </div>

      <Alert type="error">{error}</Alert>

      <div className="card mb-5 grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
        <input
          className="input-field"
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && fetchStores()}
        />
        <input
          className="input-field"
          placeholder="Filter by email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && fetchStores()}
        />
        <input
          className="input-field"
          placeholder="Filter by address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && fetchStores()}
        />
        <div className="sm:col-span-3">
          <button className="btn-secondary" onClick={fetchStores}>
            Apply filters
          </button>
        </div>
      </div>

      {loading ? (
        <p className="stamp-label">Loading stores…</p>
      ) : (
        <DataTable
          columns={columns}
          rows={stores}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          emptyMessage="No stores match these filters."
          renderRow={(s) => (
            <tr key={s.id} className="hover:bg-brand-50/50">
              <td className="px-4 py-3 font-medium text-ink">{s.name}</td>
              <td className="px-4 py-3 text-ink/70">{s.email}</td>
              <td className="max-w-xs truncate px-4 py-3 text-ink/70">{s.address}</td>
              <td className="px-4 py-3">
                {s.rating !== null ? (
                  <div className="flex items-center gap-2">
                    <StarRating value={s.rating} size="sm" />
                    <span className="font-mono text-xs text-ink/60">
                      {s.rating} ({s.totalRatings})
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-ink/40">No ratings yet</span>
                )}
              </td>
            </tr>
          )}
        />
      )}

      {showAdd && (
        <Modal title="Add a new store" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAddStore} className="space-y-4">
            <Alert type="error">{formError}</Alert>

            <FormField label="Store name" error={fieldErrors.name} hint="20–60 characters">
              <input
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>

            <FormField label="Store email" error={fieldErrors.email}>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </FormField>

            <FormField label="Address" error={fieldErrors.address} hint="Up to 400 characters">
              <textarea
                className="input-field min-h-[70px]"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </FormField>

            <FormField label="Assign store owner (optional)">
              <select
                className="input-field"
                value={form.ownerId}
                onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
              >
                <option value="">No owner yet</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.email})
                  </option>
                ))}
              </select>
            </FormField>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Creating…' : 'Create store'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
