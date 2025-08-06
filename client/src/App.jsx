import React, { useState } from 'react';
import { register, login } from './api';
import './App.css';

function App() {
  const [mode, setMode] = useState('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'register') {
        await register({ name, email, password });
        setMessage('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setMode('login');
      } else {
        const res = await login({ email, password });
        setToken(res.data.token);
        setMessage('Giriş başarılı!');
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Bir hata oluştu');
    }
  };

  return (
    <div className="App">
      <h1>Çocuk Günlük Uygulaması</h1>
      <div>
        <button onClick={() => setMode('register')}>Kayıt Ol</button>
        <button onClick={() => setMode('login')}>Giriş Yap</button>
      </div>
      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Adınız"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {mode === 'register' ? 'Kayıt Ol' : 'Giriş Yap'}
        </button>
      </form>
      {message && <p>{message}</p>}
      {token && <p><strong>Token:</strong> {token}</p>}
    </div>
  );
}

export default App;
