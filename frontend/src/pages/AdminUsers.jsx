import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import Alert from '../components/Alert';
import StarRating from '../components/StarRating';
import {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
  extractApiErrors,
} from '../utils/validation';

const ROLE_BADGE = {
  SYSTEM_ADMIN: 'bg-brand-600 text-white',
  NORMAL_USER: 'bg-brand-100 text-brand-800',
  STORE_OWNER: 'bg-amber-400/20 text-amber-500',
};

const ROLE_LABEL = {
  SYSTEM_ADMIN: 'Admin',
  NORMAL_USER: 'Normal User',
  STORE_OWNER: 'Store Owner',
};

const emptyForm = { name: '', email: '', address: '', password: '', role: 'NORMAL_USER' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [detail, setDetail] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters, sortBy, sortOrder };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.users);
    } catch {
      setError('Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  const validateAll = () => {
    const errs = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
    };
    Object.keys(errs).forEach((k) => !errs[k] && delete errs[k]);
    return errs;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError('');
    const errs = validateAll();
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      await api.post('/admin/users', form);
      setShowAdd(false);
      setForm(emptyForm);
      fetchUsers();
    } catch (err) {
      const { fieldErrors: apiErrs, message } = extractApiErrors(err);
      setFieldErrors(apiErrs);
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (id) => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setDetail(res.data.user);
    } catch {
      setError('Could not load user details.');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'actions', label: '' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 page-enter">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="stamp-label">Administration</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Users</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          + Add user
        </button>
      </div>

      <Alert type="error">{error}</Alert>

      <div className="card mb-5 grid grid-cols-1 gap-3 p-4 sm:grid-cols-4">
        <input
          className="input-field"
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
        />
        <input
          className="input-field"
          placeholder="Filter by email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
        />
        <input
          className="input-field"
          placeholder="Filter by address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
        />
        <select
          className="input-field"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All roles</option>
          <option value="SYSTEM_ADMIN">Admin</option>
          <option value="NORMAL_USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
        <div className="sm:col-span-4">
          <button className="btn-secondary" onClick={fetchUsers}>
            Apply filters
          </button>
        </div>
      </div>

      {loading ? (
        <p className="stamp-label">Loading users…</p>
      ) : (
        <DataTable
          columns={columns}
          rows={users}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          emptyMessage="No users match these filters."
          renderRow={(u) => (
            <tr key={u.id} className="table-row">
              <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
              <td className="px-4 py-3 text-ink/70">{u.email}</td>
              <td className="max-w-xs truncate px-4 py-3 text-ink/70">{u.address}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_BADGE[u.role]}`}>
                  {ROLE_LABEL[u.role]}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-sm font-semibold text-brand-700 hover:underline" onClick={() => openDetail(u.id)}>
                  View
                </button>
              </td>
            </tr>
          )}
        />
      )}

      {showAdd && (
        <Modal title="Add a new user" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAddUser} className="space-y-4">
            <Alert type="error">{formError}</Alert>

            <FormField label="Full name" error={fieldErrors.name} hint="20–60 characters">
              <input
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>

            <FormField label="Email address" error={fieldErrors.email}>
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

            <FormField
              label="Password"
              error={fieldErrors.password}
              hint="8–16 characters, 1 uppercase letter, 1 special character"
            >
              <input
                type="password"
                className="input-field"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </FormField>

            <FormField label="Role">
              <select
                className="input-field"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="NORMAL_USER">Normal User</option>
                <option value="SYSTEM_ADMIN">System Administrator</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </FormField>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Creating…' : 'Create user'}
            </button>
          </form>
        </Modal>
      )}

      {detail && (
        <Modal title="User details" onClose={() => setDetail(null)}>
          <div className="space-y-3 text-sm">
            <Row label="Name" value={detail.name} />
            <Row label="Email" value={detail.email} />
            <Row label="Address" value={detail.address} />
            <Row label="Role" value={ROLE_LABEL[detail.role]} />
            {detail.role === 'STORE_OWNER' && (
              <div className="flex items-center justify-between border-t border-brand-100 pt-3">
                <span className="text-ink/50">Store rating</span>
                {detail.rating !== null && detail.rating !== undefined ? (
                  <div className="flex items-center gap-2">
                    <StarRating value={detail.rating} size="sm" />
                    <span className="font-mono text-xs text-ink/60">{detail.rating}</span>
                  </div>
                ) : (
                  <span className="text-ink/40">No ratings yet</span>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-brand-50 pb-2 last:border-0">
      <span className="shrink-0 text-ink/50">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}
