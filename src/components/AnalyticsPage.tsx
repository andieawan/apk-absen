// =============================
// Komponen Dashboard Analitik
// Menampilkan ringkasan statistik kehadiran (hadir, izin, sakit, alfa) dan rata-rata nilai siswa.
// Cocok untuk menampilkan insight cepat bagi admin/guru.
// Kode sederhana, mudah dikembangkan untuk pemula.
// =============================

import { useState } from 'react';
import { appTheme } from '../utils/auth';

export default function AnalyticsPage() {
  // Dummy data for demo
  const [data] = useState({
    hadir: 80,
    izin: 10,
    sakit: 5,
    alfa: 5,
    nilai: [70, 80, 90, 85, 75, 95, 88, 92],
  });
  const total = data.hadir + data.izin + data.sakit + data.alfa;
  const hadirPct = Math.round((data.hadir / total) * 100);
  const izinPct = Math.round((data.izin / total) * 100);
  const sakitPct = Math.round((data.sakit / total) * 100);
  const alfaPct = Math.round((data.alfa / total) * 100);
  const avgNilai = Math.round(data.nilai.reduce((a, b) => a + b, 0) / data.nilai.length);

  return (
    <div style={{ background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}`, padding: 24, marginTop: 16 }}>
      <h2 style={{ color: appTheme.primary, marginTop: 0 }}>Dashboard Analitik</h2>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ flex: 1, minWidth: 180, background: '#f4f6fb', borderRadius: 8, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 32, color: appTheme.primary }}>{hadirPct}%</div>
          <div style={{ color: '#888' }}>Hadir</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#f4f6fb', borderRadius: 8, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 32, color: '#f7b731' }}>{izinPct}%</div>
          <div style={{ color: '#888' }}>Izin</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#f4f6fb', borderRadius: 8, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 32, color: '#eb3b5a' }}>{sakitPct}%</div>
          <div style={{ color: '#888' }}>Sakit</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#f4f6fb', borderRadius: 8, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 32, color: '#8854d0' }}>{alfaPct}%</div>
          <div style={{ color: '#888' }}>Alfa</div>
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <h4 style={{ color: appTheme.primary }}>Rata-rata Nilai Siswa</h4>
        <div style={{ fontSize: 28, color: appTheme.primary, marginBottom: 8 }}>{avgNilai}</div>
        <div style={{ color: '#888', fontSize: 13 }}>Grafik dummy, integrasi data nilai & absensi akan dikembangkan</div>
      </div>
    </div>
  );
}
