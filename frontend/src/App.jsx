import { useState, useRef, useEffect } from 'react'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import ToastStack from './components/ToastStack'
import LoginPage from './pages/LoginPage'
import GalleryPage from './pages/GalleryPage'
import { useToast } from './hooks/useToast'

export default function App() {
  const [user, setUser]       = useState(null)
  const [tab, setTab]         = useState('photos')
  const [search, setSearch]   = useState('')
  const [dragging, setDragging] = useState(false)
  const [toasts, showToast]   = useToast()
  const uploadFnRef           = useRef(null)

  // Auto-login si token en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setUser({ email: localStorage.getItem('userEmail') || 'Utilisateur' })
    }
  }, [])

  function handleLogin(u) {
    localStorage.setItem('userEmail', u.email)
    setUser(u)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    setUser(null)
    setTab('photos')
    setSearch('')
  }

  function onGlobalDrop(e) {
    e.preventDefault()
    setDragging(false)
    const files = [...e.dataTransfer.files].filter((f) => f.type.startsWith('image/'))
    if (files.length && uploadFnRef.current) {
      uploadFnRef.current(files)
    }
  }

  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} showToast={showToast} />
        <ToastStack toasts={toasts} />
      </>
    )
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false) }}
      onDrop={onGlobalDrop}
    >
      <Topbar
        user={user}
        search={search}
        onSearch={setSearch}
        onUpload={(files) => uploadFnRef.current?.(files)}
        onLogout={handleLogout}
      />

      <Sidebar
        tab={tab}
        onTab={setTab}
        onLogout={handleLogout}
        photoCount={0}
      />

      <div
        className="main"
        style={dragging ? { outline: '3px dashed var(--accent)', outlineOffset: '-12px' } : {}}
      >
        {dragging && (
          <div className="drag-overlay">
            <div className="drag-overlay-text">
              📷
              <span>Depose ici pour importer</span>
            </div>
          </div>
        )}

        <GalleryPage
          tab={tab}
          onTabChange={setTab}
          showToast={showToast}
          search={search}
          onUploadReady={(fn) => { uploadFnRef.current = fn }} 
        />
      </div>

      <ToastStack toasts={toasts} />
    </div>
  )
}