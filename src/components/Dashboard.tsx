// src/components/Dashboard.tsx
import type { UserRole } from '../types/User';
import AttendancePage from './AttendancePage';
import ImportStudent from './ImportStudent';
import GradingPage from './GradingPage';
import AnalyticsPage from './AnalyticsPage';
import CalendarPage from './CalendarPage';
import ExportPage from './ExportPage';
import RecapAttendancePage from './RecapAttendancePage';
import ClassPage from './ClassPage';
import StudentPage from './StudentPage';
import { appTheme } from '../utils/auth';
import { useState, useEffect } from 'react';

interface DashboardProps {
  username: string;
  role: UserRole;
  onLogout: () => void;
}

export default function Dashboard({ username, role, onLogout }: DashboardProps) {
  const [page, setPage] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Tambahkan event listener online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: appTheme.background, fontFamily: appTheme.font, padding: 0, margin: 0 }}>
      <div style={{ maxWidth: 900, margin: 'auto', padding: '32px 0' }}>
        {/* Status koneksi */}
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
          <span style={{
            background: isOnline ? '#4caf50' : '#e53935',
            color: '#fff',
            borderRadius: 8,
            padding: '6px 16px',
            fontWeight: 600,
            fontSize: 14,
            boxShadow: '0 1px 4px #0002',
            letterSpacing: 1
          }}>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        {/* Header */}
        <div style={{
          background: appTheme.card,
          borderRadius: appTheme.radius,
          boxShadow: appTheme.shadow,
          border: `1px solid ${appTheme.border}`,
          padding: '32px 32px 24px 32px',
          marginBottom: 32,
          color: appTheme.text,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          ...appTheme.glass ? { backdropFilter: 'blur(8px)' } : {}
        }}>
          <div>
            <h2 style={{
              background: appTheme.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 800,
              fontSize: 32,
              margin: 0,
              letterSpacing: 1
            }}>Dashboard</h2>
            <div style={{ color: '#555', fontSize: 16, marginTop: 8 }}>
              Selamat datang, <b>{username}</b>!<br />
              Role: <b>{role}</b>
            </div>
          </div>
          <button onClick={onLogout} style={{
            background: appTheme.primaryColor,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 28px',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #646cff22',
            transition: 'background 0.2s',
            marginLeft: 24
          }}>Logout</button>
        </div>
        {/* Menu */}
        <div style={{
          background: appTheme.card,
          borderRadius: appTheme.radius,
          boxShadow: appTheme.shadow,
          border: `1px solid ${appTheme.border}`,
          padding: 24,
          color: appTheme.text,
          marginBottom: 32,
          ...appTheme.glass ? { backdropFilter: 'blur(8px)' } : {}
        }}>
          <h3 style={{ color: appTheme.primaryColor, marginTop: 0, fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>Menu Utama</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginBottom: 24, justifyContent: 'center' }}>
            <button onClick={() => setPage('absensi')} style={{ minWidth: 140, background: page==='absensi'?appTheme.primaryColor:'#f4f6fb', color: page==='absensi'?'#fff':appTheme.primaryColor, border: `2px solid ${appTheme.primaryColor}`, borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', transition: 'all 0.2s' }}>Absensi</button>
            <button onClick={() => setPage('rekap')} style={{ minWidth: 140, background: page==='rekap'?appTheme.primaryColor:'#f4f6fb', color: page==='rekap'?'#fff':appTheme.primaryColor, border: `2px solid ${appTheme.primaryColor}`, borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', transition: 'all 0.2s' }}>Rekap Absensi</button>
            <button onClick={() => setPage('import')} style={{ minWidth: 140, background: page==='import'?appTheme.primaryColor:'#f4f6fb', color: page==='import'?'#fff':appTheme.primaryColor, border: `2px solid ${appTheme.primaryColor}`, borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', transition: 'all 0.2s' }}>Import Siswa</button>
            <button onClick={() => setPage('grading')} style={{ minWidth: 140, background: page==='grading'?appTheme.primaryColor:'#f4f6fb', color: page==='grading'?'#fff':appTheme.primaryColor, border: `2px solid ${appTheme.primaryColor}`, borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', transition: 'all 0.2s' }}>Penilaian</button>
            <button onClick={() => setPage('analytics')} style={{ minWidth: 140, background: page==='analytics'?appTheme.primaryColor:'#f4f6fb', color: page==='analytics'?'#fff':appTheme.primaryColor, border: `2px solid ${appTheme.primaryColor}`, borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', transition: 'all 0.2s' }}>Analitik</button>
            <button onClick={() => setPage('calendar')} style={{ minWidth: 140, background: page==='calendar'?appTheme.primaryColor:'#f4f6fb', color: page==='calendar'?'#fff':appTheme.primaryColor, border: `2px solid ${appTheme.primaryColor}`, borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', transition: 'all 0.2s' }}>Kalender</button>
            <button onClick={() => setPage('export')} style={{ minWidth: 140, background: page==='export'?appTheme.primaryColor:'#f4f6fb', color: page==='export'?'#fff':appTheme.primaryColor, border: `2px solid ${appTheme.primaryColor}`, borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', transition: 'all 0.2s' }}>Export</button>
            <button onClick={() => setPage('kelas')} style={{ minWidth: 140, background: page==='kelas'?appTheme.primaryColor:'#f4f6fb', color: page==='kelas'?'#fff':appTheme.primaryColor, border: `2px solid ${appTheme.primaryColor}`, borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', transition: 'all 0.2s' }}>Kelas</button>
            <button onClick={() => setPage('student')} style={{ minWidth: 140, background: page==='student'?appTheme.primaryColor:'#f4f6fb', color: page==='student'?'#fff':appTheme.primaryColor, border: `2px solid ${appTheme.primaryColor}`, borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', transition: 'all 0.2s' }}>Data Siswa</button>
          </div>
          {!page && (
            <div style={{ color: appTheme.text, textAlign: 'center', marginTop: 32, fontSize: 16, fontWeight: 500 }}>
              Pilih menu di atas untuk mulai menggunakan fitur aplikasi.
            </div>
          )}
        </div>
        {/* Content */}
        {(role === 'admin' || page === 'absensi') && page === 'absensi' && <AttendancePage role={role} />}
        {(role === 'admin' || page === 'rekap') && page === 'rekap' && <RecapAttendancePage role={role} />}
        {(role === 'admin' || page === 'import') && page === 'import' && <ImportStudent onImport={() => {}} />}
        {(role === 'admin' || page === 'grading') && page === 'grading' && <GradingPage />}
        {(role === 'admin' || page === 'analytics') && page === 'analytics' && <AnalyticsPage />}
        {(role === 'admin' || page === 'calendar') && page === 'calendar' && <CalendarPage />}
        {(role === 'admin' || page === 'export') && page === 'export' && <ExportPage />}
        {(role === 'admin' || page === 'kelas') && page === 'kelas' && <ClassPage />}
        {page === 'student' && <StudentPage />}
      </div>
    </div>
  );
}
