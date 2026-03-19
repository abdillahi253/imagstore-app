const NAV = [
  { id: 'photos', icon: '🖼', label: 'Photos' },
  { id: 'upload', icon: '⬆', label: 'Importer' },
]

export default function Sidebar({ tab, onTab, photoCount, onLogout }) {
  return (
    <div className="sidebar">
      {NAV.map((n) => (
        <div
          key={n.id}
          className={`nav-item${tab === n.id ? ' active' : ''}`}
          onClick={() => onTab(n.id)}
        >
          <span className="nav-icon">{n.icon}</span>
          {n.label}
        </div>
      ))}

      <div className="nav-divider" />

      <div className="nav-item" onClick={onLogout}>
        <span className="nav-icon">🚪</span>
        Déconnexion
      </div>

      <div className="sidebar-storage">
        <div className="storage-label">
          {photoCount} photo{photoCount !== 1 ? 's' : ''} stockée{photoCount !== 1 ? 's' : ''}
        </div>
        <div className="storage-bar-bg">
          <div className="storage-bar" />
        </div>
        <div className="storage-label" style={{ opacity: 0.6 }}>Espace utilisé</div>
      </div>
    </div>
  )
}