// =============================
// Utilitas Autentikasi & Tema
// Berisi data user, fungsi autentikasi, dan tema aplikasi (appTheme).
// Mudah dikembangkan untuk menambah user/role baru.
// =============================
// src/utils/auth.ts
import type { User, UserRole } from '../types/User';

const users: User[] = [
  { username: 'admin', password: '1234', role: 'admin' },
  { username: 'guru1', password: '1234', role: 'subject_teacher' },
  { username: 'walikelas1', password: '1234', role: 'homeroom_teacher' },
  { username: 'bk1', password: '1234', role: 'counselor' },
  // Tambahkan user lain di sini jika perlu
];

// Utility untuk styling login/dashboard
export const appTheme = {
  primary: 'linear-gradient(90deg, #646cff 0%, #3f51b5 100%)',
  primaryColor: '#646cff',
  background: 'linear-gradient(135deg, #f4f6fb 0%, #e3e9f7 100%)',
  card: 'rgba(255,255,255,0.95)',
  border: 'rgba(100,108,255,0.12)',
  radius: 20,
  shadow: '0 8px 32px #646cff33',
  font: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  text: '#222',
  accent: '#3f51b5',
  glass: 'backdrop-filter: blur(8px); background: rgba(255,255,255,0.85);',
};

export function authenticate(username: string, password: string): User | null {
  return users.find(
    (u) => u.username === username && u.password === password
  ) || null;
}

export function getRole(username: string): UserRole | null {
  const user = users.find((u) => u.username === username);
  return user ? user.role : null;
}
