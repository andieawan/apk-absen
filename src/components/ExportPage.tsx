// =============================
// Komponen Export & Cetak Laporan
// Fitur: export data tabel ke Excel/CSV, contoh laporan sederhana.
// Cocok untuk pemula yang ingin belajar export data di React.
// =============================

import { useRef } from 'react';
import { appTheme } from '../utils/auth';
import * as XLSX from 'xlsx';

export default function ExportPage() {
  const tableRef = useRef<HTMLTableElement>(null);

  const handleExport = (type: 'xlsx' | 'csv') => {
    if (!tableRef.current) return;
    const ws = XLSX.utils.table_to_sheet(tableRef.current);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan');
    if (type === 'xlsx') {
      XLSX.writeFile(wb, 'laporan.xlsx');
    } else {
      XLSX.writeFile(wb, 'laporan.csv');
    }
  };

  return (
    <div style={{ background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}`, padding: 24, marginTop: 16 }}>
      <h2 style={{ color: appTheme.primary, marginTop: 0 }}>Export & Cetak Laporan</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => handleExport('xlsx')} style={{ marginRight: 12, background: appTheme.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Export ke Excel</button>
        <button onClick={() => handleExport('csv')} style={{ background: '#f4f6fb', color: appTheme.primary, border: `1px solid ${appTheme.primary}`, borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Export ke CSV</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table ref={tableRef} style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
          <thead style={{ background: appTheme.primary, color: '#fff' }}>
            <tr>
              <th style={{ padding: 10 }}>Nama</th>
              <th style={{ padding: 10 }}>Kehadiran</th>
              <th style={{ padding: 10 }}>Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 10 }}>Budi</td>
              <td style={{ padding: 10 }}>Hadir</td>
              <td style={{ padding: 10 }}>90</td>
            </tr>
            <tr>
              <td style={{ padding: 10 }}>Siti</td>
              <td style={{ padding: 10 }}>Izin</td>
              <td style={{ padding: 10 }}>85</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16, color: '#888', fontSize: 13 }}>
        * Data di atas hanya contoh. Integrasi data absensi & nilai akan dikembangkan.
      </div>
    </div>
  );
}
