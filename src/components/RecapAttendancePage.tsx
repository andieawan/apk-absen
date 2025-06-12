// =============================
// Komponen Rekap Absensi
// Menampilkan rekap absensi siswa, filter berdasarkan tanggal, siswa, dan kelas.
// Fitur: export ke Excel, PDF, print, dan rekap per kategori serta per kelas.
// Kode ini mudah dipahami, cocok untuk pemula dan pengembang yang ingin menambah fitur rekap data.
// =============================

import { useState } from 'react';
import { appTheme } from '../utils/auth';
import { db } from '../utils/db';

interface RecapAttendancePageProps {
  role: string;
}

const allowedRoles = ['admin', 'subject_teacher', 'homeroom_teacher', 'counselor'];

export default function RecapAttendancePage({ role }: RecapAttendancePageProps) {
  const [selectedDateStart, setSelectedDateStart] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedDateEnd, setSelectedDateEnd] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState('');
  const classes = db.getClasses();
  const students = db.getStudents();
  const allRecords = db.getAttendance().filter(a => a.date >= selectedDateStart && a.date <= selectedDateEnd);
  // Filter by student if selected
  const filteredRecords = selectedStudent ? allRecords.filter(r => r.studentId === selectedStudent) : allRecords;
  // Ensure valid student records
  const rekapRecords = filteredRecords.filter(r => students.some(s => s.id === r.studentId));
  // Filter students by class
  const filteredStudents = selectedClass ? students.filter(s => s.classId === selectedClass) : students;

  // Rekap jumlah per kategori
  const categorySummary = ['hadir', 'izin', 'sakit', 'alfa'].map(cat => ({
    category: cat,
    count: rekapRecords.filter(r => r.category === cat).length
  }));

  if (!allowedRoles.includes(role)) {
    return (
      <div style={{ background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}`, padding: 32, marginTop: 16, color: appTheme.text, textAlign: 'center' }}>
        <h2 style={{ color: appTheme.primaryColor, marginTop: 0 }}>Akses Ditolak</h2>
        <div style={{ fontSize: 18, marginTop: 16 }}>Anda tidak memiliki akses ke fitur Rekap Absensi.</div>
      </div>
    );
  }

  return (
    <div style={{ background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}`, padding: 32, marginTop: 16, color: appTheme.text, ...appTheme.glass ? { backdropFilter: 'blur(8px)' } : {} }}>
      <h2 style={{ background: appTheme.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 800, marginTop: 0, marginBottom: 24, textAlign: 'center', letterSpacing: 1 }}>Rekap Absensi Siswa</h2>
      {/* Ringkasan kategori absensi */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 20 }}>
        {categorySummary.map(({ category, count }) => (
          <div key={category} style={{ minWidth: 90, background: '#f4f6fb', borderRadius: 10, padding: '12px 18px', textAlign: 'center', boxShadow: '0 1px 4px #0001', border: `1px solid ${appTheme.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: appTheme.primaryColor, marginBottom: 2 }}>{count}</div>
            <div style={{ fontSize: 13, color: '#555', textTransform: 'capitalize' }}>{category}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 16, justifyContent: 'flex-end' }}>
        <label style={{ fontWeight: 600, color: appTheme.text }}>Tanggal:
          <input type="date" value={selectedDateStart} max={selectedDateEnd} onChange={e => setSelectedDateStart(e.target.value)} style={{ marginLeft: 8, marginRight: 8, padding: 8, borderRadius: 8, border: `1px solid ${appTheme.border}`, fontSize: 16 }} />
          s/d
          <input type="date" value={selectedDateEnd} min={selectedDateStart} max={new Date().toISOString().slice(0, 10)} onChange={e => setSelectedDateEnd(e.target.value)} style={{ marginLeft: 8, padding: 8, borderRadius: 8, border: `1px solid ${appTheme.border}`, fontSize: 16 }} />
        </label>
        <label style={{ fontWeight: 600, color: appTheme.text }}>
          Kelas:
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ marginLeft: 8, marginRight: 8, padding: 8, borderRadius: 8, border: `1px solid ${appTheme.border}`, fontSize: 16 }}>
            <option value="">Semua</option>
            {classes.map(k => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
          </select>
        </label>
        <label style={{ fontWeight: 600, color: appTheme.text }}>
          Siswa:
          <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} style={{ marginLeft: 8, padding: 8, borderRadius: 8, border: `1px solid ${appTheme.border}`, fontSize: 16 }}>
            <option value="">Semua</option>
            {filteredStudents.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <button
          onClick={() => {
            if (rekapRecords.length === 0) return;
            const printWindow = window.open('', '_blank');
            if (!printWindow) return;
            const tableRows = rekapRecords.map(rec => {
              const student = students.find(s => s.id === rec.studentId);
              return `<tr><td>${rec.date}</td><td>${student ? student.name : '-'}</td><td>${rec.category}</td><td>${rec.note || ''}</td></tr>`;
            }).join('');
            printWindow.document.write(`
              <html><head><title>Print Rekap Absensi</title>
              <style>
                body { font-family: Inter, Arial, sans-serif; margin: 32px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #888; padding: 8px 12px; }
                th { background: #646cff; color: #fff; }
                tr:nth-child(even) { background: #f4f6fb; }
              </style>
              </head><body>
              <h2>Rekap Absensi Siswa</h2>
              <div style='margin-bottom:12px;'>Periode: <b>${selectedDateStart}</b> s/d <b>${selectedDateEnd}</b></div>
              <table><thead><tr><th>Tanggal</th><th>Nama</th><th>Kategori</th><th>Catatan</th></tr></thead><tbody>${tableRows}</tbody></table>
              <script>window.onload = function() { window.print(); }</script>
              </body></html>
            `);
            printWindow.document.close();
          }}
          style={{ background: '#fff', color: appTheme.primaryColor, border: `1.5px solid ${appTheme.primaryColor}`, borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}
        >
          Print
        </button>
        <button
          onClick={() => {
            if (rekapRecords.length === 0) return;
            const data = rekapRecords.map(rec => {
              const student = students.find(s => s.id === rec.studentId);
              return {
                Tanggal: rec.date,
                Nama: student ? student.name : '-',
                Kategori: rec.category,
                Catatan: rec.note || '',
              };
            });
            import('xlsx').then(XLSX => {
              const ws = XLSX.utils.json_to_sheet(data);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Rekap Absensi');
              XLSX.writeFile(wb, `rekap-absensi-${selectedDateStart}_sd_${selectedDateEnd}.xlsx`);
            });
          }}
          style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}
        >
          Export ke Excel
        </button>
        <button
          onClick={async () => {
            if (rekapRecords.length === 0) return;
            const [{ default: jsPDF }, autoTable] = await Promise.all([
              import('jspdf'),
              import('jspdf-autotable')
            ]);
            const doc = new jsPDF();
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text('Rekap Absensi Siswa', 14, 18);
            doc.setFontSize(11);
            doc.text(`Periode: ${selectedDateStart} s/d ${selectedDateEnd}`, 14, 26);
            const tableData = rekapRecords.map(rec => {
              const student = students.find(s => s.id === rec.studentId);
              return [rec.date, student ? student.name : '-', rec.category, rec.note || ''];
            });
            autoTable.default(doc, {
              head: [['Tanggal', 'Nama', 'Kategori', 'Catatan']],
              body: tableData,
              startY: 32,
              styles: { font: 'helvetica', fontSize: 10 },
              headStyles: { fillColor: [100, 108, 255] },
              alternateRowStyles: { fillColor: [244, 246, 251] },
            });
            doc.save(`rekap-absensi-${selectedDateStart}_sd_${selectedDateEnd}.pdf`);
          }}
          style={{ background: '#3f51b5', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}
        >
          Export ke PDF
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.96)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
          <thead style={{ background: appTheme.primaryColor, color: '#fff' }}>
            <tr>
              <th style={{ padding: 12, fontWeight: 700 }}>Tanggal</th>
              <th style={{ padding: 12, fontWeight: 700 }}>Nama</th>
              <th style={{ padding: 12, fontWeight: 700 }}>Kategori</th>
              <th style={{ padding: 12, fontWeight: 700 }}>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {rekapRecords.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: '#888' }}>Tidak ada data absensi untuk filter ini.</td></tr>
            ) : rekapRecords.map((rec) => {
              const student = students.find(s => s.id === rec.studentId);
              return (
                <tr key={rec.id} style={{ borderBottom: `1px solid ${appTheme.border}` }}>
                  <td style={{ padding: 12 }}>{rec.date}</td>
                  <td style={{ padding: 12 }}>{student ? student.name : '-'}</td>
                  <td style={{ padding: 12 }}>{rec.category}</td>
                  <td style={{ padding: 12 }}>{rec.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Rekap absensi per kelas */}
      {selectedClass === '' && (
        <div style={{ margin: '24px 0', background: '#f4f6fb', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px #0001', border: `1px solid ${appTheme.border}` }}>
          <h3 style={{ color: appTheme.primaryColor, marginTop: 0, marginBottom: 16 }}>Rekap Absensi per Kelas</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
            <thead style={{ background: appTheme.primaryColor, color: '#fff' }}>
              <tr>
                <th style={{ padding: 10 }}>Kelas</th>
                <th style={{ padding: 10 }}>Hadir</th>
                <th style={{ padding: 10 }}>Izin</th>
                <th style={{ padding: 10 }}>Sakit</th>
                <th style={{ padding: 10 }}>Alfa</th>
              </tr>
            </thead>
            <tbody>
              {classes.map(k => {
                const siswaKelas = students.filter(s => s.classId === k.id);
                const recordsKelas = rekapRecords.filter(r => siswaKelas.some(s => s.id === r.studentId));
                const count = (cat: string) => recordsKelas.filter(r => r.category === cat).length;
                return (
                  <tr key={k.id}>
                    <td style={{ padding: 10 }}>{k.name}</td>
                    <td style={{ padding: 10 }}>{count('hadir')}</td>
                    <td style={{ padding: 10 }}>{count('izin')}</td>
                    <td style={{ padding: 10 }}>{count('sakit')}</td>
                    <td style={{ padding: 10 }}>{count('alfa')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
