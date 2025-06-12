// =============================
// Komponen Kalender Kehadiran
// Menampilkan kalender bulanan, navigasi bulan, dan highlight hari ini.
// Cocok untuk integrasi jadwal & absensi di masa depan.
// Kode sederhana, mudah dikembangkan untuk pemula.
// =============================

import { useState } from 'react';
import { appTheme } from '../utils/auth';

function getMonthDays(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function CalendarPage() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const days = getMonthDays(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };
  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  return (
    <div style={{ background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}`, padding: 32, marginTop: 16, color: appTheme.text, ...appTheme.glass ? { backdropFilter: 'blur(8px)' } : {} }}>
      <h2 style={{ color: appTheme.primaryColor, marginTop: 0, textAlign: 'center', letterSpacing: 1 }}>Kalender Kehadiran</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
        <button onClick={handlePrev} style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 18, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}>{'<'}</button>
        <div style={{ fontWeight: 700, fontSize: 20, color: appTheme.text, minWidth: 180, textAlign: 'center' }}>{monthNames[month]} {year}</div>
        <button onClick={handleNext} style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 18, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}>{'>'}</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.92)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
          <thead style={{ background: appTheme.primaryColor, color: '#fff' }}>
            <tr>
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                <th key={d} style={{ padding: 10, fontWeight: 600 }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil((days + firstDay) / 7) }).map((_, weekIdx) => (
              <tr key={weekIdx}>
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const date = weekIdx * 7 + dayIdx - firstDay + 1;
                  const isToday = date === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                  return (
                    <td key={dayIdx} style={{
                      padding: 10,
                      textAlign: 'center',
                      background: isToday ? appTheme.accent : 'transparent',
                      color: isToday ? '#fff' : appTheme.text,
                      borderRadius: isToday ? 8 : 0,
                      fontWeight: isToday ? 700 : 400,
                      boxShadow: isToday ? '0 2px 8px #3f51b522' : undefined
                    }}>
                      {date > 0 && date <= days ? date : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 20, color: appTheme.text, fontSize: 15, textAlign: 'center', fontWeight: 500 }}>
        Fitur-fitur aplikasi: Absensi, Import Siswa, Penilaian, Analitik, Kalender, Export, dan lainnya.
      </div>
      <div style={{ marginTop: 8, color: '#888', fontSize: 13, textAlign: 'center' }}>
        * Integrasi data absensi & jadwal otomatis akan dikembangkan.
      </div>
    </div>
  );
}
