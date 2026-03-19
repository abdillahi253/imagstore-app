export default function UploadProgress({ pct, done, total }) {
  return (
    <div className="upload-progress">
      <div className="progress-title">
        <span>Import en cours…</span>
        <span className="progress-pct">{pct}%</span>
      </div>
      <div className="progress-bar-bg">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-sub">
        {done} / {total} fichier{total > 1 ? 's' : ''}
      </div>
    </div>
  )
}