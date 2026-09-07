import type { ReactNode } from 'react'

interface TableColumn<T> {
  header: string
  accessor: keyof T
  render?: (value: T[keyof T], row: T) => ReactNode
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
}

export function Table<T extends Record<string, unknown>>({ columns, rows }: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((column) => (
                <th key={String(column.accessor)} className="px-4 py-3 font-semibold">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50/80">
                {columns.map((column) => {
                  const value = row[column.accessor]
                  return (
                    <td key={String(column.accessor)} className="px-4 py-3 align-middle">
                      {column.render ? column.render(value, row) : (value as ReactNode)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
