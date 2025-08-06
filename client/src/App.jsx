// client/src/App.jsx
import { useState } from 'react'
import './App.css'
import * as api from './api'

function App() {
  const [mode, setMode] = useState('register') // 'register' veya 'login'
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (mode === 'register') {
        const res = await api.register({ username, email, password })
        setMessage(res.message)
      } else {
        const res = await api.login({ email, password })
        setToken(res.token)
        setMessage('Giriş başarılı!')
      }
    } catch (err) {
      setMessage(err.message || 'Hata oldu')
    }
  }

  return (
    <div className="App">
      <h1>Çocuk Günlük Uygulaması</h1>
      <div>
        <button onClick={()=>setMode('register')}>Kayıt Ol</button>
        <button onClick={()=>setMode('login')}>Giriş Yap</button>
      </div>
      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <input
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">
          {mode === 'register' ? 'Kayıt Ol' : 'Giriş Yap'}
        </button>
      </form>
      {message && <p>{message}</p>}
      {token && <p><strong>Token:</strong> {token}</p>}
    </div>
  )
}

export default App
