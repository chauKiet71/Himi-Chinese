export default function AdminLoading() {
  return <main aria-busy="true" aria-live="polite" className="admin-page admin-loading-page">
    <div className="section-shell">
      <header className="admin-loading-header">
        <span className="admin-loading-block eyebrow" />
        <span className="admin-loading-block title" />
      </header>
      <section className="admin-loading-content">
        <p><span className="admin-loading-spinner" /> Đang tải dữ liệu quản trị…</p>
        <div className="admin-loading-stats">{Array.from({ length: 4 }, (_, index) => <span className="admin-loading-block card" key={index} />)}</div>
        <div className="admin-loading-panels"><span className="admin-loading-block panel" /><span className="admin-loading-block panel" /></div>
      </section>
    </div>
  </main>;
}
