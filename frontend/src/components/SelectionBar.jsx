export default function SelectionBar({ count, onDelete, onClear }) {
  return (
    <div className="sel-bar">
      <div className="sel-count">
        ✓ {count} sélectionnée{count > 1 ? 's' : ''}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="sel-btn sel-btn-del" onClick={onDelete}>
          🗑 Supprimer
        </button>
        <button className="sel-btn sel-btn-close" onClick={onClear}>
          ✕
        </button>
      </div>
    </div>
  )
}