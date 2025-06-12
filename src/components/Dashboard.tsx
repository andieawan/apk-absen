// =============================
// Komponen Dashboard
// Halaman utama navigasi aplikasi, menampilkan menu ke semua fitur utama.
// Kode ini mudah dimodifikasi, cocok untuk pemula yang ingin menambah menu atau mengatur hak akses fitur.
// =============================
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
import ImportTeacherSchedule from './ImportTeacherSchedule';
import TeacherPage from './TeacherPage';
import SchedulePage from './SchedulePage';
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
  const [menuOpen, setMenuOpen] = useState<{[key:string]: boolean}>({});

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

  const toggleMenu = (key: string) => setMenuOpen(m => ({ ...m, [key]: !m[key] }));

  // Filter menu sesuai role
  function getMenuByRole(role: UserRole) {
    if (role === 'admin') {
      return {
        master: true, akademik: true, laporan: true, utilitas: true
      };
    }
    if (role === 'subject_teacher') {
      return {
        master: false, akademik: true, laporan: true, utilitas: false
      };
    }
    if (role === 'homeroom_teacher') {
      return {
        master: false, akademik: true, laporan: true, utilitas: false
      };
    }
    if (role === 'counselor') {
      return {
        master: false, akademik: false, laporan: true, utilitas: false
      };
    }
    return { master: false, akademik: false, laporan: false, utilitas: false };
  }

  // Ganti render menu utama:
  const menuAccess = getMenuByRole(role);

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
          {/* Data Master */}
          {menuAccess.master && (
          <div>
            <div style={{ fontWeight: 700, cursor: 'pointer', margin: '12px 0 4px 0', color: appTheme.primaryColor }} onClick={() => toggleMenu('master')}>Data Master ▾</div>
            {menuOpen['master'] && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                <button onClick={() => setPage('student')} style={menuBtnStyle('student', page)}>Data Siswa</button>
                <button onClick={() => setPage('teacher')} style={menuBtnStyle('teacher', page)}>Data Guru</button>
                <button onClick={() => setPage('kelas')} style={menuBtnStyle('kelas', page)}>Kelas</button>
              </div>
            )}
          </div>
          )}
          {/* Akademik */}
          {menuAccess.akademik && (
          <div>
            <div style={{ fontWeight: 700, cursor: 'pointer', margin: '12px 0 4px 0', color: appTheme.primaryColor }} onClick={() => toggleMenu('akademik')}>Akademik ▾</div>
            {menuOpen['akademik'] && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                <button onClick={() => setPage('absensi')} style={menuBtnStyle('absensi', page)}>Absensi</button>
                <button onClick={() => setPage('schedule')} style={menuBtnStyle('schedule', page)}>Jadwal</button>
                <button onClick={() => setPage('grading')} style={menuBtnStyle('grading', page)}>Penilaian</button>
              </div>
            )}
          </div>
          )}
          {/* Laporan */}
          {menuAccess.laporan && (
          <div>
            <div style={{ fontWeight: 700, cursor: 'pointer', margin: '12px 0 4px 0', color: appTheme.primaryColor }} onClick={() => toggleMenu('laporan')}>Laporan ▾</div>
            {menuOpen['laporan'] && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                <button onClick={() => setPage('rekap')} style={menuBtnStyle('rekap', page)}>Rekap</button>
                <button onClick={() => setPage('export')} style={menuBtnStyle('export', page)}>Export</button>
              </div>
            )}
          </div>
          )}
          {/* Utilitas */}
          {menuAccess.utilitas && (
          <div>
            <div style={{ fontWeight: 700, cursor: 'pointer', margin: '12px 0 4px 0', color: appTheme.primaryColor }} onClick={() => toggleMenu('utilitas')}>Utilitas ▾</div>
            {menuOpen['utilitas'] && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                <button
                  onClick={() => setPage('import')}
                  style={menuBtnStyle('import', page)}
                >Import Data</button>
              </div>
            )}
          </div>
          )}
        </div>
        {/* Content */}
        {(role === 'admin' || page === 'import') && page === 'import' && (
          <div>
            <ImportStudent onImport={() => {}} />
            <div style={{ height: 24 }} />
            <ImportTeacherSchedule onImport={() => {}} />
          </div>
        )}
        {(role === 'admin' || page === 'absensi') && page === 'absensi' && <AttendancePage role={role} />}
        {(role === 'admin' || page === 'rekap') && page === 'rekap' && <RecapAttendancePage role={role} />}
        {(role === 'admin' || page === 'grading') && page === 'grading' && <GradingPage />}
        {(role === 'admin' || page === 'analytics') && page === 'analytics' && <AnalyticsPage />}
        {(role === 'admin' || page === 'calendar') && page === 'calendar' && <CalendarPage />}
        {(role === 'admin' || page === 'export') && page === 'export' && <ExportPage />}
        {(role === 'admin' || page === 'kelas') && page === 'kelas' && <ClassPage />}
        {page === 'student' && <StudentPage />}
        {(role === 'admin' || page === 'teacher') && page === 'teacher' && (
          // Kirim username dan role ke TeacherPage agar fitur edit profil guru berjalan benar
          <TeacherPage username={username} role={role} />
        )}
        {(role === 'admin' || page === 'schedule') && page === 'schedule' && <SchedulePage />}
        {/* Role subject_teacher: hanya akses absensi, jadwal, penilaian, rekap, export */}
        {role === 'subject_teacher' && page === '' && (
          <div style={{ color: appTheme.text, textAlign: 'center', marginTop: 32, fontSize: 16, fontWeight: 500 }}>
            Pilih menu Akademik atau Laporan untuk mulai menggunakan fitur guru mata pelajaran.
          </div>
        )}
        {/* Role homeroom_teacher: akses absensi, jadwal, penilaian, rekap, export */}
        {role === 'homeroom_teacher' && page === '' && (
          <div style={{ color: appTheme.text, textAlign: 'center', marginTop: 32, fontSize: 16, fontWeight: 500 }}>
            Pilih menu Akademik atau Laporan untuk mulai menggunakan fitur wali kelas.
          </div>
        )}
        {/* Role counselor: hanya akses laporan */}
        {role === 'counselor' && page === '' && (
          <div style={{ color: appTheme.text, textAlign: 'center', marginTop: 32, fontSize: 16, fontWeight: 500 }}>
            Pilih menu Laporan untuk melihat rekap dan export data siswa.
          </div>
        )}
      </div>
    </div>
  );
}

// Helper style function
function menuBtnStyle(key: string, page: string) {
  return {
    minWidth: 120,
    background: page===key?appTheme.primaryColor:'#f4f6fb',
    color: page===key?'#fff':appTheme.primaryColor,
    border: `2px solid ${appTheme.primaryColor}`,
    borderRadius: 10,
    padding: '12px 0',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    boxShadow: '0 1px 4px #0001',
    transition: 'all 0.2s',
  };
}
