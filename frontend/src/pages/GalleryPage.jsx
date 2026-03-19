import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchPhotos, deletePhoto, uploadPhoto } from '../api/api'
import PhotoThumb from '../components/PhotoThumb'
import Lightbox from '../components/Lightbox'
import UploadZone from '../components/UploadZone'
import DeleteModal from '../components/DeleteModal'
import UploadProgress from '../components/UploadProgress'

export default function GalleryPage({ tab, onTabChange, showToast, search, onUploadReady }) {
  const [photos, setPhotos]           = useState([])
  const [loading, setLoading]         = useState(false)
  const [selected, setSelected]       = useState([])
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [confirmDelete, setConfirmDelete]   = useState(null)

  useEffect(() => { loadPhotos() }, [])

  // ── Load ──────────────────────────────────────────────────────────────────
  async function loadPhotos() {
    setLoading(true)
    try {
      const data = await fetchPhotos()
      setPhotos(Array.isArray(data) ? data : [])
    } catch (e) {
      showToast(e.message, 'err')
    } finally {
      setLoading(false)
    }
  }

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleUpload = useCallback(async (files) => {
    const imageFiles = files.filter((f) => f.type.startsWith('image/'))
    if (!imageFiles.length) return

    const total = imageFiles.length
    let done = 0
    setUploadProgress({ pct: 0, done: 0, total })

    for (const file of imageFiles) {
      try {
        await uploadPhoto(file, (filePct) => {
          const overall = Math.round((done / total) * 100 + filePct / total)
          setUploadProgress({ pct: overall, done, total })
        })
        done++
        setUploadProgress({ pct: Math.round((done / total) * 100), done, total })
      } catch {
        showToast(`Echec : ${file.name}`, 'err')
      }
    }

    setTimeout(() => setUploadProgress(null), 800)
    showToast(`${done} photo${done > 1 ? 's' : ''} ajoutee${done > 1 ? 's' : ''} OK`)
    loadPhotos()
  }, []) // eslint-disable-line

  // Expose handleUpload au parent UNE SEULE FOIS (ref pour eviter boucle)
  const registeredRef = useRef(false)
  useEffect(() => {
    if (!registeredRef.current && onUploadReady) {
      registeredRef.current = true
      onUploadReady(handleUpload)
    }
  }, []) // eslint-disable-line

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(ids) {
    let deleted = 0
    for (const id of ids) {
      try { await deletePhoto(id); deleted++ } catch {}
    }
    setSelected([])
    setConfirmDelete(null)
    showToast(`${deleted} photo${deleted > 1 ? 's' : ''} supprimee${deleted > 1 ? 's' : ''}`)
    loadPhotos()
  }

  // ── Selection ─────────────────────────────────────────────────────────────
  function toggleSelect(id) {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id])
  }

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = photos.filter((p) =>
    !search || (p.originalname || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {tab === 'upload' && (
        <>
          <div className="page-title">Importer des photos</div>
          <UploadZone onUpload={handleUpload} />
        </>
      )}

      {tab === 'photos' && (
        <>
          {loading ? (
            <div className="spinner" />
          ) : filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🌅</div>
              {search ? (
                <>
                  <p>Aucun resultat pour "{search}"</p>
                  <small>Essaie un autre nom de fichier.</small>
                </>
              ) : (
                <>
                  <p>Aucune photo pour l'instant</p>
                  <small>Importe des photos pour les voir ici.</small>
                  <button className="btn-primary" onClick={() => onTabChange('upload')}>
                    Importer
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="date-section">
              <div className="date-label">
                Toutes les photos
                <span className="date-count">{filtered.length}</span>
              </div>
              <div className="photo-grid">
                {filtered.map((photo, i) => (
                  <PhotoThumb
                    key={photo.id || i}
                    photo={photo}
                    selected={selected.includes(photo.id)}
                    onSelect={() => toggleSelect(photo.id)}
                    onOpen={() => setLightboxIdx(i)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {lightboxIdx !== null && (
        <Lightbox
          photos={filtered}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onDelete={(ids) => setConfirmDelete(ids)}
        />
      )}

      {confirmDelete && (
        <DeleteModal
          count={confirmDelete.length}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {uploadProgress && (
        <UploadProgress
          pct={uploadProgress.pct}
          done={uploadProgress.done}
          total={uploadProgress.total}
        />
      )}

      {selected.length > 0 && (
        <div className="sel-bar">
          <div className="sel-count">
            {selected.length} selectionnee{selected.length > 1 ? 's' : ''}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="sel-btn sel-btn-del" onClick={() => setConfirmDelete(selected)}>
              Supprimer
            </button>
            <button className="sel-btn sel-btn-close" onClick={() => setSelected([])}>
              X
            </button>
          </div>
        </div>
      )}
    </>
  )
}