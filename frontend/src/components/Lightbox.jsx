import { useState, useEffect } from 'react'
import { photoUrl, API_URL } from '../api/api'

export default function Lightbox({ photos, index, onClose, onDelete }) {
  const [idx, setIdx] = useState(index)
  const photo = photos[idx]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(photos.length - 1, i + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photos, onClose])

  if (!photo) return null

  return (
    <div
      className="lightbox"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lightbox-img-wrap">
        <img src={photoUrl(photo)} alt={photo.originalname} />
        <button className="lb-btn lb-close" onClick={onClose}>✕</button>
      </div>

      {idx > 0 && (
        <button className="lb-btn lb-prev" onClick={() => setIdx((i) => i - 1)}>
          ‹
        </button>
      )}
      {idx < photos.length - 1 && (
        <button className="lb-btn lb-next" onClick={() => setIdx((i) => i + 1)}>
          ›
        </button>
      )}

      <div className="lb-footer">
        <div className="lb-filename">{photo.originalname}</div>
        <div className="lb-actions">
          <a
            href={photoUrl(photo)}
            download={photo.originalname}
            className="lb-action-btn"
            onClick={(e) => e.stopPropagation()}
          >
            ⬇ Télécharger
          </a>
          <button
            className="lb-action-btn danger"
            onClick={() => { onDelete([photo.id]); onClose() }}
          >
            🗑 Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}