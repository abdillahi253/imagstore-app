export default function DeleteModal({ count, onConfirm, onCancel }) {
  return (
    <div
      className="modal-bg"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal">
        <h3>🗑 Supprimer {count > 1 ? `ces ${count} photos` : 'cette photo'} ?</h3>
        <p>
          Cette action est irréversible.{' '}
          {count > 1 ? 'Les photos seront' : 'La photo sera'} définitivement
          supprimée{count > 1 ? 's' : ''}.
        </p>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onCancel}>Annuler</button>
          <button className="btn-danger" onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  )
}