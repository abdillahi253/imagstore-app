import { useState, useRef } from 'react'

export default function UploadZone({ onUpload }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const files = [...e.dataTransfer.files].filter((f) => f.type.startsWith('image/'))
    if (files.length) onUpload(files)
  }

  return (
    <div
      className={`upload-zone${dragging ? ' dragging' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => { onUpload([...e.target.files]); e.target.value = '' }}
      />
      <div className="upload-icon">📁</div>
      <p><strong>Clique pour choisir</strong> ou glisse des photos ici</p>
      <p style={{ marginTop: 6 }}>JPEG, PNG, GIF, WEBP · Plusieurs fichiers supportés</p>
    </div>
  )
}