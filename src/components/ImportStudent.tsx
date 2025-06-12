// =============================
// Komponen Import Siswa
// Fitur: import data siswa dari file Excel, otomatis menambah kelas jika belum ada, dan filter kelas.
// Terdapat tombol download template dan upload file Excel.
// Kode ini cocok untuk pemula yang ingin belajar proses import data di React.
// =============================

import { db } from '../utils/db';
import { appTheme } from '../utils/auth';
import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

interface ImportStudentProps {
  onImport: (students: { name: string; className: string }[]) => void;
}

export default function ImportStudent({ onImport }: ImportStudentProps) {
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const classes = db.getClasses();
  const [selectedClass, setSelectedClass] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
      // Asumsi baris pertama header, baris berikutnya nama siswa dan kelas
      const students = json.slice(1).map(row => ({ name: row[0] || '', className: row[1] || '' })).filter(s => s.name && s.className);
      // Tambahkan kelas baru jika belum ada
      students.forEach(s => {
        if (!classes.find(c => c.name === s.className)) {
          db.addClass({ id: 'k' + (classes.length + 1 + Math.random()), name: s.className });
        }
      });
      // Tambahkan siswa ke db
      students.forEach(s => {
        const classObj = db.getClasses().find(c => c.name === s.className);
        if (classObj) {
          db.addStudent({ id: 's' + Date.now() + Math.random(), name: s.name, classId: classObj.id });
        }
      });
      setUploadMessage('File berhasil diupload dan data siswa+kelas diimpor!');
      onImport(students);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ margin: '24px 0', padding: 16, background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}` }}>
      <h3 style={{ color: appTheme.primaryColor, marginTop: 0, background: 'none', WebkitBackgroundClip: 'initial', WebkitTextFillColor: 'initial' }}>Import Data Siswa (Excel)</h3>
      <a
        href="/template_import_siswa.xlsx"
        download
        style={{
          display: 'inline-block',
          marginBottom: 12,
          background: appTheme.primaryColor,
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '8px 18px',
          fontWeight: 600,
          fontSize: 15,
          textDecoration: 'none',
          boxShadow: '0 1px 4px #0001',
          cursor: 'pointer',
        }}
      >
        Download Template Excel
      </a>
      <br />
      <label style={{ display: 'inline-block', marginBottom: 12 }}>
        <span style={{
          background: appTheme.primaryColor,
          color: '#fff',
          borderRadius: 8,
          padding: '8px 18px',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
          boxShadow: '0 1px 4px #0001',
          border: 'none',
          marginRight: 8,
        }}>
          Upload File Excel
          <input type="file" accept=".xlsx,.xls" ref={fileInput} onChange={handleFile} style={{ display: 'none' }} />
        </span>
      </label>
      {uploadMessage && (
        <div style={{ color: 'green', fontWeight: 600, marginBottom: 8 }}>{uploadMessage}</div>
      )}
      <div style={{ color: '#888', fontSize: 13 }}>
        Format: Kolom pertama berisi nama siswa, kolom kedua nama kelas. File Excel/CSV harus berekstensi .xlsx, .xls, atau .csv
      </div>
      {/* Filter kelas (opsional, untuk fitur lanjutan) */}
      <div style={{ marginTop: 16 }}>
        <label style={{ fontWeight: 600, color: appTheme.text }}>
          Filter Kelas:
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ marginLeft: 8, padding: 8, borderRadius: 8, border: `1px solid ${appTheme.border}`, fontSize: 16 }}>
            <option value="">Semua</option>
            {db.getClasses().map(k => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
