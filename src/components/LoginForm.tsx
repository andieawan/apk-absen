// src/components/LoginForm.tsx
import { useState } from 'react';
import { authenticate, appTheme } from '../utils/auth';

interface LoginFormProps {
  onLogin: (user: { username: string; role: string }) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authenticate(username, password);
    if (user) {
      onLogin({ username: user.username, role: user.role });
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: appTheme.background, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: appTheme.font }}>
      <form onSubmit={handleSubmit} style={{ minWidth: 320, width: '100%', maxWidth: 360, padding: 32, background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}` }}>
        <h2 style={{ background: appTheme.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 700, marginBottom: 24, textAlign: 'center', letterSpacing: 1 }}>Login Absensi</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '90%', alignSelf: 'center', padding: 12, borderRadius: 8, border: `1px solid ${appTheme.border}`, fontSize: 16 }}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '90%', alignSelf: 'center', padding: 12, borderRadius: 8, border: `1px solid ${appTheme.border}`, fontSize: 16 }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>{error}</div>}
        <button type="submit" style={{ width: '90%', alignSelf: 'center', padding: 14, background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, letterSpacing: 1, boxShadow: '0 1px 4px #0001', cursor: 'pointer', marginBottom: 8 }}>Login</button>
        <div style={{ marginTop: 16, color: '#888', fontSize: 13, textAlign: 'center' }}>
          <span>Admin: <b>admin</b> / <b>1234</b></span>
        </div>
      </form>
    </div>
  );
}
