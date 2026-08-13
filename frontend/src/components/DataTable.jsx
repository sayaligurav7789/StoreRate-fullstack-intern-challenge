import React from 'react';

/**
 * columns: [{ key, label, sortable }]
 * sortBy / sortOrder / onSort(key) are controlled by the parent (server-side sorting).
 */
export default function DataTable({ columns, rows, sortBy, sortOrder, onSort, renderRow, emptyMessage }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-100 bg-brand-50/70">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-4 py-3.5 font-mono text-[11px] uppercase tracking-wider text-ink/55"
                >
                  {col.sortable ? (
                    <button
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-700"
                      onClick={() => onSort(col.key)}
                    >
                      {col.label}
                      <span
                        className={`text-brand-600 transition-transform duration-200 ${
                          sortBy === col.key ? 'opacity-100' : 'opacity-0'
                        } ${sortBy === col.key && sortOrder === 'desc' ? 'rotate-180' : ''}`}
                      >
                        ↑
                      </span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100/70">
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-14 text-center text-sm text-ink/50">
                  {emptyMessage || 'Nothing to show yet.'}
                </td>
              </tr>
            )}
            {rows.map((row, i) => renderRow(row, i))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
