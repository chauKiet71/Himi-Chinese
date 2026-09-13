export function PageLoadingSkeleton({ label = "Đang mở nội dung…" }: { label?: string }) {
  return <main aria-busy="true" className="page-loading-shell">
    <span className="sr-only" role="status">{label}</span>
    <div aria-hidden="true" className="page-loading-heading">
      <span className="skeleton-block" />
      <span className="skeleton-block" />
      <span className="skeleton-block" />
    </div>
    <div aria-hidden="true" className="page-loading-grid">
      <section className="page-loading-card page-loading-card-featured">
        <span className="skeleton-block" />
        <span className="skeleton-block" />
        <span className="skeleton-block" />
      </section>
      <section className="page-loading-card">
        <span className="skeleton-block" />
        <span className="skeleton-block" />
        <span className="skeleton-block" />
      </section>
      <section className="page-loading-card">
        <span className="skeleton-block" />
        <span className="skeleton-block" />
        <span className="skeleton-block" />
      </section>
    </div>
  </main>;
}
