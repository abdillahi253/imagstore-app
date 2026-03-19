import { useRef } from 'react'

export default function Topbar({ user, search, onSearch, onUpload, onLogout, hidden }) {
  const fileInputRef = useRef()
  const initial = user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className={`topbar${hidden ? ' hidden' : ''}`}>
      <div className="logo">
        <span className="logo-icon">📷</span> Imagstore
      </div>

      <div className="search-wrap">
        <div className="search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Rechercher dans vos photos"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          {search && (
            <span style={{ cursor: 'pointer', color: 'var(--muted)' }}
              onClick={() => onSearch('')}>✕</span>
          )}
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" title="Importer"
          onClick={() => fileInputRef.current?.click()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>
        </button>

        <div className="avatar" title={`${user?.email} — Déconnexion`}>
          {initial}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          onUpload([...e.target.files])
          e.target.value = ''
        }}
      />
    </div>
  )
}