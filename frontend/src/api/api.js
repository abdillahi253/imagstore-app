export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050'

export const getToken = () => localStorage.getItem('token')

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
})

// ── Auth ────────────────────────────────────────────────────────────────────

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur de connexion')
  return data // { token }
}

export async function register(email, password) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Erreur d'inscription")
  return data
}

// ── Photos ──────────────────────────────────────────────────────────────────

export async function fetchPhotos() {
  const res = await fetch(`${API_URL}/api/photos`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Erreur chargement des photos')
  return res.json() // [{ id, path, originalname }]
}

export async function deletePhoto(id) {
  const res = await fetch(`${API_URL}/api/photos/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error(`Erreur suppression (${id})`)
  return res.json().catch(() => ({}))
}

/**
 * Upload a single file with XHR for progress tracking.
 * @param {File} file
 * @param {(pct: number) => void} onProgress
 */
export function uploadPhoto(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('photo', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API_URL}/api/photos/upload`)
    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(new Error(`Upload échoué (${xhr.status})`))
      }
    }
    xhr.onerror = () => reject(new Error('Erreur réseau'))
    xhr.send(formData)
  })
}

/** Helper: photo src URL */
export const photoUrl = (photo) => `${API_URL}/${photo.path}`