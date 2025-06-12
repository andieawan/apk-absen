import { useState, useEffect } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import type { UserRole } from './types/User'
import { seedDummyData } from './utils/db'

function App() {
  const [user, setUser] = useState<{ username: string; role: UserRole } | null>(null)

  const handleLogin = (user: { username: string; role: string }) => {
    setUser({ username: user.username, role: user.role as UserRole })
  }

  // Seed data dummy saat development (hapus di produksi)
  useEffect(() => {
    if (import.meta.env.MODE !== 'production') {
      seedDummyData()
    }
  }, [])

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <Dashboard username={user.username} role={user.role} onLogout={() => setUser(null)} />
}

export default App
