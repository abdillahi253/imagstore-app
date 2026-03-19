export default function ToastStack({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast${t.type === 'err' ? ' err' : ''}`}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}