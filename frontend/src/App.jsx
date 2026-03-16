import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5050';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [view, setView] = useState(token ? 'gallery' : 'login');

  // Inscription
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      setMessage('Inscription réussie, connectez-vous.');
      setView('login');
    } else {
      const data = await res.json();
      setMessage(data.error || 'Erreur');
    }
  };

  // Connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setView('gallery');
      setMessage('Connexion réussie');
    } else {
      setMessage(data.error || 'Erreur');
    }
  };

  // Déconnexion
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setView('login');
    setPhotos([]);
    setMessage('Déconnecté');
  };

  // Upload photo
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setMessage('');
    const formData = new FormData();
    formData.append('photo', file);
    const res = await fetch(`${API_URL}/api/photos/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    if (res.ok) {
      setMessage('Photo uploadée');
      fetchPhotos();
    } else {
      const data = await res.json();
      setMessage(data.error || 'Erreur upload');
    }
  };

  // Récupérer les photos
  const fetchPhotos = async () => {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/photos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setPhotos(data);
    } else {
      setPhotos([]);
    }
  };

  useEffect(() => {
    if (token) fetchPhotos();
  }, [token]);

  return (
    <div className="container">
      <div className="header">
        <span className="logo">Imagstore</span>
        {view === 'gallery' && token && (
          <button onClick={handleLogout} style={{background:'#e53935'}}>Déconnexion</button>
        )}
      </div>
      {message && <div className="message">{message}</div>}
      {view === 'login' && (
        <form onSubmit={handleLogin} className="auth-form">
          <h2>Connexion</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Se connecter</button>
          <button type="button" onClick={() => setView('register')}>Créer un compte</button>
        </form>
      )}
      {view === 'register' && (
        <form onSubmit={handleRegister} className="auth-form">
          <h2>Inscription</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">S'inscrire</button>
          <button type="button" onClick={() => setView('login')}>Déjà inscrit ?</button>
        </form>
      )}
      {view === 'gallery' && token && (
        <>
          <form onSubmit={handleUpload} className="upload-form">
            <h2>Uploader une photo</h2>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
            <button type="submit">Upload</button>
          </form>
          <h2>Ma galerie</h2>
          <div className="gallery">
            {photos.length === 0 && <p>Aucune photo</p>}
            {photos.map(photo => (
              <div key={photo.id} className="photo-item">
                <img src={`${API_URL}/${photo.path}`} alt={photo.originalname} />
                <div>{photo.originalname}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
