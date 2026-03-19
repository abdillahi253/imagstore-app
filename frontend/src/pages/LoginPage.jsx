import { useState } from 'react'
import { login, register } from '../api/api'

export default function LoginPage({ onLogin, showToast }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function submit() {
    if (!email || !password) return setErr('Remplis tous les champs.')
    setLoading(true)
    setErr('')
    try {
      if (mode === 'register') {
        await register(email, password)
        showToast('Compte créé ! Connecte-toi.')
        setMode('login')
        setPassword('')
      } else {
        const data = await login(email, password)
        localStorage.setItem('token', data.token)
        onLogin({ email })
      }
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">📷</div>
        <div className="login-title">Imagstore Photos</div>
        <div className="login-sub">
          {mode === 'login' ? 'Connexion à ton espace photo' : 'Crée ton compte'}
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@exemple.fr"
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>

        <div className="field">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>

        <button className="btn-primary" onClick={submit} disabled={loading}>
          {loading ? '...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
        </button>

        {err && <div className="err-msg">{err}</div>}

        <div className="login-switch">
          {mode === 'login' ? (
            <>
              Pas de compte ?{' '}
              <a onClick={() => { setMode('register'); setErr('') }}>
                Créer un compte
              </a>
            </>
          ) : (
            <>
              Déjà un compte ?{' '}
              <a onClick={() => { setMode('login'); setErr('') }}>
                Se connecter
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}