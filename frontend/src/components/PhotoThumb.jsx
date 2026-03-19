import { photoUrl } from '../api/api'

export default function PhotoThumb({ photo, selected, onSelect, onOpen }) {
  return (
    <div
      className={`photo-thumb${selected ? ' selected' : ''}`}
      onClick={onOpen}
    >
      <img
        src={photoUrl(photo)}
        alt={photo.originalname}
        loading="lazy"
      />
      <div className="overlay">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            className="check-circle"
            onClick={(e) => { e.stopPropagation(); onSelect() }}
          >
            {selected ? '✓' : ''}
          </div>
        </div>
        <div className="photo-name">{photo.originalname}</div>
      </div>
    </div>
  )
}