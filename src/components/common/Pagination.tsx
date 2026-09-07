interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
      <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
        Previous
      </button>

      <div className="flex items-center gap-2">
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            className={[
              'h-9 min-w-9 rounded-lg border text-sm font-medium',
              page === currentPage
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            ].join(' ')}
          >
            {page}
          </button>
        ))}
      </div>

      <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
        Next
      </button>
    </div>
  )
}
