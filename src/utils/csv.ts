export function toCSV(rows: any[], columns?: string[]): string {
  if (!rows || !rows.length) return ''
  const keys = columns && columns.length ? columns : Object.keys(rows[0])
  const escape = (v: any) => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"'
    }
    return s
  }
  const header = keys.join(',')
  const lines = rows.map((r) => keys.map((k) => escape(r[k])).join(','))
  return [header, ...lines].join('\n')
}

export function downloadCSV(filename: string, rows: any[], columns?: string[]) {
  const csv = toCSV(rows, columns)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
